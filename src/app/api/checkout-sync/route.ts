/**
 * POST /api/checkout-sync
 *
 * Safety-net for when Stripe webhooks are delayed/misconfigured.
 * Given a Checkout Session ID, it retrieves the session from Stripe and
 * syncs the corresponding business row in Supabase.
 *
 * Auth: Bearer <supabase_access_token>
 * Body: { sessionId: string }
 */
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, getStripeColumns, getSupabaseUrl, getSupabaseAnonKey, requireEnv } from "@/lib/billing/config";

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const stripe = getStripeClient();

const { COL_CUSTOMER, COL_SUB } = getStripeColumns();

export async function POST(req: NextRequest) {
  try {
    // 1) Auth
    const authHeader = req.headers.get("authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const anonKey = getSupabaseAnonKey();
    const supabaseUser = createClient(SUPABASE_URL, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId." }, { status: 400 });
    }

    // 2) Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Must be a subscription Checkout
    const subscriptionId = session.subscription as string | null;
    const customerId = session.customer as string | null;
    const meta = (session.metadata ?? {}) as Record<string, string>;
    const businessId = meta.businessId;
    const plan = meta.plan ?? null;

    if (!businessId) {
      return NextResponse.json(
        { error: "Checkout session missing businessId metadata." },
        { status: 400 }
      );
    }

    // 3) Ensure the caller owns this business
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: bizRow } = await supabase
      .from("businesses")
      .select("id, owner_id")
      .eq("id", businessId)
      .maybeSingle();

    if (!bizRow || bizRow.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // 4) Only sync if payment is actually complete or trialing — never mark active for unpaid/expired sessions
    const paymentStatus = session.payment_status; // "paid" | "unpaid" | "no_payment_required"

    // "paid"               → customer was charged immediately (no trial or trial already ended)
    // "no_payment_required" → subscription is trialing; no charge yet but safe to provision access
    const shouldSync =
      customerId &&
      subscriptionId &&
      (paymentStatus === "paid" || paymentStatus === "no_payment_required");

    if (shouldSync) {
      // Use "trialing" when no payment was required (trial start), "active" when paid
      const syncedStatus = paymentStatus === "paid" ? "active" : "trialing";

      // For trials, sync the real trial_end from Stripe (not just now()).
      // For immediate payments, stamp trial_ends_at as past to clear old trial state.
      let trialEndsAt = new Date().toISOString(); // default: mark trial as ended (paid path)
      if (syncedStatus === "trialing" && subscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          if (sub.trial_end) {
            trialEndsAt = new Date(sub.trial_end * 1000).toISOString();
          }
        } catch (e) {
          console.error("[checkout-sync] could not fetch trial_end from Stripe:", e);
        }
      }

      await supabase
        .from("businesses")
        .update({
          subscription_status: syncedStatus,
          [COL_CUSTOMER]: customerId,
          [COL_SUB]: subscriptionId,
          trial_ends_at: trialEndsAt,
          ...(plan ? { subscription_plan: plan } : {}),
        })
        .eq("id", businessId);

      return NextResponse.json({ success: true, synced: true, status: syncedStatus });
    }

    // Payment incomplete (unpaid/abandoned) — don't provision access
    return NextResponse.json({ success: true, synced: false });

  } catch (err) {
    console.error("[checkout-sync] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

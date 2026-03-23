/**
 * POST /api/subscribe
 *
 * Called after the user has verified their OTP.
 * Expects a Bearer JWT (Supabase access_token) in the Authorization header,
 * plus { businessName, plan } in the body.
 *
 * 1. Validates the JWT → gets the authenticated user's id + email.
 * 2. Finds or creates a businesses row for that user.
 * 3. Creates a Stripe checkout session directly (no external backend).
 * 4. Returns { url } to redirect the client.
 */
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, getSupabaseUrl, getSupabaseAnonKey, requireEnv } from "@/lib/billing/config";

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const stripe = getStripeClient();

// Map plan keys to Stripe price IDs (env-only; no hard-coded fallbacks)
const PRICE_IDS: Record<string, string | undefined> = {
  solo: process.env.STRIPE_PRICE_SOLO,
  growing: process.env.STRIPE_PRICE_GROWING,
  scale: process.env.STRIPE_PRICE_SCALE,
};

export async function POST(req: NextRequest) {
  try {
    // ── 0. Parse body ────────────────────────────────────────────────
    const { businessName, plan } = await req.json();

    if (!plan) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[subscribe] SUPABASE_SERVICE_ROLE_KEY is not set");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    // ── 1. Verify the caller's JWT ───────────────────────────────────
    const authHeader = req.headers.get("authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required. Please verify your email first." },
        { status: 401 }
      );
    }

    // Build a user-scoped client to validate the token
    const anonKey = getSupabaseAnonKey();
    const supabaseUser = createClient(SUPABASE_URL, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      console.error("[subscribe] JWT validation failed:", userError?.message);
      return NextResponse.json(
        { error: "Invalid or expired session. Please verify your email again." },
        { status: 401 }
      );
    }

    const ownerId = user.id;
    const ownerEmail = user.email!;
    console.log(`[subscribe] authenticated user ${ownerId} (${ownerEmail})`);

    // ── 2. Admin client for DB operations (bypasses RLS) ─────────────
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ── 3. Find or create business ───────────────────────────────────
    // Always match by owner_id first (exact). Only fall back to email if the
    // user somehow has no row yet — the old .or() query was creating duplicate
    // rows when the same user signed up twice with different business names.
    let { data: existingBusiness } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false }) // prefer most recent if somehow duped
      .limit(1)
      .maybeSingle();

    // Only fall back to email if truly no row exists for this owner_id
    if (!existingBusiness) {
      const { data: byEmail } = await supabase
        .from("businesses")
        .select("id")
        .ilike("business_email", ownerEmail)
        .limit(1)
        .maybeSingle();
      existingBusiness = byEmail ?? null;
    }

    let businessId: string;

    if (existingBusiness) {
      businessId = existingBusiness.id;
      console.log(`[subscribe] reusing existing business ${businessId}`);
    } else {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 30);

      // NOTE: the `businesses` table has some NOT NULL columns (e.g. `address`).
      // Provide safe defaults so trial signup never 500s.
      const { data: business, error: dbError } = await supabase
        .from("businesses")
        .insert({
          owner_id: ownerId,
          name: businessName,
          business_email: ownerEmail,
          subscription_status: "trial",
          trial_ends_at: trialEndsAt.toISOString(),
          is_public: false,
          verification_status: "pending",
          address: "", // required by DB constraint
        })
        .select("id")
        .single();

      if (dbError || !business) {
        console.error("[subscribe] Supabase insert error:", dbError);
        return NextResponse.json({ error: "Failed to create business record." }, { status: 500 });
      }

      businessId = business.id;
      console.log(`[subscribe] created business ${businessId}`);
    }

    // ── 4. Create Stripe checkout session directly ───────────────────
    const priceId = PRICE_IDS[plan.toLowerCase()];
    if (!priceId) {
      console.error(`[subscribe] No Stripe price ID configured for plan: ${plan}`);
      return NextResponse.json(
        { error: "Invalid plan selected." },
        { status: 400 }
      );
    }

    // Look up the existing business to check how many trial days remain
    // AND whether they already have a Stripe customer ID (reuse it to avoid duplicate customers)
    const { COL_CUSTOMER } = (await import("@/lib/billing/config")).getStripeColumns();
    const { data: bizDataRaw } = await supabase
      .from("businesses")
      .select("trial_ends_at, stripe_customer_id, stripe_customer_id_test")
      .eq("id", businessId)
      .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bizData = bizDataRaw as Record<string, unknown> | null;

    // Reuse existing Stripe customer if one exists — avoids creating duplicate customers.
    const existingCustomerId: string | null =
      (typeof bizData?.[COL_CUSTOMER] === "string" ? bizData[COL_CUSTOMER] as string : null) ??
      (typeof bizData?.stripe_customer_id === "string" ? bizData.stripe_customer_id as string : null) ??
      null;

    // Calculate remaining trial days (already tracked in the app, don't double-count)
    let trialDaysRemaining = 0;
    const trialEndsAtRaw = bizData?.trial_ends_at;
    if (typeof trialEndsAtRaw === "string") {
      const msLeft = new Date(trialEndsAtRaw).getTime() - Date.now();
      trialDaysRemaining = Math.max(0, Math.ceil(msLeft / 86400000));
    }

    // Build base URL dynamically: prefer NEXT_PUBLIC_SITE_URL env var, then
    // the request's own origin, then fall back to production.
    const rawOrigin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      req.headers.get("origin") ||
      req.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "https://clientin.co";
    const baseUrl = new URL(rawOrigin).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      // Reuse the existing Stripe customer if available — prevents duplicate customers.
      // Fall back to customer_email so Stripe creates one automatically.
      ...(existingCustomerId ? { customer: existingCustomerId } : { customer_email: ownerEmail }),
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        // Only pass a trial if there are days genuinely left in the app trial,
        // so Stripe lines up with what the customer already has.
        // If trial already ended (or they're paying fresh), charge immediately.
        ...(trialDaysRemaining > 0
          ? { trial_period_days: trialDaysRemaining }
          : {}),
        metadata: { businessId, plan: plan.toLowerCase() },
      },
      metadata: { businessId, ownerEmail, plan: plan.toLowerCase() },
      success_url: `${baseUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe`,
    });

    if (!session.url) {
      console.error("[subscribe] Stripe session created but no URL returned");
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[subscribe] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

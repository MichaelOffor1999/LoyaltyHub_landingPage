/**
 * POST /api/join-membership
 *
 * Called from the /join-membership page once the customer's Supabase session
 * is confirmed (token arrives via the mobile app's URL-fragment handoff).
 * Creates a Stripe Checkout session for a membership plan, routed to the
 * business's Connect account via destination charges.
 *
 * Auth: Bearer <supabase_access_token>
 * Body: { businessId: string, planId: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripeClient, getSupabaseUrl, getSupabaseAnonKey, requireEnv } from "@/lib/billing/config";
import { ensureStripeCustomerForProfile, getMembershipPlatformFeePercent, getMembershipsSupabase } from "@/lib/billing/memberships";

const SUPABASE_URL = getSupabaseUrl();
const stripe = getStripeClient();

export async function POST(req: NextRequest) {
  try {
    const { businessId, planId } = await req.json();
    if (!businessId || !planId) {
      return NextResponse.json({ error: "businessId and planId are required." }, { status: 400 });
    }

    // ── 1. Verify the caller's JWT ───────────────────────────────────
    const authHeader = req.headers.get("authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const anonKey = getSupabaseAnonKey();
    const supabaseUser = createClient(SUPABASE_URL, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
    }

    const supabase = getMembershipsSupabase();

    // ── 2. Look up the plan ──────────────────────────────────────────
    const { data: plan } = await supabase
      .from("membership_plans")
      .select("id, business_id, stripe_price_id, active")
      .eq("id", planId)
      .single();
    if (!plan || !plan.active || plan.business_id !== businessId) {
      return NextResponse.json({ error: "Plan not found or inactive." }, { status: 404 });
    }
    if (!plan.stripe_price_id) {
      return NextResponse.json({ error: "Plan is not configured for billing." }, { status: 500 });
    }

    // ── 3. Look up the business's Connect account ────────────────────
    const { data: biz } = await supabase
      .from("businesses")
      .select("stripe_connect_account_id, stripe_connect_charges_enabled")
      .eq("id", businessId)
      .single();
    if (!biz?.stripe_connect_account_id || !biz.stripe_connect_charges_enabled) {
      return NextResponse.json({ error: "This business hasn't finished payment setup yet." }, { status: 400 });
    }

    // ── 4. Block joining twice ────────────────────────────────────────
    const { data: existing } = await supabase
      .from("memberships")
      .select("id, status")
      .eq("customer_id", user.id)
      .eq("business_id", businessId)
      .in("status", ["incomplete", "active", "past_due"])
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "You already have a membership at this business.", status: existing.status },
        { status: 409 }
      );
    }

    // ── 5. Create the Checkout session (destination charge) ──────────
    const customerId = await ensureStripeCustomerForProfile(supabase, stripe, user.id);
    const platformFeePercent = getMembershipPlatformFeePercent();

    const rawOrigin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      req.headers.get("origin") ||
      req.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "https://clientin.co";
    const baseUrl = new URL(rawOrigin).origin;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      subscription_data: {
        transfer_data: { destination: biz.stripe_connect_account_id },
        application_fee_percent: platformFeePercent > 0 ? platformFeePercent : undefined,
        on_behalf_of: biz.stripe_connect_account_id,
        metadata: { kind: "membership", business_id: businessId, plan_id: plan.id, customer_id: user.id },
      },
      metadata: { kind: "membership", business_id: businessId, plan_id: plan.id, customer_id: user.id },
      success_url: `${baseUrl}/join-membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/join-membership?businessId=${businessId}&planId=${planId}`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[join-membership] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

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
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://elyonkqglhsrzafbanph.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// Map plan keys to Stripe price IDs
const PRICE_IDS: Record<string, string> = {
  solo:    process.env.STRIPE_PRICE_SOLO    || "price_1TClSz1hvxerH6vDEW3YbQuO",
  growing: process.env.STRIPE_PRICE_GROWING || "price_1TClT01hvxerH6vDPQQMbI0Q",
  scale:   process.env.STRIPE_PRICE_SCALE   || "price_1TClSz1hvxerH6vDjUPs0fHK",
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
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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
    const { data: existingBusiness } = await supabase
      .from("businesses")
      .select("id")
      .or(`owner_id.eq.${ownerId},business_email.ilike.${ownerEmail}`)
      .maybeSingle();

    let businessId: string;

    if (existingBusiness) {
      businessId = existingBusiness.id;
      console.log(`[subscribe] reusing existing business ${businessId}`);
    } else {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 30);

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
        })
        .select("id")
        .single();

      if (dbError || !business) {
        console.error("[subscribe] Supabase insert error:", dbError);
        return NextResponse.json(
          { error: "Failed to create business record." },
          { status: 500 }
        );
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
    const { data: bizData } = await supabase
      .from("businesses")
      .select("trial_ends_at")
      .eq("id", businessId)
      .maybeSingle();

    // Calculate remaining trial days (already tracked in the app, don't double-count)
    let trialDaysRemaining = 0;
    if (bizData?.trial_ends_at) {
      const msLeft = new Date(bizData.trial_ends_at).getTime() - Date.now();
      trialDaysRemaining = Math.max(0, Math.ceil(msLeft / 86400000));
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: ownerEmail,
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
      success_url: "https://clientin.co/subscribe/success",
      cancel_url: "https://clientin.co/subscribe",
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

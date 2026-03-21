/**
 * GET /api/subscription
 * Returns the authenticated user's current plan, subscription status,
 * trial info, and last 10 Stripe invoices.
 * Requires a valid Supabase JWT in the Authorization header.
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

const PLAN_PRICE_MAP: Record<string, string> = {
  price_1TClSz1hvxerH6vDEW3YbQuO: "solo",
  price_1TClT01hvxerH6vDPQQMbI0Q: "growing",
  price_1TClSz1hvxerH6vDjUPs0fHK: "scale",
};

function priceIdToPlan(priceId: string): string {
  // check env vars first
  if (process.env.STRIPE_PRICE_SOLO && priceId === process.env.STRIPE_PRICE_SOLO) return "solo";
  if (process.env.STRIPE_PRICE_GROWING && priceId === process.env.STRIPE_PRICE_GROWING) return "growing";
  if (process.env.STRIPE_PRICE_SCALE && priceId === process.env.STRIPE_PRICE_SCALE) return "scale";
  return PLAN_PRICE_MAP[priceId] ?? "unknown";
}

export async function GET(req: NextRequest) {
  try {
    // 1. Verify JWT
    const authHeader = req.headers.get("authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseUser = createClient(SUPABASE_URL, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const ownerEmail = user.email!;

    // 2. Fetch business row from DB
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: business } = await supabase
      .from("businesses")
      .select("id, name, subscription_status, subscription_plan, trial_ends_at, stripe_customer_id")
      .eq("owner_id", user.id)
      .maybeSingle();

    // 3. Fetch Stripe data
    let activePlan: string | null = null;
    let subscriptionStatus: string | null = null;
    let currentPeriodEnd: number | null = null;
    let invoices: object[] = [];
    let stripeCustomerId: string | null = business?.stripe_customer_id ?? null;

    // Find stripe customer by email if not cached in DB — then save it back
    if (!stripeCustomerId) {
      const customers = await stripe.customers.list({ email: ownerEmail, limit: 1 });
      if (customers.data.length) {
        stripeCustomerId = customers.data[0].id;
        // Cache it so future requests don't need to hit Stripe's customer list API
        if (business?.id) {
          await supabase
            .from("businesses")
            .update({ stripe_customer_id: stripeCustomerId })
            .eq("id", business.id);
        }
      }
    }

    if (stripeCustomerId) {
      // Validate the customer ID belongs to the current Stripe mode (live vs test).
      // If not, clear it so the page loads cleanly instead of crashing.
      try {
        await stripe.customers.retrieve(stripeCustomerId);
      } catch (customerErr: unknown) {
        const stripeErr = customerErr as { code?: string };
        if (stripeErr?.code === "resource_missing") {
          console.warn(`[subscription] customer ${stripeCustomerId} not found in this Stripe mode — clearing it`);
          stripeCustomerId = null;
          // Clear the stale customer ID from DB so it doesn't keep crashing
          if (business?.id) {
            await supabase.from("businesses").update({ stripe_customer_id: null }).eq("id", business.id);
          }
        }
      }
    }

    if (stripeCustomerId) {
      // Get active subscriptions
      const subs = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "all",
        limit: 1,
        expand: ["data.default_payment_method"],
      });

      if (subs.data.length) {
        const sub = subs.data[0];
        subscriptionStatus = sub.status;

        // In Stripe API 2026+, current_period_end lives on items.data[0], not the subscription root
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = (sub.items?.data?.[0] as any);
        currentPeriodEnd = item?.current_period_end ?? null;

        const priceId = item?.price?.id;
        if (priceId) activePlan = priceIdToPlan(priceId);

        // ── Self-heal: if Stripe says active but DB still says trial, fix it ──
        if (sub.status === "active" && business?.id &&
          (business.subscription_status === "trial" || business.subscription_status === "past_due")) {
          await supabase
            .from("businesses")
            .update({
              subscription_status: "active",
              stripe_subscription_id: sub.id,
              stripe_customer_id: stripeCustomerId,
              trial_ends_at: new Date().toISOString(),
              ...(activePlan ? { subscription_plan: activePlan } : {}),
            })
            .eq("id", business.id);
        }
      }

      // Get last 10 invoices
      const inv = await stripe.invoices.list({
        customer: stripeCustomerId,
        limit: 10,
      });

      invoices = inv.data.map((i) => ({
        id: i.id,
        number: i.number,
        amount: i.amount_paid,
        currency: i.currency,
        status: i.status,
        date: i.created,
        pdf: i.invoice_pdf,
        hostedUrl: i.hosted_invoice_url,
      }));
    } // end stripeCustomerId block

    return NextResponse.json({
      business: business
        ? {
            id: business.id,
            name: business.name,
            subscriptionStatus: business.subscription_status,
            subscriptionPlan: business.subscription_plan ?? null,
            trialEndsAt: business.trial_ends_at,
          }
        : null,
      stripe: {
        customerId: stripeCustomerId,
        activePlan,
        subscriptionStatus,
        currentPeriodEnd,
      },
      invoices,
    });
  } catch (err) {
    console.error("[subscription] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

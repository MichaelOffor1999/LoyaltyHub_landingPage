/**
 * GET /api/subscription
 * Stripe-first subscription state: Stripe is the source of truth.
 *
 * We only use Supabase to authenticate the user and to look up the Stripe
 * customer/subscription IDs stored for that user.
 */
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  getStripeClient,
  getStripeColumns,
  getSupabaseUrl,
  priceIdToPlan,
  requireEnv,
} from "@/lib/billing/config";

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const stripe = getStripeClient();

const { COL_CUSTOMER, COL_SUB } = getStripeColumns();

type BusinessRow = {
  id: string;
  name: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
  subscription_plan?: string | null;
  trial_ends_at?: string | null;
  [key: string]: unknown;
};

function hasStripeId(row: BusinessRow, key: string): boolean {
  const modeAware = row[key];
  if (typeof modeAware === "string" && modeAware.length > 0) return true;
  const legacy = row[key === COL_CUSTOMER ? "stripe_customer_id" : "stripe_subscription_id"];
  return typeof legacy === "string" && legacy.length > 0;
}

type InvoiceSummary = {
  id: string;
  number: string | null;
  amount: number;
  currency: string;
  status: Stripe.Invoice.Status | null;
  date: number;
  pdf: string | null;
  hostedUrl: string | null;
};

export async function GET(req: NextRequest) {
  try {
    // 1. Verify JWT
    const authHeader = req.headers.get("authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
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

    // 2. Fetch business row from DB (only to get Stripe IDs + basic profile)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: businesses } = await supabase
      .from("businesses")
      .select(
        `id, name, ${COL_CUSTOMER}, ${COL_SUB}, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_plan, trial_ends_at`
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!businesses || businesses.length === 0) {
      return NextResponse.json(
        {
          error:
            "No business account found for this email. If you deleted your account, please sign up again in the app.",
          code: "BUSINESS_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const candidates = businesses as unknown as BusinessRow[];

    // Prefer the row that actually has stripe ids (mode-aware first, then legacy)
    const business = [...candidates].sort((a, b) => {
      const aHas = hasStripeId(a, COL_CUSTOMER);
      const bHas = hasStripeId(b, COL_CUSTOMER);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    })[0] as BusinessRow;

    // Stripe IDs (mode-aware first, then legacy columns)
    const stripeCustomerId: string | null =
      (typeof business[COL_CUSTOMER] === "string" ? (business[COL_CUSTOMER] as string) : null) ??
      (typeof business.stripe_customer_id === "string" ? business.stripe_customer_id : null) ??
      null;

    const stripeSubId: string | null =
      (typeof business[COL_SUB] === "string" ? (business[COL_SUB] as string) : null) ??
      (typeof business.stripe_subscription_id === "string" ? business.stripe_subscription_id : null) ??
      null;

    // 3. Fetch Stripe data (source of truth)
    let activePlan: string | null = null;
    let subscriptionStatus: string | null = null;
    let currentPeriodEnd: number | null = null;
    let invoices: InvoiceSummary[] = [];
    let pendingPlan: string | null = null;
    let pendingPlanDate: string | null = null;

    if (stripeCustomerId) {
      // Validate customer exists in current mode; if not, treat as no subscription
      try {
        await stripe.customers.retrieve(stripeCustomerId);

        // Prefer retrieving the known subscription id if we have it.
        let sub: Stripe.Subscription | null = null;
        if (stripeSubId) {
          try {
            sub = await stripe.subscriptions.retrieve(stripeSubId, { expand: ["schedule"] });
          } catch {
            sub = null;
          }
        }

        // Fall back to listing subscriptions if needed
        if (!sub) {
          const subs = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: "all",
            limit: 1,
            expand: ["data.schedule"],
          });
          sub = subs.data[0] ?? null;
        }

        if (sub) {
          subscriptionStatus = sub.status;
          const item0 = sub.items?.data?.[0];
          const priceId = item0?.price?.id;
          currentPeriodEnd = item0?.current_period_end ?? null;
          if (priceId) activePlan = priceIdToPlan(priceId);

          // Detect pending plan from subscription schedule, if present
          const schedule = sub.schedule && typeof sub.schedule === "object" ? sub.schedule : null;
          if (schedule && "phases" in schedule) {
            const phases = (schedule.phases ?? []) as Stripe.SubscriptionSchedule.Phase[];
            const nextPhase = phases.length >= 2 ? phases[phases.length - 1] : null;
            const nextItem = nextPhase?.items?.[0];
            const nextPriceId = nextItem?.price as unknown as string | Stripe.Price | undefined;
            const resolvedNextPriceId =
              typeof nextPriceId === "string" ? nextPriceId : (nextPriceId as Stripe.Price | undefined)?.id;

            const nextPlan = resolvedNextPriceId ? priceIdToPlan(resolvedNextPriceId) : null;
            if (nextPlan && nextPlan !== activePlan && nextPlan !== "unknown") {
              pendingPlan = nextPlan;
              pendingPlanDate = nextPhase?.start_date
                ? new Date(nextPhase.start_date * 1000).toISOString()
                : null;
            }
          }
        }

        const inv = await stripe.invoices.list({ customer: stripeCustomerId, limit: 10 });
        invoices = inv.data.map((i) => ({
          id: i.id,
          number: i.number,
          amount: i.amount_paid,
          currency: i.currency,
          status: i.status,
          date: i.created,
          pdf: i.invoice_pdf ?? null,
          hostedUrl: i.hosted_invoice_url ?? null,
        }));
      } catch {
        // invalid customer in this mode => treat as no Stripe data
      }
    }

    // Business object now just supports UI (name, trialEndsAt if you still show it)
    // Stripe dictates plan/status going forward.
    return NextResponse.json({
      business: business
        ? {
            id: business.id,
            name: business.name,
            // kept for backward compatibility in UI; Stripe is the truth
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
        pendingPlan,
        pendingPlanDate,
      },
      invoices,
    });
  } catch (err) {
    console.error("[subscription] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

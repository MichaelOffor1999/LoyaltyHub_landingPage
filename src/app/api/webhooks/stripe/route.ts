import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  getStripeClient,
  getStripeColumns,
  isStripeTestMode,
  getSupabaseUrl,
  priceIdToPlan,
  requireEnv,
} from "@/lib/billing/config";

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const STRIPE_WEBHOOK_SECRET = requireEnv("STRIPE_WEBHOOK_SECRET");

const { COL_CUSTOMER, COL_SUB } = getStripeColumns();

// Use separate DB columns for test vs live so they never overwrite each other
const IS_TEST_MODE = isStripeTestMode();

// App Router uses the native Web Streams API — no bodyParser config needed.
async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  // Create a single Stripe client for the entire request lifetime.
  const stripe = getStripeClient();

  let event: Record<string, unknown>;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET) as unknown as Record<string, unknown>;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const eventType = event.type as string;
  const dataObject = (event.data as Record<string, unknown>)?.object as Record<string, unknown>;

  try {
    switch (eventType) {
      // ── Checkout completed → activate paid plan (or start Stripe trial) ──
      case "checkout.session.completed": {
        const meta = (dataObject.metadata as Record<string, string>) ?? {};
        const businessId = meta.businessId;
        const plan = meta.plan ?? null;
        const subscriptionId = dataObject.subscription as string;
        const customerId = dataObject.customer as string;

        // Determine if this is a trial start or an immediate payment.
        // "paid"                → customer was charged immediately → mark active, stamp trial_ends_at as past.
        // "no_payment_required" → Stripe trial started → keep trialing status, sync real trial_end from Stripe.
        const paymentStatus = dataObject.payment_status as string | null;
        let resolvedStatus = "active";
        let trialEndsAtValue: string = new Date().toISOString();

        if (paymentStatus === "no_payment_required" && subscriptionId) {
          resolvedStatus = "trialing";
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const trialEnd = sub.trial_end;
            if (trialEnd) trialEndsAtValue = new Date(trialEnd * 1000).toISOString();
          } catch (e) {
            console.error("[webhook] checkout.session.completed: failed to fetch trial_end:", e);
          }
        }

        const updatePayload = {
          subscription_status: resolvedStatus,
          [COL_SUB]: subscriptionId,
          [COL_CUSTOMER]: customerId,
          trial_ends_at: trialEndsAtValue,
          ...(plan ? { subscription_plan: plan } : {}),
        };

        if (businessId) {
          // Primary: update by businessId from metadata
          const { error } = await supabase
            .from("businesses")
            .update(updatePayload)
            .eq("id", businessId);
          if (error) console.error("Supabase update error (checkout.session.completed) by id:", error);
          else console.log(`[webhook] business ${businessId} activated on plan: ${plan ?? "unknown"} (${IS_TEST_MODE ? "test" : "live"} mode)`);
        } else if (customerId) {
          // Fallback: update by the mode-aware customer column if businessId missing from metadata
          const { error } = await supabase
            .from("businesses")
            .update(updatePayload)
            .eq(COL_CUSTOMER, customerId);
          if (error) console.error("Supabase update error (checkout.session.completed) by customer:", error);
          else console.log(`[webhook] business for customer ${customerId} activated on plan: ${plan ?? "unknown"}`);
        }
        break;
      }

      // ── Subscription renewed ────────────────────────────────────────
      case "invoice.paid": {
        const subscriptionId = dataObject.subscription as string;
        if (subscriptionId) {
          // Fetch the live subscription so we can also sync the plan in case
          // customer.subscription.updated fires out-of-order or is missed.
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = sub.items?.data?.[0]?.price?.id ?? null;
            const plan = priceId ? priceIdToPlan(priceId) : null;

            const { error } = await supabase
              .from("businesses")
              .update({
                subscription_status: "active",
                ...(plan && plan !== "unknown" ? { subscription_plan: plan } : {}),
              })
              .eq(COL_SUB, subscriptionId);

            if (error) console.error("Supabase update error (invoice.paid):", error);
            else console.log(`[webhook] invoice.paid → sub ${subscriptionId} renewed, plan: ${plan}`);
          } catch (fetchErr) {
            // Stripe fetch failed — still try to mark as active
            console.error("[webhook] invoice.paid: failed to fetch subscription from Stripe:", fetchErr);
            const { error } = await supabase
              .from("businesses")
              .update({ subscription_status: "active" })
              .eq(COL_SUB, subscriptionId);
            if (error) console.error("Supabase update error (invoice.paid fallback):", error);
          }
        }
        break;
      }

      // ── Payment failed ──────────────────────────────────────────────
      case "invoice.payment_failed": {
        const subscriptionId = dataObject.subscription as string;
        if (subscriptionId) {
          const { error } = await supabase
            .from("businesses")
            .update({ subscription_status: "past_due" })
            .eq(COL_SUB, subscriptionId);

          if (error) console.error("Supabase update error (invoice.payment_failed):", error);
        }
        break;
      }

      // ── Subscription cancelled / expired ───────────────────────────
      case "customer.subscription.deleted": {
        const subscriptionId = dataObject.id as string;
        if (subscriptionId) {
          const { error } = await supabase
            .from("businesses")
            .update({
              subscription_status: "cancelled",
              subscription_plan: null,   // clear stale plan so UI shows "No active plan"
              [COL_SUB]: null,           // clear stale sub ID so it won't be re-fetched
              pending_plan: null,        // clear any pending downgrade
              pending_plan_date: null,
            })
            .eq(COL_SUB, subscriptionId);

          if (error) console.error("Supabase update error (customer.subscription.deleted):", error);
        }
        break;
      }

      // ── Subscription updated (plan change, trial end, etc.) ─────────
      case "customer.subscription.updated": {
        const subscriptionId = dataObject.id as string;
        const status = dataObject.status as string;
        const customerId = dataObject.customer as string;
        const items = (dataObject as Record<string, unknown>).items as { data: { price: { id: string } }[] } | undefined;
        const priceId = items?.data?.[0]?.price?.id ?? null;
        const plan = priceId ? priceIdToPlan(priceId) : "unknown";

        if (subscriptionId && status) {
          const statusMap: Record<string, string> = {
            active: "active",
            trialing: "trialing",
            past_due: "past_due",
            canceled: "cancelled",
            unpaid: "past_due",
            paused: "paused",
          };

          // Sync trial_end from Stripe when trialing, stamp past when active/paid.
          const trialEnd = (dataObject as Record<string, unknown>).trial_end as number | null | undefined;
          const trialEndsAtUpdate: { trial_ends_at?: string } =
            status === "active"
              ? { trial_ends_at: new Date().toISOString() }
              : status === "trialing" && trialEnd
              ? { trial_ends_at: new Date(trialEnd * 1000).toISOString() }
              : {};

          const updatePayload = {
            subscription_status: statusMap[status] ?? status,
            [COL_SUB]: subscriptionId,
            [COL_CUSTOMER]: customerId,
            ...(plan !== "unknown" ? { subscription_plan: plan } : {}),
            ...trialEndsAtUpdate,
          };

          // Try matching by subscription ID first (normal path)
          const { data: matched, error } = await supabase
            .from("businesses")
            .update(updatePayload)
            .eq(COL_SUB, subscriptionId)
            .select("id");

          if (error) {
            console.error("Supabase update error (customer.subscription.updated):", error);
          } else if (!matched || matched.length === 0) {
            // Subscription ID not in DB yet (e.g. webhook arrived before checkout.session.completed)
            // Fall back to matching by customer ID
            if (customerId) {
              const { error: err2 } = await supabase
                .from("businesses")
                .update(updatePayload)
                .eq(COL_CUSTOMER, customerId);
              if (err2) console.error("Supabase fallback update error (customer.subscription.updated):", err2);
              else console.log(`[webhook] subscription.updated fallback match by customer ${customerId} → status: ${status}, plan: ${plan}`);
            }
          } else {
            console.log(`[webhook] subscription ${subscriptionId} → status: ${status}, plan: ${plan} (${IS_TEST_MODE ? "test" : "live"} mode)`);
          }
        }
        break;
      }

      default:
        // Unhandled event — log and return 200 so Stripe doesn't retry
        console.log(`Unhandled Stripe webhook event: ${eventType}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

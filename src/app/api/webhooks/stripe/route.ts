import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://elyonkqglhsrzafbanph.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Raw body is required for Stripe signature verification
export const config = { api: { bodyParser: false } };

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

  let event: Record<string, unknown>;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      // ── Checkout completed → cancel trial, activate paid plan ────────
      case "checkout.session.completed": {
        const meta = (dataObject.metadata as Record<string, string>) ?? {};
        const businessId = meta.businessId;
        const plan = meta.plan ?? null;
        const subscriptionId = dataObject.subscription as string;
        const customerId = dataObject.customer as string;

        if (businessId) {
          const { error } = await supabase
            .from("businesses")
            .update({
              subscription_status: "active",
              stripe_subscription_id: subscriptionId,
              stripe_customer_id: customerId,
              // Clear the trial — they've now paid
              trial_ends_at: null,
              // Store the plan name if we have it
              ...(plan ? { plan } : {}),
            })
            .eq("id", businessId);

          if (error) console.error("Supabase update error (checkout.session.completed):", error);
          else console.log(`[webhook] business ${businessId} activated on plan: ${plan ?? "unknown"}`);
        }
        break;
      }

      // ── Subscription renewed ────────────────────────────────────────
      case "invoice.paid": {
        const subscriptionId = dataObject.subscription as string;
        if (subscriptionId) {
          const { error } = await supabase
            .from("businesses")
            .update({ subscription_status: "active" })
            .eq("stripe_subscription_id", subscriptionId);

          if (error) console.error("Supabase update error (invoice.paid):", error);
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
            .eq("stripe_subscription_id", subscriptionId);

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
            .update({ subscription_status: "cancelled" })
            .eq("stripe_subscription_id", subscriptionId);

          if (error) console.error("Supabase update error (customer.subscription.deleted):", error);
        }
        break;
      }

      // ── Subscription updated (plan change, trial end, etc.) ─────────
      case "customer.subscription.updated": {
        const subscriptionId = dataObject.id as string;
        const status = dataObject.status as string;
        const items = (dataObject as Record<string, unknown>).items as { data: { price: { id: string } }[] } | undefined;
        const priceId = items?.data?.[0]?.price?.id ?? null;

        const PRICE_PLAN_MAP: Record<string, string> = {
          [process.env.STRIPE_PRICE_SOLO    ?? "price_1TClSz1hvxerH6vDEW3YbQuO"]: "solo",
          [process.env.STRIPE_PRICE_GROWING ?? "price_1TClT01hvxerH6vDPQQMbI0Q"]: "growing",
          [process.env.STRIPE_PRICE_SCALE   ?? "price_1TClSz1hvxerH6vDjUPs0fHK"]: "scale",
        };
        const plan = priceId ? (PRICE_PLAN_MAP[priceId] ?? null) : null;

        if (subscriptionId && status) {
          const statusMap: Record<string, string> = {
            active: "active",
            trialing: "trial",
            past_due: "past_due",
            canceled: "cancelled",
            unpaid: "past_due",
            paused: "paused",
          };
          const { error } = await supabase
            .from("businesses")
            .update({
              subscription_status: statusMap[status] ?? status,
              ...(plan ? { plan } : {}),
              // If now active (trial ended or plan changed), clear trial date
              ...(status === "active" ? { trial_ends_at: null } : {}),
            })
            .eq("stripe_subscription_id", subscriptionId);

          if (error) console.error("Supabase update error (customer.subscription.updated):", error);
          else console.log(`[webhook] subscription ${subscriptionId} → status: ${status}, plan: ${plan}`);
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

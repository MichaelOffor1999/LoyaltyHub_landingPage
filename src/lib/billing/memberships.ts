/**
 * Membership billing — Stripe Connect (destination charges).
 *
 * Customers subscribe to a business's membership plan; the Checkout Session
 * and Subscription live on ClientIn's own Stripe account (this platform),
 * with `transfer_data`/`on_behalf_of` routing each business's share to their
 * Connect Express account automatically. This is a separate concern from the
 * business SaaS billing elsewhere in this file's sibling `config.ts` — that's
 * businesses paying ClientIn; this is customers paying businesses.
 *
 * Moved here (rather than the Hono backend) so the mobile app can hand off
 * to the external browser for the actual purchase, matching how business
 * SaaS billing already works, and so Checkout creation and webhook
 * processing live in the same place as the endpoint Stripe is actually
 * configured to call (`clientin-website`).
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { getSupabaseUrl, requireEnv } from "./config";

export function getMembershipsSupabase(): SupabaseClient {
  return createClient(getSupabaseUrl(), requireEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

export function getMembershipPlatformFeePercent(): number {
  const raw = process.env.MEMBERSHIP_PLATFORM_FEE_PERCENT ?? "5";
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Look up or create the customer's platform-level Stripe customer (reused across every business). */
export async function ensureStripeCustomerForProfile(
  supabase: SupabaseClient,
  stripe: Stripe,
  userId: string
): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email, name")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) {
    try {
      await stripe.customers.retrieve(profile.stripe_customer_id);
      return profile.stripe_customer_id;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code !== "resource_missing") throw err;
    }
  }

  const customer = await stripe.customers.create({
    email: profile?.email,
    name: profile?.name ?? undefined,
    metadata: { profile_id: userId },
  });
  await supabase.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", userId);
  return customer.id;
}

function mapMembershipStatus(s: Stripe.Subscription.Status): "incomplete" | "active" | "past_due" | "cancelled" {
  if (s === "active" || s === "trialing") return "active";
  if (s === "past_due" || s === "unpaid") return "past_due";
  if (s === "canceled" || s === "incomplete_expired") return "cancelled";
  return "incomplete";
}

// As of Stripe's 2025-03-31 API version, current_period_start/end moved off
// the top-level Subscription object onto each SubscriptionItem — reading
// them off `sub` directly (the pre-2025-03-31 shape) silently returns
// undefined forever. A membership subscription always has exactly one price
// (one included plan), so the first item's period is the subscription's.
function periodBounds(sub: Stripe.Subscription): { start: string | null; end: string | null } {
  const item = sub.items.data[0] as unknown as { current_period_start?: number; current_period_end?: number } | undefined;
  return {
    start: item?.current_period_start ? new Date(item.current_period_start * 1000).toISOString() : null,
    end: item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null,
  };
}

/** Upsert a `memberships` row from a Stripe subscription tagged metadata.kind === "membership" */
export async function syncMembershipFromStripe(
  supabase: SupabaseClient,
  sub: Stripe.Subscription,
  overrideStatus?: "incomplete" | "active" | "past_due" | "cancelled"
): Promise<void> {
  const meta = sub.metadata ?? {};
  const businessId = meta.business_id;
  const planId = meta.plan_id;
  const customerId = meta.customer_id;
  if (!businessId || !planId || !customerId) {
    console.warn(`[memberships] subscription ${sub.id} missing membership metadata — skipping`);
    return;
  }

  const { start, end } = periodBounds(sub);
  const status = overrideStatus ?? mapMembershipStatus(sub.status);

  const { data: existing } = await supabase
    .from("memberships")
    .select("id")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("memberships")
      .update({
        status,
        current_period_start: start,
        current_period_end: end,
        cancel_at_period_end: sub.cancel_at_period_end ?? false,
      })
      .eq("id", existing.id);
    return;
  }

  await supabase.from("memberships").insert({
    business_id: businessId,
    customer_id: customerId,
    membership_plan_id: planId,
    status,
    stripe_subscription_id: sub.id,
    current_period_start: start,
    current_period_end: end,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
  });
}

/** Reverse the transfer to a connected account when a charge is disputed, so the cost lands on the business, not ClientIn. */
export async function reverseTransferForDispute(stripe: Stripe, dispute: Stripe.Dispute): Promise<boolean> {
  const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id;
  try {
    const charge = await stripe.charges.retrieve(chargeId, { expand: ["transfer"] });
    const transfer = charge.transfer;
    if (!transfer) {
      console.warn(`[memberships] dispute ${dispute.id}: charge ${chargeId} has no associated transfer — nothing to reverse`);
      return false;
    }
    const transferId = typeof transfer === "string" ? transfer : transfer.id;
    await stripe.transfers.createReversal(transferId, { amount: dispute.amount });
    console.log(`[memberships] dispute ${dispute.id}: reversed ${dispute.amount} from transfer ${transferId}`);
    return true;
  } catch (err) {
    // If the connected account's balance can't cover it, Stripe errors and the
    // loss falls to the platform (the negative-balance-liability scenario).
    // Retrying won't help — needs manual follow-up, not a webhook retry.
    console.error(`[memberships] dispute ${dispute.id}: failed to reverse transfer:`, err);
    return false;
  }
}

/**
 * Handles a Stripe webhook event if it belongs to the membership flow.
 * Returns true if handled (caller should skip the business-SaaS logic below
 * it in the switch), false if this event isn't membership-related.
 */
export async function handleMembershipWebhookEvent(
  eventType: string,
  dataObject: Record<string, unknown>,
  stripe: Stripe,
  supabase: SupabaseClient
): Promise<boolean> {
  switch (eventType) {
    case "account.updated": {
      const account = dataObject as unknown as Stripe.Account;
      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("stripe_connect_account_id", account.id)
        .maybeSingle();
      if (!biz) return false;
      await supabase
        .from("businesses")
        .update({
          stripe_connect_charges_enabled: !!account.charges_enabled,
          stripe_connect_details_submitted: !!account.details_submitted,
          stripe_connect_disabled_reason: account.requirements?.disabled_reason ?? null,
        })
        .eq("id", biz.id);
      return true;
    }

    case "checkout.session.completed": {
      const session = dataObject as unknown as Stripe.Checkout.Session;
      if (session.metadata?.kind !== "membership" || session.mode !== "subscription" || !session.subscription) {
        return false;
      }
      const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
      const sub = await stripe.subscriptions.retrieve(subId);
      await syncMembershipFromStripe(supabase, sub);
      return true;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = dataObject as unknown as Stripe.Subscription;
      if (sub.metadata?.kind !== "membership") return false;
      await syncMembershipFromStripe(supabase, sub);
      return true;
    }

    case "customer.subscription.deleted": {
      const sub = dataObject as unknown as Stripe.Subscription;
      if (sub.metadata?.kind !== "membership") return false;
      await syncMembershipFromStripe(supabase, sub, "cancelled");
      return true;
    }

    case "invoice.paid":
    case "invoice.payment_failed": {
      const invoice = dataObject as unknown as Stripe.Invoice;
      const subRef = invoice.parent?.subscription_details?.subscription ?? (invoice as unknown as { subscription?: string }).subscription;
      if (!subRef) return false;
      const subId = typeof subRef === "string" ? subRef : subRef.id;
      const sub = await stripe.subscriptions.retrieve(subId);
      if (sub.metadata?.kind !== "membership") return false;
      await syncMembershipFromStripe(supabase, sub, eventType === "invoice.payment_failed" ? "past_due" : undefined);
      return true;
    }

    case "charge.dispute.created": {
      const dispute = dataObject as unknown as Stripe.Dispute;
      const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id;
      const charge = await stripe.charges.retrieve(chargeId);
      // Only handle disputes for membership charges — business SaaS billing
      // never sets on_behalf_of, so its disputes fall through untouched.
      const connectAccountId =
        typeof charge.on_behalf_of === "string" ? charge.on_behalf_of : charge.on_behalf_of?.id;
      if (!connectAccountId) return false;

      const reversed = await reverseTransferForDispute(stripe, dispute);

      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("stripe_connect_account_id", connectAccountId)
        .maybeSingle();
      if (biz) {
        await supabase.from("membership_disputes").insert({
          business_id: biz.id,
          stripe_dispute_id: dispute.id,
          amount_cents: dispute.amount,
          reversed,
        });
      }
      return true;
    }

    default:
      return false;
  }
}

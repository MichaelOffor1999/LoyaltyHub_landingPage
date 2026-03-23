/**
 * sync-test-subs.mjs
 * Repairs the DB for all businesses that have a stripe_customer_id_test —
 * writes the correct stripe_subscription_id_test, subscription_plan, and
 * subscription_status based on what Stripe actually has.
 *
 * Run: node scripts/sync-test-subs.mjs
 */
import Stripe from "stripe";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://elyonkqglhsrzafbanph.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!STRIPE_KEY || !STRIPE_KEY.startsWith("sk_test_")) {
  console.error("ERROR: Set STRIPE_SECRET_KEY to a Stripe *test* secret key (sk_test_...).");
  process.exit(1);
}
if (!SERVICE_KEY) {
  console.error("ERROR: Missing SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const PRICE_PLAN = {
  "price_1TDVJV1hvxerH6vDFwUBNQIN": "solo",
  "price_1TDVKZ1hvxerH6vDFlKk0ARO": "growing",
  "price_1TDVLZ1hvxerH6vDgOP6j8Z1": "scale",
};

const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2026-02-25.clover" });

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

async function sb(path, method = "GET", body) {
  const res = await fetch(SUPABASE_URL + path, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

async function main() {
  // 1. Get all customers from Stripe test mode
  const customerList = await stripe.customers.list({ limit: 100 });
  console.log(`Found ${customerList.data.length} Stripe test customers\n`);

  for (const customer of customerList.data) {
    // Get their latest subscription
    const subList = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 1,
    });
    const sub = subList.data[0];
    if (!sub) {
      // No subscription — look up by customer ID and ensure DB is consistent
      const lookup = await sb(`/rest/v1/businesses?stripe_customer_id_test=eq.${customer.id}&select=id,subscription_status,subscription_plan`);
      if (Array.isArray(lookup.data) && lookup.data.length) {
        console.log(`⚠  ${customer.email} (${customer.id}) — customer in DB but no Stripe sub`);
      }
      continue;
    }

    const priceId = sub.items?.data?.[0]?.price?.id;
    const plan = PRICE_PLAN[priceId] ?? null;
    const stripeStatus = sub.status === "trialing" ? "trial" : sub.status === "active" ? "active" : sub.status;

    // 2. Find the matching business row
    const lookup = await sb(
      `/rest/v1/businesses?stripe_customer_id_test=eq.${customer.id}&select=id,subscription_plan,subscription_status,stripe_subscription_id_test`
    );

    if (!Array.isArray(lookup.data) || lookup.data.length === 0) {
      console.log(`⚠  ${customer.email} (${customer.id}) — no DB row with this test customer ID`);
      continue;
    }

    const biz = lookup.data[0];
    const needsSubFix   = biz.stripe_subscription_id_test !== sub.id;
    const needsPlanFix  = plan && biz.subscription_plan !== plan;
    const needsStatusFix = biz.subscription_status !== stripeStatus;

    if (needsSubFix || needsPlanFix || needsStatusFix) {
      const update = {
        stripe_subscription_id_test: sub.id,
        subscription_status: stripeStatus,
        ...(plan ? { subscription_plan: plan } : {}),
      };
      const patch = await sb(`/rest/v1/businesses?id=eq.${biz.id}`, "PATCH", update);
      console.log(
        `✅ PATCHED  ${customer.email}\n` +
        `   biz: ${biz.id}\n` +
        `   sub: ${sub.id} (was: ${biz.stripe_subscription_id_test ?? "null"})\n` +
        `   plan: ${plan} (was: ${biz.subscription_plan ?? "null"})\n` +
        `   status: ${stripeStatus} (was: ${biz.subscription_status})\n` +
        `   → ${patch.ok ? "OK" : `FAIL ${patch.status}: ${JSON.stringify(patch.data)}`}\n`
      );
    } else {
      console.log(`✓  ${customer.email} — already in sync (plan: ${plan}, status: ${stripeStatus})`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => { console.error(err); process.exit(1); });

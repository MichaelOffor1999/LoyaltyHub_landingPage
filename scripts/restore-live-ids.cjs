/**
 * restore-live-ids.cjs
 *
 * Syncs live Stripe customer + subscription IDs back into the Supabase DB.
 * Run with: node scripts/restore-live-ids.cjs
 *
 * Requires:  STRIPE_LIVE_SECRET_KEY and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * NOTE: edit STRIPE_LIVE_SECRET_KEY below or set it in your shell env.
 */

// This file intentionally uses CommonJS + require() so it can be run with plain `node`.
/* eslint-disable @typescript-eslint/no-require-imports */

// ── Config ────────────────────────────────────────────────────────────────────
// Set your LIVE secret key here (never commit this file with a real key)
const STRIPE_LIVE_KEY = process.env.STRIPE_LIVE_SECRET_KEY || "";
const SUPABASE_URL    = process.env.SUPABASE_URL || "https://elyonkqglhsrzafbanph.supabase.co";
const SERVICE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!STRIPE_LIVE_KEY || !STRIPE_LIVE_KEY.startsWith("sk_live_")) {
  console.error(
    "ERROR: Set STRIPE_LIVE_SECRET_KEY=sk_live_... before running.\n" +
    "  Example: STRIPE_LIVE_SECRET_KEY=sk_live_xxx SUPABASE_SERVICE_ROLE_KEY=eyJ... node scripts/restore-live-ids.cjs"
  );
  process.exit(1);
}
if (!SERVICE_KEY) {
  console.error("ERROR: Set SUPABASE_SERVICE_ROLE_KEY before running.");
  process.exit(1);
}

// ── Dependencies (built-in only — no ESM) ────────────────────────────────────
const https = require("https");

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// Stripe paginated list helper
async function stripeList(path, extraParams = "") {
  const items = [];
  let url = `/v1/${path}?limit=100${extraParams ? "&" + extraParams : ""}`;
  while (url) {
    const res = await httpsRequest({
      hostname: "api.stripe.com",
      path: url,
      method: "GET",
      headers: {
        Authorization: "Basic " + Buffer.from(STRIPE_LIVE_KEY + ":").toString("base64"),
      },
    });
    if (res.status !== 200) throw new Error("Stripe error: " + JSON.stringify(res.body));
    items.push(...res.body.data);
    url = res.body.has_more ? `/v1/${path}?limit=100${extraParams ? "&" + extraParams : ""}&starting_after=${res.body.data[res.body.data.length - 1].id}` : null;
  }
  return items;
}

// Supabase REST helper
async function supabaseQuery(path, method = "GET", body = null) {
  const bodyStr = body ? JSON.stringify(body) : null;
  const res = await httpsRequest({
    hostname: new URL(SUPABASE_URL).hostname,
    path: `/rest/v1/${path}`,
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: "Bearer " + SERVICE_KEY,
      "Content-Type": "application/json",
      Prefer: method === "GET" ? "return=representation" : "return=minimal",
    },
  }, bodyStr);
  return res;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Fetching all businesses from Supabase…");
  const bizRes = await supabaseQuery("businesses?select=id,owner_id,name,stripe_customer_id,stripe_subscription_id&limit=1000");
  if (bizRes.status !== 200) {
    console.error("Failed to fetch businesses:", bizRes.body);
    process.exit(1);
  }
  const businesses = bizRes.body;
  console.log(`Found ${businesses.length} businesses.`);

  console.log("Fetching all customers from Stripe (live)…");
  const customers = await stripeList("customers", "expand[]=data.subscriptions");
  console.log(`Found ${customers.length} Stripe customers.`);

  // Build email → customer map
  const emailToCustomer = {};
  for (const c of customers) {
    if (c.email) emailToCustomer[c.email.toLowerCase()] = c;
  }

  let updated = 0;
  let skipped = 0;

  for (const biz of businesses) {
    // We need the owner email — fetch from Supabase auth.users via admin API
    // Unfortunately Supabase REST doesn't expose auth.users directly, so we match by
    // whatever stripe_customer_id is already set (might be stale test ID) OR by email.
    // Strategy: look the customer up in Stripe by the existing customer ID first,
    // then fall back to email lookup.

    let customer = null;

    // Try existing ID
    if (biz.stripe_customer_id && biz.stripe_customer_id.startsWith("cus_")) {
      // Try to find this customer in our list
      customer = customers.find((c) => c.id === biz.stripe_customer_id) || null;
      if (customer && customer.id.startsWith("cus_")) {
        // Already correct live ID — verify it has an active sub
        const activeSub = (customer.subscriptions?.data || []).find((s) =>
          ["active", "trialing", "past_due"].includes(s.status)
        );
        if (activeSub) {
          if (biz.stripe_subscription_id === activeSub.id) {
            console.log(`[SKIP] ${biz.name}: already correct (${customer.id} / ${activeSub.id})`);
            skipped++;
            continue;
          }
          // Sub ID out of sync — update it
          const patchRes = await supabaseQuery(
            `businesses?id=eq.${biz.id}`,
            "PATCH",
            { stripe_customer_id: customer.id, stripe_subscription_id: activeSub.id, subscription_status: "active" }
          );
          if (patchRes.status < 300) {
            console.log(`[FIX-SUB] ${biz.name}: updated sub to ${activeSub.id}`);
            updated++;
          } else {
            console.error(`[ERR] ${biz.name}:`, patchRes.body);
          }
          continue;
        }
      }
    }

    // Existing ID didn't match — we need email. Fetch owner email from auth.users.
    // Use Supabase admin API (requires service role)
    const userRes = await httpsRequest({
      hostname: new URL(SUPABASE_URL).hostname,
      path: `/auth/v1/admin/users/${biz.owner_id}`,
      method: "GET",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: "Bearer " + SERVICE_KEY,
      },
    });

    if (userRes.status !== 200 || !userRes.body.email) {
      console.warn(`[SKIP] ${biz.name}: could not get email for owner ${biz.owner_id}`);
      skipped++;
      continue;
    }

    const email = userRes.body.email.toLowerCase();
    customer = emailToCustomer[email] || null;

    if (!customer) {
      console.warn(`[SKIP] ${biz.name} (${email}): no Stripe customer found`);
      skipped++;
      continue;
    }

    const activeSub = (customer.subscriptions?.data || []).find((s) =>
      ["active", "trialing", "past_due"].includes(s.status)
    );

    const patch = { stripe_customer_id: customer.id };
    if (activeSub) {
      patch.stripe_subscription_id = activeSub.id;
      patch.subscription_status = "active";

      // Resolve plan from price ID
      const priceId = activeSub.items?.data?.[0]?.price?.id;
      const LIVE_PRICES = {
        "price_1TClSz1hvxerH6vDEW3YbQuO": "solo",
        "price_1TClT01hvxerH6vDPQQMbI0Q": "growing",
        "price_1TClSz1hvxerH6vDjUPs0fHK": "scale",
      };
      const plan = LIVE_PRICES[priceId] || null;
      if (plan) patch.subscription_plan = plan;
    }

    const patchRes = await supabaseQuery(`businesses?id=eq.${biz.id}`, "PATCH", patch);
    if (patchRes.status < 300) {
      console.log(`[UPDATED] ${biz.name} (${email}): customer=${customer.id}, sub=${activeSub?.id ?? "none"}`);
      updated++;
    } else {
      console.error(`[ERR] ${biz.name} (${email}):`, patchRes.body);
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch((err) => { console.error(err); process.exit(1); });

/**
 * fix-duplicates.mjs
 * Finds all duplicate business rows for the same owner_id and deletes
 * the stale ones (keeping whichever has a Stripe customer ID or active plan).
 *
 * Run: node scripts/fix-duplicates.mjs
 */

// Never hardcode secrets in repo. Use environment variables.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://elyonkqglhsrzafbanph.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SERVICE_KEY) {
  console.error("ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const hdrs = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

async function sb(path, method = "GET", body) {
  const res = await fetch(SUPABASE_URL + path, {
    method,
    headers: hdrs,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

async function main() {
  // Fetch all rows
  const { data: rows } = await sb(
    "/rest/v1/businesses?select=id,owner_id,subscription_status,subscription_plan,stripe_customer_id,stripe_customer_id_test,stripe_subscription_id_test"
  );

  if (!Array.isArray(rows)) { console.error("Failed to fetch businesses:", rows); return; }

  // Group by owner_id
  const byOwner = {};
  for (const r of rows) {
    if (!byOwner[r.owner_id]) byOwner[r.owner_id] = [];
    byOwner[r.owner_id].push(r);
  }

  const dupes = Object.entries(byOwner).filter(([, list]) => list.length > 1);
  if (!dupes.length) { console.log("No duplicates found — all good!"); return; }

  console.log(`Found ${dupes.length} owner(s) with duplicate business rows:\n`);

  for (const [owner, list] of dupes) {
    console.log(`owner_id: ${owner}`);
    list.forEach((r) =>
      console.log(
        `  ${r.id}  status=${r.subscription_status}  plan=${r.subscription_plan}  cust_test=${r.stripe_customer_id_test}  sub_test=${r.stripe_subscription_id_test}`
      )
    );

    // Score each row — higher = more valuable, keep the highest
    const scored = list.map((r) => ({
      ...r,
      score:
        (r.stripe_customer_id_test ? 10 : 0) +
        (r.stripe_subscription_id_test ? 10 : 0) +
        (r.stripe_customer_id ? 5 : 0) +
        (r.subscription_plan ? 3 : 0) +
        (r.subscription_status === "active" ? 2 : r.subscription_status === "trial" ? 1 : 0),
    }));
    scored.sort((a, b) => b.score - a.score);

    const keep = scored[0];
    const toDelete = scored.slice(1);

    console.log(`  → KEEP:   ${keep.id} (score ${keep.score})`);
    for (const d of toDelete) {
      console.log(`  → DELETE: ${d.id} (score ${d.score})`);
      const r = await sb(`/rest/v1/businesses?id=eq.${d.id}`, "DELETE");
      console.log(`     ${r.ok ? "✅ deleted" : `❌ FAIL ${r.status}: ${JSON.stringify(r.data)}`}`);
    }
    console.log();
  }

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });

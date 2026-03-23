# Stripe Setup Links & Reference

All important Stripe Dashboard links for managing the Clientin / Loyalty_Hub account.
Bookmark this file — these are the pages you'll visit most often.

---

## 🔑 API Keys

> Use these to set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local` and Vercel.

**Live mode keys:**
https://dashboard.stripe.com/apikeys

**Restricted keys (for tighter scoping):**
https://dashboard.stripe.com/apikeys/restricted

---

## 🪝 Webhooks

> Your live webhook endpoint: `https://clientin.co/api/webhooks/stripe`
> Get the signing secret → set as `STRIPE_WEBHOOK_SECRET` in Vercel.

**Webhook destinations (live):**
https://dashboard.stripe.com/webhooks

**Required events to listen for:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 💳 Products & Prices

> Where you create and manage your Solo / Growing / Scale plans.
> After creating a new price, copy its `price_xxx` ID into your env vars.

**Products list:**
https://dashboard.stripe.com/products

**Create a new product/price:**
https://dashboard.stripe.com/products/create

**Current price IDs to set in `.env.local` / Vercel:**
| Plan    | Env Var               |
|---------|-----------------------|
| Solo    | `STRIPE_PRICE_SOLO`   |
| Growing | `STRIPE_PRICE_GROWING`|
| Scale   | `STRIPE_PRICE_SCALE`  |

---

## 🏛️ Customer Portal

> Lets customers manage their own subscription (upgrade, downgrade, cancel, update card).
> Make sure "Allow customers to switch plans" and proration are enabled here.

**Customer portal settings:**
https://dashboard.stripe.com/settings/billing/portal

**Key settings to confirm:**
- ✅ Allow customers to switch plans (Solo ↔ Growing ↔ Scale)
- ✅ Proration: charge/credit immediately
- ✅ Allow customers to cancel subscriptions
- ✅ Allow customers to update payment methods

---

## 📧 Customer Emails

> Stripe can automatically send receipts, failed payment notices, and trial ending reminders.

**Email settings:**
https://dashboard.stripe.com/settings/emails

**Enable:**
- ✅ Successful payments (receipts)
- ✅ Failed payments
- ✅ Trial ending reminders (3 days before)

---

## 🏢 Business & Branding

> Public-facing name, logo, support email, statement descriptor, and brand colours.

**Public business details:**
https://dashboard.stripe.com/settings/public

**Branding (logo, colours for hosted pages):**
https://dashboard.stripe.com/settings/branding

---

## 📊 Subscriptions & Customers

**All active subscriptions:**
https://dashboard.stripe.com/subscriptions

**All customers:**
https://dashboard.stripe.com/customers

**Invoices:**
https://dashboard.stripe.com/invoices

---

## 💰 Payouts

> Where your money lands. Confirm your bank account is linked and payouts are enabled.

**Payouts dashboard:**
https://dashboard.stripe.com/payouts

**Bank account settings:**
https://dashboard.stripe.com/settings/payouts

---

## 🧾 Tax (Deferred — not needed yet)

> Skip for now. When you're ready:

**Stripe Tax settings:**
https://dashboard.stripe.com/settings/tax

**Tax rates:**
https://dashboard.stripe.com/tax/rates

To enable, add `automatic_tax: { enabled: true }` to checkout session calls in `/api/subscribe/route.ts`.

---

## 🔒 Security & Fraud

**Radar (fraud rules):**
https://dashboard.stripe.com/radar

**Disputes:**
https://dashboard.stripe.com/disputes

---

## ⚙️ Vercel Environment Variables

> All Stripe secrets must also be set here for production deploys.

**Vercel project settings:**
https://vercel.com/dashboard → your project → Settings → Environment Variables

**Required vars:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SOLO=price_...
STRIPE_PRICE_GROWING=price_...
STRIPE_PRICE_SCALE=price_...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 📁 Local Reference Files

| File | Purpose |
|------|---------|
| `.env.local` | Local dev secrets (never commit) |
| `STRIPE_ENV_REFERENCE.md` | All env var names and what they do |
| `STRIPE_SETUP_LINKS.md` | This file — all Stripe Dashboard links |
| `src/lib/billing/config.ts` | Centralised billing config (env helpers) |
| `src/app/api/webhooks/stripe/route.ts` | Webhook handler (Stripe → Supabase sync) |
| `src/app/api/subscribe/route.ts` | Creates checkout session |
| `src/app/api/change-plan/route.ts` | Upgrade / downgrade logic |
| `src/app/api/billing-portal/route.ts` | Opens Stripe Customer Portal |
| `src/app/api/checkout-sync/route.ts` | Post-checkout sync (session → DB) |
| `src/app/api/subscription/route.ts` | Fetches live subscription state |

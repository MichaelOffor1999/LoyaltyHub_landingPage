import Stripe from "stripe";

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!url) throw new Error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  return url;
}

export function getSupabaseAnonKey(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getStripeSecretKey(): string {
  return requireEnv("STRIPE_SECRET_KEY");
}

export function getStripeClient(): Stripe {
  return new Stripe(getStripeSecretKey(), {
    apiVersion: "2026-02-25.clover",
  });
}

export function isStripeTestMode(): boolean {
  return getStripeSecretKey().startsWith("sk_test_");
}

export function getStripeColumns(): { COL_CUSTOMER: string; COL_SUB: string } {
  const test = isStripeTestMode();
  return {
    COL_CUSTOMER: test ? "stripe_customer_id_test" : "stripe_customer_id",
    COL_SUB: test ? "stripe_subscription_id_test" : "stripe_subscription_id",
  };
}

export function priceIdToPlan(priceId: string): "solo" | "growing" | "scale" | "unknown" {
  const solo = process.env.STRIPE_PRICE_SOLO;
  const growing = process.env.STRIPE_PRICE_GROWING;
  const scale = process.env.STRIPE_PRICE_SCALE;

  if (solo && priceId === solo) return "solo";
  if (growing && priceId === growing) return "growing";
  if (scale && priceId === scale) return "scale";
  return "unknown";
}

export function getStripePriceIds(): { solo?: string; growing?: string; scale?: string } {
  return {
    solo: process.env.STRIPE_PRICE_SOLO,
    growing: process.env.STRIPE_PRICE_GROWING,
    scale: process.env.STRIPE_PRICE_SCALE,
  };
}

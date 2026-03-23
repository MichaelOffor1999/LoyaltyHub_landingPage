/**
 * POST /api/billing-portal
 * Creates a Stripe Customer Portal session so the user can manage
 * their subscription, invoices, and payment methods.
 * Requires a valid Supabase JWT in the Authorization header.
 */
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, getStripeColumns, getSupabaseUrl, getSupabaseAnonKey, requireEnv } from "@/lib/billing/config";

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const stripe = getStripeClient();

const { COL_CUSTOMER } = getStripeColumns();

export async function POST(req: NextRequest) {
  try {
    // 1. Verify JWT
    const authHeader = req.headers.get("authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const anonKey = getSupabaseAnonKey();
    const supabaseUser = createClient(SUPABASE_URL, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    // 2. Look up Stripe customer — DB only. Never fall back to email search.
    // Email lookup can resurrect deleted businesses from Stripe and show their data.
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: businesses } = await supabase
      .from("businesses")
      .select(`id, stripe_customer_id, stripe_customer_id_test`)
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Pick the row with the mode-specific customer ID first, then fall back to main column
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const business = (businesses as any[] | null)?.sort((a: any, b: any) => {
      const aHas = !!(a?.[COL_CUSTOMER]);
      const bHas = !!(b?.[COL_CUSTOMER]);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    })[0] ?? null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const biz = business as any;
    const customerId: string | null = biz?.[COL_CUSTOMER] ?? biz?.stripe_customer_id ?? null;

    if (!customerId) {
      return NextResponse.json(
        { error: "No billing account found. Please subscribe first." },
        { status: 404 }
      );
    }

    // Validate the customer ID is valid in the current Stripe mode.
    // If not, skip gracefully — don't crash.
    try {
      await stripe.customers.retrieve(customerId);
    } catch {
      console.warn(`[billing-portal] customer ${customerId} invalid in current mode`);
      return NextResponse.json(
        { error: "No active billing account found for this mode. Please subscribe first." },
        { status: 404 }
      );
    }

    // 3. Create portal session — return URL is dynamic so it works on localhost AND production.
    //    Callers can pass ?returnPath=/account to return to a different page.
    const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || "https://clientin.co";
    const { searchParams } = new URL(req.url);
    const returnPath = searchParams.get("returnPath") ?? "/subscribe";
    const returnUrl = `${new URL(origin).origin}${returnPath}`;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[billing-portal] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

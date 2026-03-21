/**
 * POST /api/billing-portal
 * Creates a Stripe Customer Portal session so the user can manage
 * their subscription, invoices, and payment methods.
 * Requires a valid Supabase JWT in the Authorization header.
 */
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://elyonkqglhsrzafbanph.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify JWT
    const authHeader = req.headers.get("authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseUser = createClient(SUPABASE_URL, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const ownerEmail = user.email!;

    // 2. Look up Stripe customer by email
    const customers = await stripe.customers.list({ email: ownerEmail, limit: 1 });
    if (!customers.data.length) {
      return NextResponse.json(
        { error: "No billing account found. Please subscribe first." },
        { status: 404 }
      );
    }

    const customerId = customers.data[0].id;

    // 3. Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://clientin.co/account",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[billing-portal] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

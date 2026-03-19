import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STRIPE_BACKEND_URL =
  "https://clienty-backend-10k6.onrender.com/api/stripe/create-checkout";

export async function POST(req: NextRequest) {
  try {
    const { businessName, ownerEmail, ownerName, plan } = await req.json();

    // Validate required fields
    if (!businessName || !ownerEmail || !ownerName || !plan) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // 1. Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 2. Insert a new business row and get back the UUID
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    const { data: business, error: dbError } = await supabase
      .from("businesses")
      .insert({
        id: uuidv4(),
        name: businessName,
        owner_email: ownerEmail,
        owner_name: ownerName,
        subscription_status: "trial",
        trial_ends_at: trialEndsAt.toISOString(),
      })
      .select("id")
      .single();

    if (dbError || !business) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to create business record." },
        { status: 500 }
      );
    }

    // 3. Call Stripe backend with the real Supabase UUID
    const stripeRes = await fetch(STRIPE_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId: business.id,
        ownerEmail,
        ownerName,
        plan: plan.toLowerCase(),
        successUrl: "https://clientin.co/subscribe/success",
        cancelUrl: "https://clientin.co/subscribe",
      }),
    });

    if (!stripeRes.ok) {
      const errBody = await stripeRes.text();
      console.error("Stripe backend error:", errBody);
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 502 }
      );
    }

    const { url } = await stripeRes.json();

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

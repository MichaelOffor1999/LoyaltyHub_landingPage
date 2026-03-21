import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://elyonkqglhsrzafbanph.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STRIPE_BACKEND_URL =
  "https://clienty-backend-10k6.onrender.com/api/stripe/create-checkout";

export async function POST(req: NextRequest) {
  try {
    const { businessName, ownerEmail, plan } = await req.json();

    if (!businessName || !ownerEmail || !plan) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // 1. Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 2. Check if a business already exists for this email — avoid duplicates
    const { data: existing } = await supabase
      .from("businesses")
      .select("id, subscription_status")
      .eq("business_email", ownerEmail)
      .maybeSingle();

    let businessId: string;

    if (existing) {
      // Reuse existing business row — don't create a duplicate
      console.log(`[subscribe] reusing existing business ${existing.id} for ${ownerEmail}`);
      businessId = existing.id;
    } else {
      // 3. Insert a new business row using only columns that actually exist
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 30);

      const { data: business, error: dbError } = await supabase
        .from("businesses")
        .insert({
          id: uuidv4(),
          name: businessName,
          business_email: ownerEmail,   // maps to the real column
          subscription_status: "trial",
          trial_ends_at: trialEndsAt.toISOString(),
          is_public: false,
          verification_status: "pending",
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

      businessId = business.id;
      console.log(`[subscribe] created new business ${businessId} for ${ownerEmail}`);
    }

    // 4. Call the Stripe backend with the real Supabase UUID
    const stripeRes = await fetch(STRIPE_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId,
        ownerEmail,
        plan: plan.toLowerCase(),
        successUrl: "https://clientin.co/subscribe/success",
        cancelUrl:  "https://clientin.co/subscribe",
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

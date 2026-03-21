import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // used for temp password generation

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

    // 2. Look up the auth user by email (handles already-registered users)
    const { data: userList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    let existingUser = userList?.users?.find(
      (u) => u.email?.toLowerCase() === ownerEmail.toLowerCase()
    );

    // Also try the business_email column as a fallback lookup
    let ownerId: string;

    if (existingUser) {
      ownerId = existingUser.id;
      console.log(`[subscribe] found existing auth user ${ownerId} for ${ownerEmail}`);
    } else {
      // No auth user yet — create one with a temp password
      const tempPassword = uuidv4();
      const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
        email: ownerEmail,
        password: tempPassword,
        email_confirm: true,
      });

      if (authError || !newUser?.user) {
        console.error("Supabase auth create error:", authError);
        return NextResponse.json(
          { error: "Failed to create user account." },
          { status: 500 }
        );
      }

      ownerId = newUser.user.id;
      console.log(`[subscribe] created auth user ${ownerId} for ${ownerEmail}`);
    }

    // 3. Find business by owner_id OR by business_email — user may already have one
    const { data: existingBusiness } = await supabase
      .from("businesses")
      .select("id")
      .or(`owner_id.eq.${ownerId},business_email.ilike.${ownerEmail}`)
      .maybeSingle();

    let businessId: string;

    if (existingBusiness) {
      // Business already exists — just proceed to checkout
      businessId = existingBusiness.id;
      console.log(`[subscribe] reusing existing business ${businessId} for ${ownerEmail}`);
    } else {
      // Create a new business row
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 30);

      const { data: business, error: dbError } = await supabase
        .from("businesses")
        .insert({
          owner_id: ownerId,
          name: businessName,
          business_email: ownerEmail,
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
      console.log(`[subscribe] created business ${businessId} for ${ownerEmail}`);
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

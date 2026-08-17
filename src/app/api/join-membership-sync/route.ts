/**
 * POST /api/join-membership-sync
 *
 * Safety-net for when the Stripe webhook is delayed. Given a Checkout
 * Session ID, retrieves it from Stripe and syncs the corresponding
 * `memberships` row directly — mirrors /api/checkout-sync for the business
 * SaaS flow.
 *
 * Auth: Bearer <supabase_access_token>
 * Body: { sessionId: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/billing/config";
import { getMembershipsSupabase, syncMembershipFromStripe } from "@/lib/billing/memberships";

const stripe = getStripeClient();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.kind !== "membership" || session.mode !== "subscription" || !session.subscription) {
      return NextResponse.json({ synced: false, reason: "not_a_membership_session" });
    }

    const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    const sub = await stripe.subscriptions.retrieve(subId);

    const supabase = getMembershipsSupabase();
    await syncMembershipFromStripe(supabase, sub);

    return NextResponse.json({ synced: true });
  } catch (err) {
    console.error("[join-membership-sync] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

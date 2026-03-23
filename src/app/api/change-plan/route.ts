/**
 * POST /api/change-plan
 *
 * Upgrades:   switched immediately with proration charged now.
 * Downgrades: scheduled via a Stripe subscription schedule to take effect
 *             at the end of the current billing period (matches mobile app behaviour).
 *
 * Body: { plan: "solo" | "growing" | "scale" }
 * Auth: Bearer <supabase_access_token>
 */
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, getStripeColumns, getSupabaseUrl, getSupabaseAnonKey, requireEnv } from "@/lib/billing/config";

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const stripe = getStripeClient();

// Use separate DB columns for test vs live so they never overwrite each other
const { COL_CUSTOMER, COL_SUB } = getStripeColumns();

const PRICE_IDS: Record<string, string | undefined> = {
  solo:    process.env.STRIPE_PRICE_SOLO,
  growing: process.env.STRIPE_PRICE_GROWING,
  scale:   process.env.STRIPE_PRICE_SCALE,
};

export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth ──────────────────────────────────────────────────────
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

    // ── 2. Parse + validate plan ─────────────────────────────────────
    const { plan, cancelSchedule } = await req.json();

    // ── Cancel a scheduled downgrade ─────────────────────────────────
    if (cancelSchedule) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { data: businesses } = await supabase
        .from("businesses")
        .select(`id, stripe_customer_id, stripe_subscription_id, stripe_customer_id_test, stripe_subscription_id_test`)
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const biz = ((businesses as any[] | null)?.sort((a: any, b: any) => {
        const aHas = !!(a?.[COL_SUB] ?? a?.stripe_subscription_id);
        const bHas = !!(b?.[COL_SUB] ?? b?.stripe_subscription_id);
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        return 0;
      })[0]) ?? null;
      const subId: string | null = biz?.[COL_SUB] ?? biz?.stripe_subscription_id ?? null;
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        if (sub.schedule) {
          await stripe.subscriptionSchedules.release(sub.schedule as string);
        }
        const { error: clearErr } = await supabase
          .from("businesses")
          .update({ pending_plan: null, pending_plan_date: null })
          .eq("id", biz.id);
        if (clearErr) console.error("[change-plan] cancel-schedule DB clear error:", clearErr);
      }
      return NextResponse.json({ success: true, cancelled: true });
    }

    const newPriceId = PRICE_IDS[plan?.toLowerCase()];
    if (!newPriceId) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    // ── 3. Fetch business + stripe IDs from DB ───────────────────────
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: businesses } = await supabase
      .from("businesses")
      .select(`id, stripe_customer_id, stripe_subscription_id, stripe_customer_id_test, stripe_subscription_id_test`)
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Pick the row with actual Stripe data for the current mode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const biz = ((businesses as any[] | null)?.sort((a: any, b: any) => {
      const aHas = !!(a?.[COL_CUSTOMER] ?? a?.stripe_customer_id);
      const bHas = !!(b?.[COL_CUSTOMER] ?? b?.stripe_customer_id);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    })[0]) ?? null;
    // Fall back to main columns if the mode-specific column is empty
    const customerId: string | null = biz?.[COL_CUSTOMER] ?? biz?.stripe_customer_id ?? null;
    const subId: string | null      = biz?.[COL_SUB]      ?? biz?.stripe_subscription_id ?? null;

    if (!customerId || !subId) {
      return NextResponse.json(
        { error: "No active subscription found. Please subscribe first." },
        { status: 404 }
      );
    }

    // ── 4. Fetch the live subscription from Stripe ───────────────────
    let subscription: Stripe.Subscription;
    try {
      subscription = await stripe.subscriptions.retrieve(subId);
    } catch {
      return NextResponse.json(
        { error: "Could not find your subscription in Stripe. Please contact support." },
        { status: 404 }
      );
    }

    if (!["active", "trialing", "past_due"].includes(subscription.status)) {
      return NextResponse.json(
        { error: `Subscription is ${subscription.status} — cannot change plan.` },
        { status: 400 }
      );
    }

    const currentItem = subscription.items.data[0];
    if (!currentItem) {
      return NextResponse.json({ error: "No subscription item found." }, { status: 400 });
    }

    // Already on this plan — nothing to do
    if (currentItem.price.id === newPriceId) {
      return NextResponse.json({ success: true, alreadyOnPlan: true });
    }

    // ── 5. Upgrade vs Downgrade ──────────────────────────────────────
    // Use tier order (not price) to decide upgrade vs downgrade —
    // immune to test-mode price overrides (e.g. scale set to €150 for testing).
    const PLAN_TIER: Record<string, number> = { solo: 1, growing: 2, scale: 3 };
    const currentPlanKey = Object.entries(PRICE_IDS).find(([, v]) => v === currentItem.price.id)?.[0] ?? "solo";
    const newPlanKey = plan.toLowerCase();
    const isUpgrade = (PLAN_TIER[newPlanKey] ?? 0) > (PLAN_TIER[currentPlanKey] ?? 0);

    let scheduledDate: number | null = null;

    if (isUpgrade) {
      // ── Upgrade: switch immediately with proration ────────────────
      if (subscription.schedule) {
        await stripe.subscriptionSchedules.release(subscription.schedule as string);
      }

      await stripe.subscriptions.update(subId, {
        items: [{ id: currentItem.id, price: newPriceId }],
        proration_behavior: "create_prorations",
      });

      await supabase
        .from("businesses")
        .update({
          subscription_plan: newPlanKey,
          subscription_status: "active",
          pending_plan: null,
          pending_plan_date: null,
        })
        .eq("id", biz.id);

      console.log(`[change-plan] UPGRADE user ${user.id}: ${currentPlanKey} → ${newPlanKey} (immediate)`);

    } else {
      // ── Downgrade: schedule to take effect at end of billing period ──
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentPeriodEnd: number = currentItem.current_period_end ?? 0;
      scheduledDate = currentPeriodEnd;

      if (subscription.schedule) {
        // Schedule already exists — retrieve it to get the actual start_date of phase 1
        const existingSchedule = await stripe.subscriptionSchedules.retrieve(subscription.schedule as string);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const phase1Start = (existingSchedule.phases[0] as any).start_date as number;
        await stripe.subscriptionSchedules.update(subscription.schedule as string, {
          phases: [
            // Phase 1: keep current plan, use its original start_date (cannot change it)
            { items: [{ price: currentItem.price.id, quantity: 1 }], start_date: phase1Start, end_date: currentPeriodEnd },
            // Phase 2: switch to new plan at period end
            { items: [{ price: newPriceId, quantity: 1 }] },
          ],
          end_behavior: "release",
        });
      } else {
        // No schedule yet.
        // Step 1: create schedule FROM the existing subscription — Stripe auto-creates phase 1.
        const schedule = await stripe.subscriptionSchedules.create({
          from_subscription: subId,
        });
        // Step 2: retrieve it to get the real start_date Stripe assigned to phase 1.
        const freshSchedule = await stripe.subscriptionSchedules.retrieve(schedule.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const phase1Start = (freshSchedule.phases[0] as any).start_date as number;
        // Step 3: update to add the future downgrade phase (never touch phase 1 start_date).
        await stripe.subscriptionSchedules.update(schedule.id, {
          phases: [
            { items: [{ price: currentItem.price.id, quantity: 1 }], start_date: phase1Start, end_date: currentPeriodEnd },
            { items: [{ price: newPriceId, quantity: 1 }] },
          ],
          end_behavior: "release",
        });
      }

      const { error: pendingErr } = await supabase
        .from("businesses")
        .update({ pending_plan: newPlanKey, pending_plan_date: new Date(currentPeriodEnd * 1000).toISOString() })
        .eq("id", biz.id);
      if (pendingErr) console.error("[change-plan] pending_plan DB write error:", pendingErr);

      console.log(`[change-plan] DOWNGRADE user ${user.id}: ${currentPlanKey} → ${newPlanKey} scheduled for ${new Date(currentPeriodEnd * 1000).toISOString()}`);
    }

    return NextResponse.json({
      success: true,
      plan: isUpgrade ? newPlanKey : currentPlanKey,
      pendingPlan: isUpgrade ? null : newPlanKey,
      scheduledDate,
      isUpgrade,
    });
  } catch (err) {
    console.error("[change-plan] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
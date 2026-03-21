"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Check, Zap, Star, Rocket, X, Loader2, ArrowLeft,
  RefreshCw, CreditCard, ExternalLink, FileText,
  ChevronRight, LogOut, AlertCircle, Receipt,
} from "lucide-react";

// ─── Supabase browser client ─────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Plan definitions ────────────────────────────────────────────────
type PlanKey = "solo" | "growing" | "scale";

interface Plan {
  key: PlanKey;
  name: string;
  price: string;
  monthly: number;
  branches: string;
  icon: React.ReactNode;
  features: string[];
  highlight: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    key: "solo",
    name: "Solo",
    price: "€29",
    monthly: 29,
    branches: "1 branch",
    icon: <Zap className="w-5 h-5" />,
    highlight: false,
    features: [
      "Dashboard analytics",
      "Loyalty programs",
      "QR scanner",
      "Staff management",
      "Send offers",
    ],
  },
  {
    key: "growing",
    name: "Growing",
    price: "€59",
    monthly: 59,
    branches: "Up to 4 branches",
    icon: <Star className="w-5 h-5" />,
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Solo",
      "Full Customer Insights suite",
      "Monthly visit comparison",
      "Visit trend chart",
      "At-risk customer alerts",
      "Active / new / repeat breakdown",
    ],
  },
  {
    key: "scale",
    name: "Scale",
    price: "€89",
    monthly: 89,
    branches: "Unlimited branches",
    icon: <Rocket className="w-5 h-5" />,
    highlight: false,
    features: [
      "Everything in Growing",
      "Priority support",
    ],
  },
];

// ─── OTP input ───────────────────────────────────────────────────────
const OTP_LENGTH = 6;

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");
  const focus = (i: number) => inputRefs.current[i]?.focus();

  const handleChange = (i: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, OTP_LENGTH - i);
    if (!cleaned) return;
    const next = [...digits];
    for (let j = 0; j < cleaned.length; j++) next[i + j] = cleaned[j];
    onChange(next.join(""));
    focus(Math.min(i + cleaned.length, OTP_LENGTH - 1));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (digits[i]) { next[i] = ""; onChange(next.join("")); }
      else if (i > 0) { next[i - 1] = ""; onChange(next.join("")); focus(i - 1); }
    } else if (e.key === "ArrowLeft" && i > 0) focus(i - 1);
    else if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) focus(i + 1);
  };

  return (
    <div className="flex gap-2.5 justify-center my-2">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          value={digits[i] ?? ""}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className="w-12 h-14 rounded-xl text-center text-xl font-bold outline-none transition-all disabled:opacity-50"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: digits[i] ? "2px solid var(--brand)" : "1px solid var(--card-border)",
            color: "var(--foreground)",
          }}
        />
      ))}
    </div>
  );
}

function ResendButton({ onResend, disabled }: { onResend: () => void; disabled: boolean }) {
  const [secs, setSecs] = useState(30);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const canResend = secs <= 0 && !disabled;
  return (
    <button
      type="button"
      onClick={() => { if (!canResend) return; setSecs(30); onResend(); }}
      disabled={!canResend}
      className="flex items-center gap-1.5 text-xs font-medium transition-opacity disabled:opacity-40"
      style={{ color: canResend ? "var(--brand)" : "var(--text-muted)" }}
    >
      <RefreshCw className="w-3 h-3" />
      {secs > 0 ? `Resend code in ${secs}s` : "Resend code"}
    </button>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p
      className="text-sm rounded-xl px-4 py-3"
      style={{
        background: "rgba(239,68,68,0.1)",
        color: "#f87171",
        border: "1px solid rgba(239,68,68,0.2)",
      }}
    >
      {message}
    </p>
  );
}

// ─── Shared input styles ─────────────────────────────────────────────
const inp: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--card-border)",
  color: "var(--foreground)",
};
const focusBrand = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.border = "1.5px solid var(--brand)");
const blurBorder = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.border = "1px solid var(--card-border)");

// ─── Types ───────────────────────────────────────────────────────────
interface Invoice {
  id: string;
  number: string | null;
  amount: number;
  currency: string;
  status: string | null;
  date: number;
  pdf: string | null;
  hostedUrl: string | null;
}

interface SubscriptionData {
  business: {
    id: string;
    name: string;
    subscriptionStatus: string;
    trialEndsAt: string | null;
  } | null;
  stripe: {
    customerId: string | null;
    activePlan: string | null;
    subscriptionStatus: string | null;
    currentPeriodEnd: number | null;
  };
  invoices: Invoice[];
}

// ─── Plan picker card ────────────────────────────────────────────────
function PlanPickerCard({
  plan,
  isCurrentPlan,
  isLoading,
  isActivePaidSub,
  currentPlanMonthly,
  onSelect,
}: {
  plan: Plan;
  isCurrentPlan: boolean;
  isLoading: boolean;
  isActivePaidSub: boolean;
  currentPlanMonthly: number;
  onSelect: (p: Plan) => void;
}) {
  return (
    <div
      className="relative flex flex-col rounded-2xl p-6 transition-all duration-200"
      style={{
        background: plan.highlight
          ? "linear-gradient(135deg, rgba(201,123,58,0.12) 0%, rgba(201,123,58,0.04) 100%)"
          : isCurrentPlan
          ? "rgba(201,123,58,0.06)"
          : "var(--card-bg)",
        border: isCurrentPlan
          ? "2px solid var(--brand)"
          : plan.highlight
          ? "1px solid rgba(201,123,58,0.4)"
          : "1px solid var(--card-border)",
        boxShadow: plan.highlight ? "0 0 32px rgba(201,123,58,0.08)" : "none",
      }}
    >
      {plan.badge && !isCurrentPlan && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          {plan.badge}
        </span>
      )}
      {isCurrentPlan && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
          style={{ background: "rgba(201,123,58,0.9)", color: "#fff" }}
        >
          ✓ Current plan
        </span>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: plan.highlight ? "rgba(201,123,58,0.2)" : "rgba(255,255,255,0.06)",
            color: plan.highlight ? "var(--brand)" : "var(--text-sub)",
          }}
        >
          {plan.icon}
        </span>
        <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>{plan.name}</span>
      </div>

      <div className="mb-1">
        <span className="text-3xl font-black" style={{ color: "var(--foreground)" }}>{plan.price}</span>
        <span className="text-xs ml-1" style={{ color: "var(--text-sub)" }}>/mo</span>
      </div>
      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>{plan.branches}</p>

      <ul className="flex flex-col gap-2 mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-sub)" }}>
            <Check
              className="w-3.5 h-3.5 mt-0.5 shrink-0"
              style={{ color: plan.highlight ? "var(--brand)" : "rgba(255,255,255,0.35)" }}
            />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => !isCurrentPlan && onSelect(plan)}
        disabled={isCurrentPlan || isLoading}
        className="w-full rounded-xl py-3 text-sm font-bold tracking-wide transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        style={
          isCurrentPlan
            ? { background: "rgba(201,123,58,0.12)", color: "var(--brand)", cursor: "default" }
            : plan.highlight
            ? { background: "var(--brand)", color: "#fff" }
            : {
                background: "rgba(255,255,255,0.06)",
                color: "var(--foreground)",
                border: "1px solid var(--card-border)",
              }
        }
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />
            {isActivePaidSub ? "Opening billing…" : "Redirecting…"}</>
        ) : isCurrentPlan ? (
          "Current plan"
        ) : isActivePaidSub ? (
          plan.monthly > currentPlanMonthly ? `Upgrade to ${plan.name} →` : `Downgrade to ${plan.name} →`
        ) : (
          `Start with ${plan.name} →`
        )}
      </button>
    </div>
  );
}

// ─── Invoice row ─────────────────────────────────────────────────────
function InvoiceRow({ inv }: { inv: Invoice }) {
  const date = new Date(inv.date * 1000).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const amount = (inv.amount / 100).toLocaleString("en-IE", {
    style: "currency",
    currency: inv.currency.toUpperCase(),
  });
  const statusColor =
    inv.status === "paid" ? "#4ade80" :
    inv.status === "open" ? "#facc15" :
    "#f87171";

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--card-border)" }}
    >
      <div className="flex items-center gap-3">
        <Receipt className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            {inv.number ?? "Invoice"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{amount}</p>
          <span className="text-xs font-semibold capitalize" style={{ color: statusColor }}>
            {inv.status}
          </span>
        </div>
        {inv.hostedUrl && (
          <a
            href={inv.hostedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors"
            title="View invoice"
          >
            <ExternalLink className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
          </a>
        )}
        {inv.pdf && (
          <a
            href={inv.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors"
            title="Download PDF"
          >
            <FileText className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard (signed-in view) ───────────────────────────────────────
function Dashboard({
  accessToken,
  userEmail,
  data,
  onSignOut,
  onRefresh,
}: {
  accessToken: string;
  userEmail: string;
  data: SubscriptionData;
  onSignOut: () => void;
  onRefresh: () => void;
}) {
  const [changingPlan, setChangingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);

  const hasNoSubscription = !data.business && !data.stripe.customerId;
  const trialExpired =
    data.business?.subscriptionStatus === "trial" &&
    data.business?.trialEndsAt !== null &&
    new Date(data.business.trialEndsAt!) < new Date();

  // Auto-open plan picker if trial is expired or no subscription
  const [showPlans, setShowPlans] = useState(hasNoSubscription || trialExpired);

  const currentPlan = data.stripe.activePlan ?? data.business?.subscriptionStatus ?? null;
  const isOnTrial = data.business?.subscriptionStatus === "trial";
  const trialDaysLeft = data.business?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(data.business.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;
  const nextBillingDate = data.stripe.currentPeriodEnd
    ? new Date(data.stripe.currentPeriodEnd * 1000).toLocaleDateString("en-IE", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;
  const planInfo = PLANS.find((p) => p.key === currentPlan);

  // Is this customer already on a paid Stripe subscription?
  const isActivePaidSub =
    data.stripe.customerId &&
    data.stripe.subscriptionStatus &&
    ["active", "past_due", "trialing"].includes(data.stripe.subscriptionStatus);

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.key === currentPlan) return;
    setChangingPlan(plan.key);
    setPlanError(null);

    // ── Already a paying customer → send to Stripe billing portal ────
    // Stripe handles upgrade/downgrade safely with proration.
    if (isActivePaidSub) {
      try {
        const res = await fetch("/api/billing-portal", {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await res.json();
        if (!res.ok) { setPlanError(json.error ?? "Could not open billing portal."); setChangingPlan(null); return; }
        window.location.href = json.url;
      } catch {
        setPlanError("Network error. Please try again.");
        setChangingPlan(null);
      }
      return;
    }

    // ── No paid subscription yet (still on app trial) → Stripe Checkout ──
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ businessName: data.business?.name ?? "My Business", plan: plan.key }),
      });
      const json = await res.json();
      if (!res.ok) { setPlanError(json.error ?? "Something went wrong."); setChangingPlan(null); return; }
      window.location.href = json.url;
    } catch {
      setPlanError("Network error. Please try again.");
      setChangingPlan(null);
    }
  };

  const handleBillingPortal = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json();
      if (!res.ok) { setPortalError(json.error ?? "Could not open billing portal."); setPortalLoading(false); return; }
      window.location.href = json.url;
    } catch {
      setPortalError("Network error. Please try again.");
      setPortalLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1" style={{ color: "var(--foreground)" }}>
            {data.business?.name ?? "My Subscription"}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{userEmail}</p>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-1.5 text-xs font-semibold shrink-0 hover:opacity-70 transition-opacity mt-1"
          style={{ color: "var(--text-sub)" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>

      {/* ── Trial expired banner ─────────────────────────────────────── */}
      {trialExpired && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.04) 100%)",
            border: "1px solid rgba(239,68,68,0.35)",
          }}
        >
          <div className="flex items-start gap-4">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}
            >
              <AlertCircle className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <p className="font-bold text-base mb-1" style={{ color: "var(--foreground)" }}>
                Your free trial has ended
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text-sub)" }}>
                Your 30-day trial is over. Pick a plan below to keep using ClientIn — it only takes a minute to set up.
              </p>
              <button
                onClick={() => setShowPlans(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                Choose a plan →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No subscription at all */}
      {hasNoSubscription && (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--brand)" }} />
          <p className="text-base font-bold mb-1" style={{ color: "var(--foreground)" }}>No active subscription</p>
          <p className="text-sm mb-5" style={{ color: "var(--text-sub)" }}>
            Pick a plan below to get started with a 30-day free trial.
          </p>
          <button
            onClick={() => setShowPlans(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            style={{ background: "var(--brand)", color: "#fff" }}
          >
            Choose a plan →
          </button>
        </div>
      )}

      {/* Current plan hero card */}
      {!hasNoSubscription && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(201,123,58,0.1) 0%, rgba(201,123,58,0.03) 100%)",
            border: "1px solid rgba(201,123,58,0.3)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--brand)" }}>
            Current plan
          </p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {planInfo && (
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ background: "rgba(201,123,58,0.2)", color: "var(--brand)" }}
                >
                  {planInfo.icon}
                </span>
              )}
              <div>
                <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>
                  {planInfo ? `${planInfo.name} — ${planInfo.price}/mo` : "Free Trial"}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {isOnTrial && trialDaysLeft !== null && (
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(201,123,58,0.15)", color: "var(--brand)" }}
                    >
                      {trialDaysLeft} days left in trial
                    </span>
                  )}
                  {data.stripe.subscriptionStatus && (
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                      style={{
                        background:
                          data.stripe.subscriptionStatus === "active" ||
                          data.stripe.subscriptionStatus === "trialing"
                            ? "rgba(74,222,128,0.1)"
                            : "rgba(239,68,68,0.1)",
                        color:
                          data.stripe.subscriptionStatus === "active" ||
                          data.stripe.subscriptionStatus === "trialing"
                            ? "#4ade80"
                            : "#f87171",
                      }}
                    >
                      {data.stripe.subscriptionStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {nextBillingDate && (
              <div className="text-right">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Next billing</p>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{nextBillingDate}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              onClick={() => setShowPlans((v) => !v)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "var(--brand)", color: "#fff" }}
            >
              {showPlans ? "Hide plans" : "Change plan"}
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${showPlans ? "rotate-90" : ""}`}
              />
            </button>
            {data.stripe.customerId && (
              <button
                onClick={handleBillingPortal}
                disabled={portalLoading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-60"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--card-border)",
                  color: "var(--text-sub)",
                }}
              >
                {portalLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Loading…</>
                ) : (
                  <><CreditCard className="w-4 h-4" />Manage billing</>
                )}
              </button>
            )}
          </div>
          {portalError && <div className="mt-3"><ErrorBanner message={portalError} /></div>}
        </div>
      )}

      {/* Plan picker */}
      {(showPlans || hasNoSubscription) && (
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--text-muted)" }}
          >
            {hasNoSubscription ? "Choose your plan" : "Available plans"}
          </p>
          {planError && <div className="mb-4"><ErrorBanner message={planError} /></div>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <PlanPickerCard
                key={plan.key}
                plan={plan}
                isCurrentPlan={plan.key === currentPlan}
                isLoading={changingPlan === plan.key}
                isActivePaidSub={!!isActivePaidSub}
                currentPlanMonthly={planInfo?.monthly ?? 0}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
          <p className="text-xs text-center mt-5" style={{ color: "var(--text-muted)" }}>
            {isActivePaidSub
              ? "Upgrade and downgrade are handled securely via Stripe — prorated billing applied automatically."
              : "You'll be taken to Stripe to complete payment securely. Trial days remaining will be honoured."}
          </p>
        </div>
      )}

      {/* Payment history */}
      {data.invoices.length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Payment history
          </p>
          <div className="flex flex-col gap-2.5">
            {data.invoices.map((inv) => (
              <InvoiceRow key={inv.id} inv={inv} />
            ))}
          </div>
        </div>
      )}

      {data.invoices.length === 0 && data.stripe.customerId && (
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <Receipt className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>No payments yet</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            You're still in your free trial — no charges until your trial ends.
          </p>
        </div>
      )}

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Questions?{" "}
        <a
          href="mailto:hello@clientin.co"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          style={{ color: "var(--brand)" }}
        >
          hello@clientin.co
        </a>
      </p>
    </div>
  );
}

// ─── Auth gate (email → OTP) ──────────────────────────────────────────
type AuthStep = "email" | "otp" | "loading";

function AuthGate({ onAuth }: { onAuth: (token: string, email: string) => void }) {
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useCallback(async (target: string) => {
    setSending(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: target,
      options: { shouldCreateUser: true },
    });
    setSending(false);
    if (error) { setError(error.message); return false; }
    return true;
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendOtp(email);
    if (ok) setStep("otp");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < OTP_LENGTH) { setError("Please enter the full 6-digit code."); return; }
    setVerifying(true);
    setError(null);
    const { data, error: err } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (err || !data.session) {
      setVerifying(false);
      setError(err?.message ?? "Incorrect code. Please try again.");
      return;
    }
    onAuth(data.session.access_token, email);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Heading */}
      <div className="text-center mb-10">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
          style={{ background: "rgba(201,123,58,0.15)", color: "var(--brand)" }}
        >
          Subscription Management
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: "var(--foreground)" }}>
          Manage your plan
        </h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          Enter your email to view your current plan, payment history,<br className="hidden sm:block" />
          or start a free trial on a new plan.
        </p>
      </div>

      {/* Auth card */}
      <div
        className="rounded-2xl p-7 shadow-lg"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        {step === "email" && (
          <>
            <h2 className="text-base font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Enter your email
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>
              We'll send a one-time code — no password needed.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder="you@yourbusiness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={inp}
                onFocus={focusBrand}
                onBlur={blurBorder}
              />
              {error && <ErrorBanner message={error} />}
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : "Continue →"}
              </button>
            </form>
          </>
        )}

        {(step === "otp" || step === "loading") && (
          <>
            {step === "otp" && (
              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(null); }}
                className="flex items-center gap-1.5 text-xs font-medium mb-5 hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-sub)" }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            <h2 className="text-base font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Check your email
            </h2>
            <p className="text-sm mb-1" style={{ color: "var(--text-sub)" }}>6-digit code sent to</p>
            <p className="text-sm font-semibold mb-5" style={{ color: "var(--brand)" }}>{email}</p>
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <OtpInput value={otp} onChange={setOtp} disabled={verifying || step === "loading"} />
              {error && <ErrorBanner message={error} />}
              <button
                type="submit"
                disabled={otp.length < OTP_LENGTH || verifying || step === "loading"}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                {verifying || step === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />
                    {step === "loading" ? "Loading account…" : "Verifying…"}</>
                ) : "Verify & view account →"}
              </button>
              <div className="flex justify-center">
                <ResendButton
                  onResend={() => sendOtp(email)}
                  disabled={sending || verifying || step === "loading"}
                />
              </div>
            </form>
          </>
        )}
      </div>

      {/* Plan preview tiles */}
      <div className="mt-10">
        <p
          className="text-xs text-center mb-5 font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          Available plans
        </p>
        <div className="grid grid-cols-3 gap-3">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className="rounded-xl p-4 text-center"
              style={{
                background: plan.highlight ? "rgba(201,123,58,0.08)" : "var(--card-bg)",
                border: plan.highlight
                  ? "1px solid rgba(201,123,58,0.35)"
                  : "1px solid var(--card-border)",
              }}
            >
              <span
                className="flex justify-center mb-2"
                style={{ color: plan.highlight ? "var(--brand)" : "var(--text-muted)" }}
              >
                {plan.icon}
              </span>
              <p className="text-xs font-bold mb-0.5" style={{ color: "var(--foreground)" }}>{plan.name}</p>
              <p
                className="text-base font-black"
                style={{ color: plan.highlight ? "var(--brand)" : "var(--foreground)" }}
              >
                {plan.price}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>/mo</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
          30-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function SubscribePage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Restore existing session on mount — validate it first so a stale/expired
  // token never shows the error screen; just drop back to the auth gate.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      // Double-check the token is still accepted by Supabase
      const { data: userData, error } = await supabase.auth.getUser(
        data.session.access_token
      );
      if (error || !userData.user) {
        // Token is stale — sign out silently and show auth gate
        await supabase.auth.signOut();
        return;
      }
      setAccessToken(data.session.access_token);
      setUserEmail(userData.user.email ?? null);
    });
  }, []);

  const fetchData = useCallback(async (token: string) => {
    setLoadingData(true);
    setDataError(null);
    try {
      const res = await fetch("/api/subscription", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.status === 401) {
        // Session expired mid-session — sign out and show auth gate
        await supabase.auth.signOut();
        setAccessToken(null);
        setUserEmail(null);
        setSubData(null);
      } else if (!res.ok) {
        setDataError(json.error ?? "Failed to load subscription data.");
      } else {
        setSubData(json);
      }
    } catch {
      setDataError("Network error. Please try again.");
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (accessToken) fetchData(accessToken);
  }, [accessToken, fetchData]);

  const handleAuth = (token: string, email: string) => {
    setAccessToken(token);
    setUserEmail(email);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAccessToken(null);
    setUserEmail(null);
    setSubData(null);
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Nav */}
      <div
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4"
        style={{
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--nav-border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <a
          href="/"
          className="font-black text-sm sm:text-base tracking-[0.15em] uppercase"
          style={{ color: "var(--foreground)" }}
        >
          clientIn
        </a>
        <a
          href="/"
          className="text-xs font-semibold tracking-wide transition-opacity hover:opacity-70"
          style={{ color: "var(--text-sub)" }}
        >
          ← Back to home
        </a>
      </div>

      {/* Content */}
      <div className="pt-24 pb-20">
        {!accessToken && <AuthGate onAuth={handleAuth} />}

        {accessToken && loadingData && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--brand)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading your account…</p>
          </div>
        )}

        {accessToken && !loadingData && dataError && (
          <div className="max-w-md mx-auto px-4 py-16 text-center">
            <AlertCircle className="w-10 h-10 mx-auto mb-4" style={{ color: "#f87171" }} />
            <p className="text-sm mb-5" style={{ color: "#f87171" }}>{dataError}</p>
            <button
              onClick={() => fetchData(accessToken)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold hover:opacity-90"
              style={{ background: "var(--brand)", color: "#fff" }}
            >
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        )}

        {accessToken && !loadingData && !dataError && subData && (
          <Dashboard
            accessToken={accessToken}
            userEmail={userEmail!}
            data={subData}
            onSignOut={handleSignOut}
            onRefresh={() => fetchData(accessToken)}
          />
        )}
      </div>
    </div>
  );
}

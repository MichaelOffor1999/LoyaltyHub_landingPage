"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Check, Zap, Star, Rocket, X, Loader2, ArrowLeft,
  RefreshCw, CreditCard, LogOut, ChevronRight, AlertCircle,
} from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Plan info ───────────────────────────────────────────────────────
const PLANS = [
  {
    key: "solo",
    name: "Solo",
    price: "€29",
    monthly: 29,
    branches: "1 branch",
    icon: <Zap className="w-4 h-4" />,
    highlight: false,
    features: ["Dashboard analytics", "Loyalty programs", "QR scanner", "Staff management", "Send offers"],
  },
  {
    key: "growing",
    name: "Growing",
    price: "€59",
    monthly: 59,
    branches: "Up to 4 branches",
    icon: <Star className="w-4 h-4" />,
    highlight: true,
    badge: "Most Popular",
    features: ["Everything in Solo", "Full Customer Insights suite", "Monthly visit comparison", "Visit trend chart", "At-risk customer alerts", "Active / new / repeat breakdown"],
  },
  {
    key: "scale",
    name: "Scale",
    price: "€149",
    monthly: 149,
    branches: "Unlimited branches",
    icon: <Rocket className="w-4 h-4" />,
    highlight: false,
    features: [
      "Everything in Growing",
      "Unlimited branches",
      "Advanced multi-location reporting",
      "Bulk customer import & export",
    ],
  },
];

// ─── OTP input ───────────────────────────────────────────────────────
const OTP_LENGTH = 6;

function OtpInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
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
    <div className="flex gap-2 justify-center my-2">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text" inputMode="numeric" pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          value={digits[i] ?? ""} disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className="w-10 h-12 rounded-xl text-center text-lg font-bold outline-none transition-all disabled:opacity-50"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: digits[i] ? "1.5px solid var(--brand)" : "1px solid var(--card-border)",
            color: "var(--foreground)",
          }}
        />
      ))}
    </div>
  );
}

function ResendButton({ onResend, disabled }: { onResend: () => void; disabled: boolean }) {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  const canResend = seconds <= 0 && !disabled;
  return (
    <button type="button" onClick={() => { if (!canResend) return; setSeconds(30); onResend(); }}
      disabled={!canResend}
      className="flex items-center gap-1.5 text-xs font-medium transition-opacity disabled:opacity-40"
      style={{ color: canResend ? "var(--brand)" : "var(--text-muted)" }}>
      <RefreshCw className="w-3 h-3" />
      {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
    </button>
  );
}

// ─── Sign-in modal (OTP) ─────────────────────────────────────────────
function SignInModal({ onSuccess, onClose }: { onSuccess: (token: string, email: string) => void; onClose: () => void }) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useCallback(async (target: string) => {
    setSending(true); setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: target,
      options: { shouldCreateUser: false },
    });
    setSending(false);
    if (error) {
      // Supabase returns "Signups not allowed" when the user doesn't exist yet
      if (error.message.toLowerCase().includes("not allowed") || error.message.toLowerCase().includes("not found")) {
        setError("No account found for this email. Please go to /subscribe to start your free trial.");
      } else {
        setError(error.message);
      }
      return false;
    }
    return true;
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendOtp(email);
    if (ok) setStep("otp");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < OTP_LENGTH) { setError("Enter the full 6-digit code."); return; }
    setVerifying(true); setError(null);
    const { data, error: err } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (err || !data.session) { setVerifying(false); setError(err?.message ?? "Incorrect code."); return; }
    onSuccess(data.session.access_token, email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-sm rounded-2xl p-7 shadow-2xl"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-white/10">
          <X className="w-4 h-4" style={{ color: "var(--muted)" }} />
        </button>

        {step === "email" ? (
          <>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>Sign in to your account</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>Enter your email and we&apos;ll send a code.</p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input type="email" required placeholder="you@yourbusiness.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                onFocus={(e) => (e.currentTarget.style.border = "1px solid var(--brand)")}
                onBlur={(e) => (e.currentTarget.style.border = "1px solid var(--card-border)")} />
              {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>{error}</p>}
              <button type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--brand)", color: "#fff" }}>
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : "Continue →"}
              </button>
            </form>
          </>
        ) : (
          <>
            <button onClick={() => { setStep("email"); setOtp(""); setError(null); }}
              className="flex items-center gap-1.5 text-xs mb-4 hover:opacity-70"
              style={{ color: "var(--text-sub)" }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>Check your email</h2>
            <p className="text-sm mb-1" style={{ color: "var(--text-sub)" }}>Code sent to</p>
            <p className="text-sm font-semibold mb-5" style={{ color: "var(--brand)" }}>{email}</p>
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <OtpInput value={otp} onChange={setOtp} disabled={verifying} />
              {error && <p className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>{error}</p>}
              <button type="submit" disabled={otp.length < OTP_LENGTH || verifying}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--brand)", color: "#fff" }}>
                {verifying ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</> : "Sign in →"}
              </button>
              <div className="flex justify-center">
                <ResendButton onResend={() => sendOtp(email)} disabled={sending || verifying} />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Upgrade modal (plan picker) ─────────────────────────────────────
function UpgradeModal({ accessToken, currentPlan, isActivePaidSub, businessName, onClose, onPlanChanged }: {
  accessToken: string;
  currentPlan: string | null;
  isActivePaidSub: boolean;
  businessName: string;
  onClose: () => void;
  onPlanChanged: (newPlan: string) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  const currentPlanInfo = PLANS.find((p) => p.key === currentPlan);

  const handleSelect = (planKey: string) => {
    if (planKey === currentPlan) return;
    setError(null);
    if (isActivePaidSub) {
      setConfirmKey(planKey); // show confirm step
    } else {
      doCheckout(planKey);
    }
  };

  const doCheckout = async (planKey: string) => {
    setLoading(planKey); setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ businessName, plan: planKey }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Something went wrong."); setLoading(null); return; }
      // Use location.assign (method call) to satisfy immutability lint
      window.location.assign(json.url);
    } catch { setError("Network error. Please try again."); setLoading(null); }
  };

  const doChangePlan = async (planKey: string) => {
    setConfirmKey(null);
    setLoading(planKey); setError(null); setSuccess(null);
    try {
      const res = await fetch("/api/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ plan: planKey }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Could not change plan."); setLoading(null); return; }
      const planName = PLANS.find((p) => p.key === planKey)?.name ?? planKey;
      if (json.isUpgrade) {
        setSuccess(`✓ Upgraded to ${planName} successfully!`);
      } else {
        setSuccess(`✓ Downgrade to ${planName} scheduled for your next billing date.`);
      }
      setLoading(null);
      setTimeout(() => { onPlanChanged(planKey); onClose(); }, 2200);
    } catch { setError("Network error. Please try again."); setLoading(null); }
  };

  // ── Confirm step ────────────────────────────────────────────────────
  if (confirmKey) {
    const confirmPlan = PLANS.find((p) => p.key === confirmKey)!;
    // Use tier index — not price — so test-mode price overrides don't flip upgrade/downgrade labels
    const TIER: Record<string, number> = { solo: 1, growing: 2, scale: 3 };
    const isUpgrade = (TIER[confirmPlan.key] ?? 0) > (TIER[currentPlan ?? ""] ?? 0);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
        onClick={(e) => e.target === e.currentTarget && setConfirmKey(null)}>
        <div className="relative w-full max-w-sm rounded-2xl p-7 shadow-2xl"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-5"
            style={{ background: "rgba(201,123,58,0.15)", color: "var(--brand)" }}>
            {confirmPlan.icon}
          </div>
          <h2 className="text-xl font-black text-center mb-2" style={{ color: "var(--foreground)" }}>
            {isUpgrade ? `Upgrade to ${confirmPlan.name}?` : `Downgrade to ${confirmPlan.name}?`}
          </h2>
          <p className="text-sm text-center mb-1" style={{ color: "var(--text-sub)" }}>
            You&apos;ll be switched to <strong>{confirmPlan.name}</strong> at <strong>{confirmPlan.price}/mo</strong>
            {isUpgrade ? " immediately" : " at the end of your current billing period"}.
          </p>
          <p className="text-xs text-center mb-6" style={{ color: "var(--text-muted)" }}>
            {isUpgrade
              ? "The difference will be charged pro-rata for the rest of this billing period."
              : "You keep full access to your current plan until the billing period ends. No charges — just a plan switch."}
          </p>
          {error && <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>{error}</p>}
          <div className="flex flex-col gap-3">
            <button onClick={() => doChangePlan(confirmKey)} disabled={!!loading}
              className="w-full rounded-xl py-3 text-sm font-bold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              style={{ background: "var(--brand)", color: "#fff" }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Switching…</> : isUpgrade ? `Yes, upgrade to ${confirmPlan.name}` : `Yes, schedule downgrade to ${confirmPlan.name}`}
            </button>
            <button onClick={() => setConfirmKey(null)}
              className="w-full rounded-xl py-3 text-sm font-semibold hover:opacity-70 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "var(--text-sub)" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-2xl rounded-2xl p-7 shadow-2xl my-8"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-white/10">
          <X className="w-4 h-4" style={{ color: "var(--muted)" }} />
        </button>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>Change your plan</h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>
          {isActivePaidSub
            ? "Switch takes effect immediately — prorated billing applied automatically."
            : "Select a plan to start your subscription."}
        </p>

        {error && <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>{error}</p>}
        {success && <p className="text-sm rounded-lg px-3 py-2 mb-4 font-medium" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>{success}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.key === currentPlan;
            const isLoading = loading === plan.key;
            // Use tier index (not price) for upgrade/downgrade label — immune to test-mode price overrides
            const TIER: Record<string, number> = { solo: 1, growing: 2, scale: 3 };
            const planTier = TIER[plan.key] ?? 0;
            const currentTier = TIER[currentPlan ?? ""] ?? 0;
            const label = isCurrent
              ? "Current plan"
              : isActivePaidSub
                ? planTier > currentTier ? `Upgrade to ${plan.name}` : `Downgrade to ${plan.name}`
                : `Start with ${plan.name}`;
            return (
              <div key={plan.key} className="rounded-xl p-5 flex flex-col"
                style={{
                  background: plan.highlight ? "rgba(201,123,58,0.08)" : "rgba(255,255,255,0.03)",
                  border: isCurrent ? "2px solid var(--brand)" : plan.highlight ? "1px solid rgba(201,123,58,0.4)" : "1px solid var(--card-border)",
                }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: plan.highlight ? "var(--brand)" : "var(--text-sub)" }}>{plan.icon}</span>
                  <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{plan.name}</span>
                  {isCurrent && <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--brand)", color: "#fff" }}>Current</span>}
                </div>
                <div className="text-2xl font-black mb-1" style={{ color: "var(--foreground)" }}>{plan.price}<span className="text-xs font-normal ml-0.5" style={{ color: "var(--text-sub)" }}>/mo</span></div>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>{plan.branches}</p>
                <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs" style={{ color: "var(--text-sub)" }}>
                      <Check className="w-3 h-3 mt-0.5 shrink-0" style={{ color: plan.highlight ? "var(--brand)" : "rgba(255,255,255,0.3)" }} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleSelect(plan.key)} disabled={isCurrent || !!loading}
                  className="w-full rounded-lg py-2.5 text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  style={isCurrent
                    ? { background: "rgba(201,123,58,0.15)", color: "var(--brand)" }
                    : { background: plan.highlight ? "var(--brand)" : "rgba(255,255,255,0.07)", color: plan.highlight ? "#fff" : "var(--foreground)", border: plan.highlight ? "none" : "1px solid var(--card-border)" }}>
                  {isLoading ? <><Loader2 className="w-3 h-3 animate-spin" />Switching…</> : label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Account page ────────────────────────────────────────────────────
interface Business {
  id: string;
  name: string;
  subscription_status: string;
  subscription_plan: string | null;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  verification_status: string;
}

interface StripeData {
  customerId: string | null;
  activePlan: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: number | null;
  pendingPlan: string | null;
  pendingPlanDate: string | null;
}

export default function AccountPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [stripeData, setStripeData] = useState<StripeData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [cancelingSchedule, setCancelingSchedule] = useState(false);
  const [cancelScheduleError, setCancelScheduleError] = useState<string | null>(null);

  // Restore session from Supabase on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAccessToken(data.session.access_token);
        setUserEmail(data.session.user.email ?? null);
      }
    });
  }, []);

  // Load business data via the secure /api/subscription route
  useEffect(() => {
    if (!accessToken) return;
    setFetchError(null);
    queueMicrotask(() => setLoadingData(true));
    fetch("/api/subscription", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (r) => {
        const json = await r.json();
        if (r.status === 401) {
          await supabase.auth.signOut();
          setAccessToken(null);
          setUserEmail(null);
          setBusiness(null);
          setStripeData(null);
          return;
        }
        if (!r.ok) {
          setFetchError(json.error ?? "Could not load account data.");
          setBusiness(null);
          setStripeData(null);
          return;
        }
        if (json.business) {
          setBusiness({
            id: json.business.id,
            name: json.business.name,
            subscription_status: json.business.subscriptionStatus,
            subscription_plan: json.business.subscriptionPlan ?? null,
            trial_ends_at: json.business.trialEndsAt,
            stripe_customer_id: json.stripe?.customerId ?? null,
            verification_status: json.business.verificationStatus ?? "pending",
          });
        } else {
          setBusiness(null);
        }
        setStripeData(json.stripe ?? null);
      })
      .catch(() => setFetchError("Network error. Please try again."))
      .finally(() => setLoadingData(false));
  }, [accessToken]);

  // Stripe-first derived state
  const stripeStatus = stripeData?.subscriptionStatus ?? null;
  const stripePlan = stripeData?.activePlan ?? null;
  const hasActivePaidSub = !!stripeData?.customerId && ["active", "trialing", "past_due"].includes(stripeStatus ?? "");

  const handleSignInSuccess = (token: string, email: string) => {
    setFetchError(null);
    setBusiness(null);
    setStripeData(null);
    setAccessToken(token);
    setUserEmail(email);
    setShowSignIn(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAccessToken(null);
    setUserEmail(null);
    setBusiness(null);
  };

  const handleBillingPortal = async () => {
    if (!accessToken) return;
    setPortalLoading(true); setPortalError(null);
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json();
      if (!res.ok) { setPortalError(json.error ?? "Could not open billing portal."); setPortalLoading(false); return; }
      window.location.assign(json.url);
    } catch { setPortalError("Network error. Please try again."); setPortalLoading(false); }
  };

  const handleCancelSchedule = async () => {
    if (!accessToken) return;
    setCancelingSchedule(true); setCancelScheduleError(null);
    try {
      const res = await fetch("/api/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ cancelSchedule: true }),
      });
      const json = await res.json();
      if (!res.ok) { setCancelScheduleError(json.error ?? "Could not cancel downgrade."); setCancelingSchedule(false); return; }
      // Refresh — clear pending state
      setStripeData((s) => s ? { ...s, pendingPlan: null, pendingPlanDate: null } : s);
    } catch { setCancelScheduleError("Network error. Please try again."); }
    setCancelingSchedule(false);
  };

  const planLabel = (status: string) => {
    if (status === "trial") return "Free Trial";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const trialDaysLeft = (endsAt: string | null, nowMs: number) => {
    if (!endsAt) return null;
    const diff = Math.ceil((new Date(endsAt).getTime() - nowMs) / 86400000);
    return diff > 0 ? diff : 0;
  };

  // Avoid calling Date.now() during render (react-hooks/purity) and avoid setState in effects.
  const nowMs = useMemo(() => new Date().getTime(), []);

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Nav */}
      <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4"
        style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--nav-border)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="font-black text-sm tracking-[0.15em] uppercase" style={{ color: "var(--foreground)" }}>clientIn</Link>
        {accessToken ? (
          <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--text-sub)" }}>
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        ) : (
          <button onClick={() => setShowSignIn(true)} className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--text-sub)" }}>
            Sign in
          </button>
        )}
      </div>

      <div className="pt-28 pb-20 px-5 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-2">My Account</h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-sub)" }}>
          {userEmail ?? "Sign in to manage your subscription."}
        </p>

        {/* Not signed in */}
        {!accessToken && (
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <AlertCircle className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--brand)" }} />
            <h2 className="text-lg font-bold mb-2">You&apos;re not signed in</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>Sign in with your email to view your plan and billing.</p>
            <button onClick={() => setShowSignIn(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
              style={{ background: "var(--brand)", color: "#fff" }}>
              Sign in →
            </button>
          </div>
        )}

        {/* Loading */}
        {accessToken && loadingData && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--brand)" }} />
          </div>
        )}

        {/* Pending approval */}
        {accessToken && !loadingData && business && business.verification_status !== "approved" && (
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-5"
              style={{ background: "rgba(234,179,8,0.12)" }}>
              <AlertCircle className="w-7 h-7" style={{ color: "#facc15" }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Account Pending Approval</h2>
            <p className="text-sm mb-2" style={{ color: "var(--text-sub)" }}>
              Your business <strong>{business.name}</strong> is currently being reviewed.
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>
              You&apos;ll be able to manage your account once your business has been approved. This usually takes less than 24 hours.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: "rgba(234,179,8,0.1)", color: "#facc15", border: "1px solid rgba(234,179,8,0.25)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#facc15" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#facc15" }} />
              </span>
              Pending review
            </div>
            <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
              Signed in as: <strong>{userEmail}</strong>
            </p>
          </div>
        )}

        {/* Signed in + approved */}
        {accessToken && !loadingData && business && business.verification_status === "approved" && (
          <div className="flex flex-col gap-5">

            {/* API error banner — only shown when signed in */}
            {fetchError && (
              <div className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#f87171" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#f87171" }}>{fetchError}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(248,113,113,0.7)" }}>
                    Signed in as: <strong>{userEmail}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Subscription card */}
            <div className="rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Subscription</p>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{business.name}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(201,123,58,0.15)", color: "var(--brand)" }}>
                    {(stripePlan ?? business.subscription_plan)
                      ? `${(stripePlan ?? business.subscription_plan)!.charAt(0).toUpperCase() + (stripePlan ?? business.subscription_plan)!.slice(1)} plan`
                      : planLabel(stripeStatus ?? business.subscription_status)}
                  </span>
                </div>
                {/* Show trial countdown: use Stripe status as truth; fall back to DB status for legacy rows */}
                {(stripeStatus === "trialing" || (!stripeStatus && (business.subscription_status === "trial" || business.subscription_status === "trialing"))) && business.trial_ends_at && (
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-black" style={{ color: "var(--foreground)" }}>{trialDaysLeft(business.trial_ends_at, nowMs)}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>days left in trial</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowUpgrade(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold hover:opacity-90 transition-all"
                  style={{ background: "var(--brand)", color: "#fff" }}>
                  Change plan <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={handleBillingPortal} disabled={portalLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold hover:opacity-80 transition-all disabled:opacity-60"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--card-border)", color: "var(--text-sub)" }}>
                  {portalLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Loading…</> : <><CreditCard className="w-4 h-4" />Manage billing</>}
                </button>
              </div>

              {portalError && (
                <p className="mt-3 text-xs rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>{portalError}</p>
              )}

              {/* Pending downgrade banner */}
              {stripeData?.pendingPlan && (
                <div className="mt-4 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2"
                  style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)" }}>
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: "#facc15" }}>
                      Scheduled downgrade to{" "}
                      <span className="capitalize">{stripeData.pendingPlan}</span>
                      {stripeData.pendingPlanDate && (
                        <> on {new Date(stripeData.pendingPlanDate).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" })}</>
                      )}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(250,204,21,0.7)" }}>
                      Your current plan stays active until then. Cancel to keep it.
                    </p>
                  </div>
                  <button
                    onClick={handleCancelSchedule}
                    disabled={cancelingSchedule}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60 transition-all hover:opacity-90"
                    style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.3)", color: "#facc15" }}>
                    {cancelingSchedule ? <><Loader2 className="w-3 h-3 animate-spin" />Canceling…</> : "Cancel downgrade"}
                  </button>
                  {cancelScheduleError && (
                    <p className="text-xs mt-1 w-full" style={{ color: "#f87171" }}>{cancelScheduleError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Account details card */}
            <div className="rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Account</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Email</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: "var(--foreground)" }}>{userEmail}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Modals */}
      {showSignIn && <SignInModal onSuccess={handleSignInSuccess} onClose={() => setShowSignIn(false)} />}
      {showUpgrade && accessToken && (
      <UpgradeModal
          accessToken={accessToken}
          currentPlan={stripePlan}
          isActivePaidSub={hasActivePaidSub}
          businessName={business?.name ?? ""}
          onClose={() => setShowUpgrade(false)}
          onPlanChanged={(newPlan) => setStripeData((s) => (s ? { ...s, activePlan: newPlan, pendingPlan: null, pendingPlanDate: null } : s))}
        />
      )}
    </div>
  );
}

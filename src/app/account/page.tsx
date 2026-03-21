"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Check, Zap, Star, Rocket, X, Loader2, ArrowLeft,
  RefreshCw, CreditCard, LogOut, ChevronRight, AlertCircle,
} from "lucide-react";

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
    branches: "1 branch",
    icon: <Zap className="w-4 h-4" />,
    highlight: false,
    features: ["Dashboard analytics", "Loyalty programs", "QR scanner", "Staff management", "Send offers"],
  },
  {
    key: "growing",
    name: "Growing",
    price: "€59",
    branches: "Up to 4 branches",
    icon: <Star className="w-4 h-4" />,
    highlight: true,
    badge: "Most Popular",
    features: ["Everything in Solo", "Full Customer Insights suite", "Monthly visit comparison", "Visit trend chart", "At-risk customer alerts", "Active / new / repeat breakdown"],
  },
  {
    key: "scale",
    name: "Scale",
    price: "€89",
    branches: "Unlimited branches",
    icon: <Rocket className="w-4 h-4" />,
    highlight: false,
    features: ["Everything in Growing", "Priority support"],
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
    const { error } = await supabase.auth.signInWithOtp({ email: target, options: { shouldCreateUser: false } });
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
            <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>Enter your email and we'll send a code.</p>
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
function UpgradeModal({ accessToken, currentPlan, onClose }: {
  accessToken: string; currentPlan: string; onClose: () => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (planKey: string) => {
    if (planKey === currentPlan) return;
    setLoading(planKey); setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ businessName: "", plan: planKey }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Something went wrong."); setLoading(null); return; }
      window.location.href = json.url;
    } catch { setError("Network error. Please try again."); setLoading(null); }
  };

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
        <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>Select a new plan to switch to.</p>

        {error && <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.key === currentPlan;
            const isLoading = loading === plan.key;
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
                  {isLoading ? <><Loader2 className="w-3 h-3 animate-spin" />Redirecting…</> : isCurrent ? "Current plan" : `Switch to ${plan.name}`}
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
  trial_ends_at: string | null;
}

export default function AccountPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Restore session from Supabase on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAccessToken(data.session.access_token);
        setUserEmail(data.session.user.email ?? null);
      }
    });
  }, []);

  // Load business data once we have a token
  useEffect(() => {
    if (!accessToken) return;
    setLoadingData(true);
    supabase.auth.getUser(accessToken).then(async ({ data }) => {
      if (!data.user) return;
      const { data: biz } = await supabase
        .from("businesses")
        .select("id, name, subscription_status, trial_ends_at")
        .eq("owner_id", data.user.id)
        .maybeSingle();
      setBusiness(biz ?? null);
      setLoadingData(false);
    });
  }, [accessToken]);

  const handleSignInSuccess = (token: string, email: string) => {
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
      window.location.href = json.url;
    } catch { setPortalError("Network error. Please try again."); setPortalLoading(false); }
  };

  const planLabel = (status: string) => {
    if (status === "trial") return "Free Trial";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const trialDaysLeft = (endsAt: string | null) => {
    if (!endsAt) return null;
    const diff = Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Nav */}
      <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4"
        style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--nav-border)", backdropFilter: "blur(12px)" }}>
        <a href="/" className="font-black text-sm tracking-[0.15em] uppercase" style={{ color: "var(--foreground)" }}>clientIn</a>
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
            <h2 className="text-lg font-bold mb-2">You're not signed in</h2>
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

        {/* Signed in */}
        {accessToken && !loadingData && (
          <div className="flex flex-col gap-5">

            {/* Subscription card */}
            <div className="rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Subscription</p>
              {business ? (
                <>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{business.name}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: "rgba(201,123,58,0.15)", color: "var(--brand)" }}>
                        {planLabel(business.subscription_status)}
                      </span>
                    </div>
                    {business.trial_ends_at && (
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-black" style={{ color: "var(--foreground)" }}>{trialDaysLeft(business.trial_ends_at)}</p>
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
                </>
              ) : (
                <div>
                  <p className="text-sm mb-5" style={{ color: "var(--text-sub)" }}>You don't have an active subscription yet.</p>
                  <a href="/subscribe"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                    style={{ background: "var(--brand)", color: "#fff" }}>
                    View plans →
                  </a>
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
          currentPlan={business?.subscription_status ?? ""}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}

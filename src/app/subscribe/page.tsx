"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Check, Zap, Star, Rocket, X, Loader2, ArrowLeft, RefreshCw } from "lucide-react";

// ─── Supabase browser client (anon key — safe to expose) ────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Plan definitions ───────────────────────────────────────────────
type PlanKey = "solo" | "growing" | "scale";

interface Plan {
  key: PlanKey;
  name: string;
  price: string;
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
    branches: "Unlimited branches",
    icon: <Rocket className="w-5 h-5" />,
    highlight: false,
    features: [
      "Everything in Growing",
      "Priority support",
    ],
  },
];

// ─── OTP input (6 boxes) ────────────────────────────────────────────
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

  // Build a fixed-length array of digits from the value string
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  const focus = (i: number) => inputRefs.current[i]?.focus();

  const handleChange = (i: number, raw: string) => {
    // Strip non-digits; support paste of up to OTP_LENGTH chars from this box onward
    const cleaned = raw.replace(/\D/g, "").slice(0, OTP_LENGTH - i);
    if (!cleaned) return;

    const next = [...digits];
    for (let j = 0; j < cleaned.length; j++) {
      next[i + j] = cleaned[j];
    }

    onChange(next.join(""));

    // Advance focus to the next unfilled box (or stay on last)
    const nextFocus = Math.min(i + cleaned.length, OTP_LENGTH - 1);
    focus(nextFocus);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (digits[i]) {
        next[i] = "";
        onChange(next.join(""));
      } else if (i > 0) {
        next[i - 1] = "";
        onChange(next.join(""));
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focus(i - 1);
    } else if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) {
      focus(i + 1);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center my-2">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={OTP_LENGTH} // allow paste
          autoComplete={i === 0 ? "one-time-code" : "off"}
          value={digits[i] ?? ""}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className="w-11 h-14 rounded-xl text-center text-xl font-bold outline-none transition-all disabled:opacity-50"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: digits[i]
              ? "1.5px solid var(--brand)"
              : "1px solid var(--card-border)",
            color: "var(--foreground)",
            caretColor: "var(--brand)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Resend timer ────────────────────────────────────────────────────
const RESEND_COOLDOWN = 30; // seconds

function ResendButton({
  onResend,
  disabled,
}: {
  onResend: () => void;
  disabled: boolean;
}) {
  const [seconds, setSeconds] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const canResend = seconds <= 0 && !disabled;

  const handleClick = () => {
    if (!canResend) return;
    setSeconds(RESEND_COOLDOWN);
    onResend();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canResend}
      className="flex items-center gap-1.5 text-xs font-medium transition-opacity disabled:opacity-40"
      style={{ color: canResend ? "var(--brand)" : "var(--text-muted)" }}
    >
      <RefreshCw className="w-3 h-3" />
      {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
    </button>
  );
}

// ─── Inline input style helpers ──────────────────────────────────────
const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--card-border)",
  color: "var(--foreground)",
};

function focusBrand(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.border = "1px solid var(--brand)";
}
function blurBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.border = "1px solid var(--card-border)";
}

// ─── Multi-step trial modal ──────────────────────────────────────────
type Step = "details" | "otp" | "loading";

interface TrialFormProps {
  plan: Plan;
  onClose: () => void;
}

function TrialForm({ plan, onClose }: TrialFormProps) {
  const [step, setStep] = useState<Step>("details");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Step 1: send OTP (called directly from browser — no server round-trip needed) ──
  const sendOtp = useCallback(async (targetEmail: string) => {
    setSendingOtp(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: { shouldCreateUser: true },
    });

    setSendingOtp(false);

    if (error) {
      setError(error.message ?? "Failed to send code. Please try again.");
      return false;
    }
    return true;
  }, []);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendOtp(email);
    if (ok) setStep("otp");
  };

  // ── Step 2: verify OTP ───────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setVerifying(true);
    setError(null);

    const { data, error: verifyErr } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (verifyErr || !data.session) {
      setVerifying(false);
      setError(verifyErr?.message ?? "Incorrect code. Please try again.");
      return;
    }

    // OTP verified — now call our backend with the access token
    setStep("loading");
    const accessToken = data.session.access_token;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ businessName, plan: plan.key }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStep("otp");
        setVerifying(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = json.url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("otp");
      setVerifying(false);
    }
  };

  // ── Shared backdrop + card wrapper ───────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-7 shadow-2xl"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 transition-colors hover:bg-white/10"
          aria-label="Close"
        >
          <X className="w-4 h-4" style={{ color: "var(--muted)" }} />
        </button>

        {/* Plan badge */}
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: "rgba(201,123,58,0.15)", color: "var(--brand)" }}
        >
          {plan.icon}
          {plan.name} Plan — {plan.price}/mo
        </span>

        {/* ── STEP 1: business details ─────────────────────────────── */}
        {step === "details" && (
          <>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Start your 30-day free trial
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>
              No credit card required. We'll send a one-time code to verify your email.
            </p>

            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="businessName"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-sub)" }}
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  required
                  placeholder="e.g. The Coffee Corner"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={inputBase}
                  onFocus={focusBrand}
                  onBlur={blurBorder}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ownerEmail"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-sub)" }}
                >
                  Email Address
                </label>
                <input
                  id="ownerEmail"
                  type="email"
                  required
                  placeholder="you@yourbusiness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={inputBase}
                  onFocus={focusBrand}
                  onBlur={blurBorder}
                />
              </div>

              {error && <ErrorBanner message={error} />}

              <button
                type="submit"
                disabled={sendingOtp}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                {sendingOtp ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending code…</>
                ) : (
                  "Continue →"
                )}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP verification ─────────────────────────────── */}
        {(step === "otp" || step === "loading") && (
          <>
            {/* Back button */}
            {step === "otp" && (
              <button
                type="button"
                onClick={() => { setStep("details"); setOtp(""); setError(null); }}
                className="flex items-center gap-1.5 text-xs font-medium mb-4 transition-opacity hover:opacity-70"
                style={{ color: "var(--text-sub)" }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}

            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Check your email
            </h2>
            <p className="text-sm mb-1" style={{ color: "var(--text-sub)" }}>
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold mb-6" style={{ color: "var(--brand)" }}>
              {email}
            </p>

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={verifying || step === "loading"}
              />

              {error && <ErrorBanner message={error} />}

              <button
                type="submit"
                disabled={otp.length < OTP_LENGTH || verifying || step === "loading"}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                {step === "loading" || verifying ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />
                    {step === "loading" ? "Setting up your trial…" : "Verifying…"}
                  </>
                ) : (
                  "Verify & Continue →"
                )}
              </button>

              <div className="flex justify-center">
                <ResendButton
                  onResend={() => sendOtp(email)}
                  disabled={sendingOtp || verifying || step === "loading"}
                />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Tiny error banner ───────────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <p
      className="text-sm rounded-lg px-3 py-2"
      style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
    >
      {message}
    </p>
  );
}

// ─── Plan card ───────────────────────────────────────────────────────
function PlanCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}) {
  return (
    <div
      className="relative flex flex-col rounded-2xl p-7 transition-transform hover:-translate-y-1"
      style={{
        background: plan.highlight
          ? "linear-gradient(135deg, rgba(201,123,58,0.12) 0%, rgba(201,123,58,0.04) 100%)"
          : "var(--card-bg)",
        border: plan.highlight
          ? "1px solid rgba(201,123,58,0.45)"
          : "1px solid var(--card-border)",
        boxShadow: plan.highlight ? "0 0 40px rgba(201,123,58,0.1)" : "none",
      }}
    >
      {plan.badge && (
        <span
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          {plan.badge}
        </span>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: plan.highlight
              ? "rgba(201,123,58,0.2)"
              : "rgba(255,255,255,0.06)",
            color: plan.highlight ? "var(--brand)" : "var(--text-sub)",
          }}
        >
          {plan.icon}
        </span>
        <span className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
          {plan.name}
        </span>
      </div>

      <div className="mb-1">
        <span className="text-4xl font-black" style={{ color: "var(--foreground)" }}>
          {plan.price}
        </span>
        <span className="text-sm ml-1" style={{ color: "var(--text-sub)" }}>/mo</span>
      </div>
      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        {plan.branches}
      </p>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-sm"
            style={{ color: "var(--text-sub)" }}
          >
            <Check
              className="w-4 h-4 mt-0.5 shrink-0"
              style={{
                color: plan.highlight ? "var(--brand)" : "rgba(255,255,255,0.4)",
              }}
            />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className="w-full rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90 active:scale-[0.98]"
        style={
          plan.highlight
            ? { background: "var(--brand)", color: "#fff" }
            : {
                background: "rgba(255,255,255,0.06)",
                color: "var(--foreground)",
                border: "1px solid var(--card-border)",
              }
        }
      >
        Start free trial
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

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

      {/* Hero */}
      <section className="pt-32 pb-16 px-5 text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-5"
          style={{ background: "rgba(201,123,58,0.15)", color: "var(--brand)" }}
        >
          Simple, transparent pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
          Choose your plan
        </h1>
        <p className="max-w-xl mx-auto text-base" style={{ color: "var(--text-sub)" }}>
          Start with a 30-day free trial on any plan. No credit card required.
          Cancel anytime, no lock-in.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {["30-day free trial", "Cancel anytime", "No lock-in"].map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--card-border)",
                color: "var(--text-sub)",
              }}
            >
              <Check className="w-3 h-3" style={{ color: "var(--brand)" }} />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Plan cards */}
      <section className="max-w-5xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} onSelect={setSelectedPlan} />
          ))}
        </div>

        <p className="text-center mt-12 text-sm" style={{ color: "var(--text-muted)" }}>
          Questions?{" "}
          <a
            href="mailto:hello@clientin.co"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "var(--brand)" }}
          >
            hello@clientin.co
          </a>
        </p>
      </section>

      {/* Modal */}
      {selectedPlan && (
        <TrialForm plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
}



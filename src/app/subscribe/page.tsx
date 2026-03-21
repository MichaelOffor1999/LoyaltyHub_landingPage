"use client";

import { useState } from "react";
import { Check, Zap, Star, Rocket, X, Loader2 } from "lucide-react";

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

// ─── Inline form / modal ─────────────────────────────────────────────
interface FormState {
  businessName: string;
  ownerEmail: string;
}

function TrialForm({
  plan,
  onClose,
}: {
  plan: Plan;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    businessName: "",
    ownerEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan: plan.key }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
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
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 transition-colors hover:bg-white/10"
          aria-label="Close"
        >
          <X className="w-4 h-4" style={{ color: "var(--muted)" }} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: "rgba(201,123,58,0.15)", color: "var(--brand)" }}
          >
            {plan.icon}
            {plan.name} Plan — {plan.price}/mo
          </span>
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Start your 30-day free trial
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-sub)" }}>
            No credit card required to start. Cancel anytime.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              name="businessName"
              type="text"
              required
              placeholder="e.g. The Coffee Corner"
              value={form.businessName}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--card-border)",
                color: "var(--foreground)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.border = "1px solid var(--brand)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.border = "1px solid var(--card-border)")
              }
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
            <p className="text-xs -mt-0.5" style={{ color: "var(--text-muted)" }}>
              Use the same email you signed up with on clientIn.
            </p>
            <input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              required
              placeholder="you@yourbusiness.com"
              value={form.ownerEmail}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--card-border)",
                color: "var(--foreground)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.border = "1px solid var(--brand)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.border = "1px solid var(--card-border)")
              }
            />
          </div>

          {error && (
            <p className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--brand)", color: "#fff" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up your trial…
              </>
            ) : (
              "Start Free Trial →"
            )}
          </button>
        </form>
      </div>
    </div>
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
        boxShadow: plan.highlight
          ? "0 0 40px rgba(201,123,58,0.1)"
          : "none",
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <span
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          {plan.badge}
        </span>
      )}

      {/* Plan icon + name */}
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
        <span
          className="text-lg font-bold"
          style={{ color: "var(--foreground)" }}
        >
          {plan.name}
        </span>
      </div>

      {/* Price */}
      <div className="mb-1">
        <span
          className="text-4xl font-black"
          style={{ color: "var(--foreground)" }}
        >
          {plan.price}
        </span>
        <span className="text-sm ml-1" style={{ color: "var(--text-sub)" }}>
          /mo
        </span>
      </div>
      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        {plan.branches}
      </p>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-sub)" }}>
            <Check
              className="w-4 h-4 mt-0.5 shrink-0"
              style={{ color: plan.highlight ? "var(--brand)" : "rgba(255,255,255,0.4)" }}
            />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
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
      <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4"
        style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--nav-border)", backdropFilter: "blur(12px)" }}
      >
        <a href="/" className="font-black text-sm sm:text-base tracking-[0.15em] uppercase" style={{ color: "var(--foreground)" }}>
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

        {/* Trust pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {["30-day free trial", "Cancel anytime", "No lock-in"].map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "var(--text-sub)" }}
            >
              <Check className="w-3 h-3" style={{ color: "var(--brand)" }} />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Plan cards grid */}
      <section className="max-w-5xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} onSelect={setSelectedPlan} />
          ))}
        </div>

        {/* FAQ nudge */}
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

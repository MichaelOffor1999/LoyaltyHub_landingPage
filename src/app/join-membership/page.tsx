"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Loader2, AlertCircle, Repeat } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PlanDetails {
  id: string;
  name: string;
  price_cents: number;
  currency: string;
  membership_plan_services: Array<{ quantity_per_cycle: number; services: { name: string } }>;
}

function money(cents: number, currency = "eur") {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

// The customer arrives here already authenticated — logged into the mobile
// app — so unlike /subscribe there's no OTP step. The mobile app hands off
// the Supabase access_token via the URL *fragment* (never sent to a server,
// unlike a query param), the same pattern the app's own OAuth callback uses.
function JoinMembershipContent() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const planId = searchParams.get("planId");

  const [plan, setPlan] = useState<PlanDetails | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  // Pull the access_token out of the URL fragment and establish the session.
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const hp = new URLSearchParams(hash.replace(/^#/, ""));
    const accessToken = hp.get("access_token");
    const refreshToken = hp.get("refresh_token") ?? "";

    if (!accessToken) {
      setError("Missing session — please open this link from the ClientIn app.");
      setLoading(false);
      return;
    }

    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error: sessErr }) => {
      if (sessErr) {
        setError("Your session has expired — please try again from the app.");
        setLoading(false);
        return;
      }
      setAuthed(true);
      // Scrub the token out of the visible URL/history once it's been used.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    });
  }, []);

  useEffect(() => {
    if (!businessId || !planId) {
      setError("Missing business or plan.");
      setLoading(false);
      return;
    }
    (async () => {
      const { data: planData, error: planErr } = await supabase
        .from("membership_plans")
        .select("id, name, price_cents, currency, membership_plan_services(quantity_per_cycle, services(name))")
        .eq("id", planId)
        .eq("active", true)
        .single();
      if (planErr || !planData) {
        setError("This membership plan is no longer available.");
        setLoading(false);
        return;
      }
      setPlan(planData as unknown as PlanDetails);

      const { data: biz } = await supabase.from("businesses").select("name").eq("id", businessId).maybeSingle();
      setBusinessName(biz?.name ?? "");
      setLoading(false);
    })();
  }, [businessId, planId]);

  const handleJoin = async () => {
    if (!plan || !businessId) return;
    setJoining(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Your session has expired — please try again from the app.");

      const res = await fetch("/api/join-membership", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ businessId, planId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Could not start checkout.");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-sans"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--brand)" }} />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 font-sans text-center"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <div className="max-w-sm w-full">
          <AlertCircle className="w-10 h-10 mx-auto mb-4 text-red-500" />
          <p className="font-bold mb-1">Can&apos;t open this membership</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{error ?? "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 font-sans"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div
        className="card max-w-sm w-full rounded-2xl p-6"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "rgba(201,123,58,0.12)" }}
        >
          <Repeat className="w-6 h-6" style={{ color: "var(--brand)" }} />
        </div>
        <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>{businessName}</p>
        <h1 className="text-xl font-bold mb-1">{plan.name}</h1>
        <p className="text-2xl font-black mb-4" style={{ color: "var(--brand)" }}>
          {money(plan.price_cents, plan.currency)}
          <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>/month</span>
        </p>

        <div className="pt-4 mb-6 space-y-1" style={{ borderTop: "1px solid var(--card-border)" }}>
          {plan.membership_plan_services?.map((ps, i) => (
            <p key={i} className="text-sm" style={{ color: "var(--text-sub)" }}>
              {ps.quantity_per_cycle}x {ps.services?.name} / month
            </p>
          ))}
        </div>

        <button
          onClick={handleJoin}
          disabled={joining || !authed}
          className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue to Payment"}
        </button>
        <p className="text-xs text-center mt-3" style={{ color: "var(--text-muted)" }}>
          Recurring monthly charge · Non-refundable · Cancel anytime in the app
        </p>
      </div>
    </div>
  );
}

export default function JoinMembershipPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--background)" }} />}>
      <JoinMembershipContent />
    </Suspense>
  );
}

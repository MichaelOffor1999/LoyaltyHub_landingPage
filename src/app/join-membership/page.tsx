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
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-6">
        <div className="max-w-sm w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-white font-semibold mb-1">Can&apos;t open this membership</p>
          <p className="text-gray-400 text-sm">{error ?? "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-6">
      <div className="max-w-sm w-full bg-[#171717] border border-white/10 rounded-2xl p-6">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
          <Repeat className="w-6 h-6 text-primary" />
        </div>
        <p className="text-gray-400 text-sm mb-1">{businessName}</p>
        <h1 className="text-xl font-bold text-white mb-1">{plan.name}</h1>
        <p className="text-2xl font-bold text-primary mb-4">
          {money(plan.price_cents, plan.currency)}
          <span className="text-sm text-gray-500 font-normal">/month</span>
        </p>

        <div className="border-t border-white/10 pt-4 mb-6 space-y-1">
          {plan.membership_plan_services?.map((ps, i) => (
            <p key={i} className="text-sm text-gray-300">
              {ps.quantity_per_cycle}x {ps.services?.name} / month
            </p>
          ))}
        </div>

        <button
          onClick={handleJoin}
          disabled={joining || !authed}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue to Payment"}
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          Recurring monthly charge · Non-refundable · Cancel anytime in the app
        </p>
      </div>
    </div>
  );
}

export default function JoinMembershipPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d]" />}>
      <JoinMembershipContent />
    </Suspense>
  );
}

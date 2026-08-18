"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Mirrors /subscribe/success's poll-with-sync-fallback pattern: ask the
// server to sync directly from the Checkout Session (covers a delayed
// webhook), then poll briefly before showing success regardless — the app
// itself will refetch membership status when the customer returns to it.
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setReady(true);
      return;
    }

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (token) {
        try {
          await fetch("/api/join-membership-sync", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ sessionId }),
          });
        } catch {
          // ignore — webhook will likely have already handled it
        }
      }
      setReady(true);
    })();
  }, [sessionId]);

  const returnToApp = () => {
    window.location.href = "loyaltyhub://membership-success";
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 font-sans text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {!ready ? (
        <>
          <Loader2 className="w-12 h-12 animate-spin mb-6" style={{ color: "var(--brand)" }} />
          <p className="text-lg font-bold mb-2">Confirming your membership…</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>This only takes a moment.</p>
        </>
      ) : (
        <>
          <div
            className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: "rgba(201,123,58,0.12)", border: "1px solid rgba(201,123,58,0.3)" }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: "var(--brand)" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">You&apos;re a member!</h1>
          <p className="max-w-md text-base mb-6" style={{ color: "var(--text-sub)" }}>
            Head back to the app to see your membership and remaining uses this cycle.
          </p>
          <button
            onClick={returnToApp}
            className="px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90"
            style={{ background: "var(--brand)", color: "#fff" }}
          >
            Return to App →
          </button>
        </>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 font-sans text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Loader2 className="w-12 h-12 animate-spin mb-6" style={{ color: "var(--brand)" }} />
      <p className="text-lg font-bold mb-2">Loading…</p>
    </div>
  );
}

export default function JoinMembershipSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}

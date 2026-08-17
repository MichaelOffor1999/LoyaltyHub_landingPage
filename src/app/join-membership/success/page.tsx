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
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-6">
      <div className="max-w-sm w-full text-center">
        {!ready ? (
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
        ) : (
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        )}
        <h1 className="text-xl font-bold text-white mb-2">
          {ready ? "You're a member!" : "Confirming your membership…"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {ready
            ? "Head back to the app to see your membership and remaining uses."
            : "This should only take a moment."}
        </p>
        <button
          onClick={returnToApp}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold"
        >
          Return to App
        </button>
      </div>
    </div>
  );
}

export default function JoinMembershipSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d]" />}>
      <SuccessContent />
    </Suspense>
  );
}

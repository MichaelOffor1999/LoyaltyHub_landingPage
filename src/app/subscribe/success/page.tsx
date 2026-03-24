"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Inner component that safely uses useSearchParams() inside a Suspense boundary.
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Poll /api/subscription until the plan is marked active (webhook has fired)
  // or until 15 s have elapsed (show success anyway — webhook may be slightly delayed).
  useEffect(() => {
    if (!sessionId) { setReady(true); return; }

    let attempts = 0;
    const MAX = 15; // 15 × 1 s = 15 s max wait

    const poll = async () => {
      attempts++;
      try {
        const { data: session } = await supabase.auth.getSession();
        const token = session?.session?.access_token;
        if (!token) { setReady(true); return; }

        // Safety-net: ask the server to sync from the Checkout Session.
        // This makes the UI update even if webhooks are delayed/misconfigured.
        if (attempts === 1) {
          try {
            await fetch("/api/checkout-sync", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ sessionId }),
            });
          } catch {
            // ignore — we'll still rely on webhook/polling
          }
        }

        const res = await fetch("/api/subscription", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        const status = json?.stripe?.subscriptionStatus ?? json?.business?.subscriptionStatus;
        if (["active", "trialing"].includes(status)) {
          setReady(true);
          return;
        }
      } catch {
        // network blip — keep polling
      }

      if (attempts >= MAX) {
        setTimedOut(true);
        setReady(true);
        return;
      }
      setTimeout(poll, 1000);
    };

    poll();
  }, [sessionId]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 font-sans text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {!ready ? (
        <>
          <Loader2
            className="w-12 h-12 animate-spin mb-6"
            style={{ color: "var(--brand)" }}
          />
          <p className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Activating your subscription…
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            This only takes a moment.
          </p>
        </>
      ) : (
        <>
          {/* Icon */}
          <div
            className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: "rgba(201,123,58,0.12)", border: "1px solid rgba(201,123,58,0.3)" }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: "var(--brand)" }} />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            You&apos;re all set!
          </h1>
          <p className="max-w-md text-base mb-2" style={{ color: "var(--text-sub)" }}>
            Your subscription is now active. Manage your plan, view invoices, and
            access your dashboard from your account page.
          </p>
          {timedOut && (
            <p className="max-w-md text-xs mb-6" style={{ color: "var(--text-muted)" }}>
              (It may take a few seconds to fully reflect in your account.)
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/subscribe"
              className="px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90"
              style={{ background: "var(--brand)", color: "#fff" }}
            >
              Manage My Plan →
            </Link>
            <Link
              href="/"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all hover:opacity-80"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--card-border)",
                color: "var(--foreground)",
              }}
            >
              Back to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// Spinner shown while the Suspense boundary resolves (useSearchParams SSR boundary).
function LoadingSpinner() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 font-sans text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Loader2 className="w-12 h-12 animate-spin mb-6" style={{ color: "var(--brand)" }} />
      <p className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>
        Loading…
      </p>
    </div>
  );
}

// Default export wraps the inner component so useSearchParams() is inside Suspense,
// which is required by Next.js App Router for static pre-rendering.
export default function SubscribeSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}

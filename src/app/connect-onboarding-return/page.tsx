"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Stripe's Account Link API requires a real https:// return_url/refresh_url —
// it rejects custom app schemes directly. This page exists purely as the
// real URL Stripe redirects to, which then immediately hands off back into
// the app via deep link — same pattern as /join-membership/success.
// Used for BOTH return_url and refresh_url; the app doesn't currently
// distinguish the two, it just re-syncs Connect status either way.
export default function ConnectOnboardingReturnPage() {
  useEffect(() => {
    window.location.href = "loyaltyhub://connect-onboarding-return";
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 font-sans text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Loader2 className="w-12 h-12 animate-spin mb-6" style={{ color: "var(--brand)" }} />
      <h1 className="text-lg font-bold mb-2">Returning to ClientIn…</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        If nothing happens automatically, tap below.
      </p>
      <a
        href="loyaltyhub://connect-onboarding-return"
        className="px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90"
        style={{ background: "var(--brand)", color: "#fff" }}
      >
        Return to App
      </a>
    </div>
  );
}

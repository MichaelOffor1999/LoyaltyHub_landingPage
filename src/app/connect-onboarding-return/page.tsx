"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Stripe's Account Link API requires a real https:// return_url/refresh_url —
// it rejects custom app schemes (loyaltyhub://...) outright. This page exists
// purely as the real URL Stripe redirects to, which then immediately hands
// off back into the app via deep link — same pattern as /join-membership/success.
// Used for BOTH return_url and refresh_url; the app doesn't currently
// distinguish the two, it just re-syncs Connect status either way.
export default function ConnectOnboardingReturnPage() {
  useEffect(() => {
    window.location.href = "loyaltyhub://connect-onboarding-return";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-6">
      <div className="max-w-sm w-full text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Returning to ClientIn…</h1>
        <p className="text-gray-400 text-sm mb-6">
          If nothing happens automatically, tap below.
        </p>
        <a
          href="loyaltyhub://connect-onboarding-return"
          className="inline-block w-full py-3 rounded-xl bg-primary text-white font-semibold"
        >
          Return to App
        </a>
      </div>
    </div>
  );
}

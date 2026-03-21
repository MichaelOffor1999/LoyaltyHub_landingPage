import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're in! — clientIn",
  description: "Your free trial has started. Welcome to clientIn.",
};

export default function SubscribeSuccessPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 font-sans text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{ background: "rgba(201,123,58,0.12)", border: "1px solid rgba(201,123,58,0.3)" }}
      >
        <CheckCircle className="w-10 h-10" style={{ color: "var(--brand)" }} />
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-black mb-4">
        You&apos;re all set! 🎉
      </h1>
      <p className="max-w-md text-base mb-8" style={{ color: "var(--text-sub)" }}>
        Your subscription is now active. Manage your plan, view invoices, and
        access your dashboard from your account page.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/account"
          className="px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          Go to My Account →
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
    </div>
  );
}

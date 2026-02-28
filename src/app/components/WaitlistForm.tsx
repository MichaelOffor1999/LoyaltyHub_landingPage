"use client";
import { useState } from "react";

export default function WaitlistForm({ large = false, light = false }: { large?: boolean; light?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "success" | "duplicate" | "error" | "loading">(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else if (res.status === 409) {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <div className="text-2xl font-bold" style={{ color: light ? "#fff" : "#c97b3a" }}>You are on the list!</div>
        <p style={{ color: light ? "rgba(255,255,255,0.8)" : "#6b7280" }}>We will be in touch when we launch.</p>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <div className="text-2xl font-bold" style={{ color: light ? "#fff" : "#c97b3a" }}>Already on the list!</div>
        <p style={{ color: light ? "rgba(255,255,255,0.8)" : "#6b7280" }}>You&apos;re already signed up — we&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row gap-3 w-full ${large ? "max-w-xl" : "max-w-md"} mx-auto mt-6`}
      >
        <input
          type="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl px-5 py-3.5 text-base font-medium focus:outline-none"
          style={light ? {
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(255,255,255,0.6)",
            color: "#111827",
          } : {
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.12)",
            color: "#111827",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="rounded-xl px-7 py-3.5 text-base font-bold transition-all hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
          style={light ? {
            background: "#fff",
            color: "#c97b3a",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          } : {
            background: "linear-gradient(135deg, #c97b3a, #e8944a)",
            color: "#fff",
            boxShadow: "0 0 20px 2px rgba(201,123,58,0.3)",
          }}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining..." : "Get Early Access"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2 text-center">Something went wrong. Try again.</p>
      )}
      <p className="text-center text-xs mt-3" style={{ color: light ? "rgba(255,255,255,0.7)" : "#9ca3af" }}>
         Early access members get 1 month free. No credit card required. No spam, ever.
      </p>
    </div>
  );
}

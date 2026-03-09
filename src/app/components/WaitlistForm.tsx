"use client";
import { useState } from "react";

export default function WaitlistForm({ large = false, light = false }: { large?: boolean; light?: boolean }) {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [status, setStatus] = useState<null | "success" | "duplicate" | "error" | "loading">(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const honeypot = (e.target as HTMLFormElement).querySelector<HTMLInputElement>("[name=website]");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, website: honeypot?.value || "" }),
    });
    if (res.ok) {
      setSubmittedEmail(email);
      setStatus("success");
      setEmail("");
    } else if (res.status === 409) {
      setSubmittedEmail(email);
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  if (status === "success" || status === "duplicate") {
    const isDupe = status === "duplicate";
    return (
      <div
        className="flex flex-col items-center py-4"
        style={{ animation: "card-enter 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Card container */}
        <div
          style={{
            width: "min(360px, 100%)",
            animation: "card-flip 0.85s 1.2s cubic-bezier(0.34,1.4,0.64,1) both",
          }}
        >
            <div
              style={{
                borderRadius: 18,
                background: "linear-gradient(135deg, #b86d2e 0%, #c97b3a 40%, #e8944a 75%, #f5a965 100%)",
                boxShadow: "0 16px 48px rgba(201,123,58,0.4), 0 2px 8px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                padding: "18px 20px",
                minHeight: 200,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circles */}
              <div style={{ position: "absolute", top: -36, right: -36, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 10, right: 30, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
              {/* Brand name + member email */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "0.04em" }}>clientIn</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.16em", marginTop: 2, textTransform: "uppercase" }}>Early Access</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 0, maxWidth: 180, overflow: "hidden" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 2 }}>Member</div>
                  <div style={{ color: "#fff", fontSize: 10.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{submittedEmail}</div>
                </div>
              </div>
              {/* YOU'RE IN — center of card */}
              <div style={{ textAlign: "center", margin: "auto 0" }}>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 26, letterSpacing: "-0.01em", textShadow: "0 2px 18px rgba(0,0,0,0.18)" }}>
                  {isDupe ? "Already in ✦" : "You're in ✦"}
                </div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>Founding Member</div>
              </div>
              {/* Stamp row */}
              <div style={{ marginTop: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "rgba(255,255,255,0.95)",
                      border: "2px solid rgba(255,255,255,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 900,
                      color: "#c97b3a",
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                ))}
                <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.55)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>5 / 5</div>
              </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-0 w-full ${large ? "max-w-xl" : "max-w-md"} mx-auto mt-6`}
      >
        {/* Honeypot — hidden from real users, bots auto-fill it */}
        <input
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
        />
        {light ? (
          /* ── Starlink-style: stacked with gap on mobile, inline on lg ── */
          <div className="flex flex-col lg:flex-row gap-3 w-full">
            <input
              type="email"
              required
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-4 text-sm font-semibold tracking-wide focus:outline-none rounded-md"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.22)",
                color: "#ffffff",
                letterSpacing: "0.12em",
              }}
              disabled={status === "loading"}
            />
            <button
              type="submit"
              className="px-8 py-4 text-sm font-black tracking-widest uppercase transition-all hover:bg-gray-100 disabled:opacity-60 whitespace-nowrap rounded-md"
              style={{
                background: "#ffffff",
                color: "#0a0a0a",
                letterSpacing: "0.12em",
              }}
              disabled={status === "loading"}
            >
              {status === "loading" ? "JOINING..." : "GET EARLY ACCESS"}
            </button>
          </div>
        ) : (
          /* ── Default inline layout ── */
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl px-5 py-3.5 text-base font-medium focus:outline-none"
              style={{
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
              style={{
                background: "linear-gradient(135deg, #c97b3a, #e8944a)",
                color: "#fff",
                boxShadow: "0 0 20px 2px rgba(201,123,58,0.3)",
              }}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Joining..." : "Get Early Access"}
            </button>
          </div>
        )}
      </form>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2 text-center">Something went wrong. Try again.</p>
      )}
      {light ? (
        <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.02em" }}>
          By clicking Get Early Access, you agree to our{" "}
          <a href="/privacy" className="underline" style={{ color: "rgba(255,255,255,0.65)" }}>Privacy Policy</a>
        </p>
      ) : (
        <p className="text-center text-xs mt-3" style={{ color: "#9ca3af" }}>
          Early access members get 1 month free. No credit card required. No spam, ever.
        </p>
      )}
    </div>
  );
}

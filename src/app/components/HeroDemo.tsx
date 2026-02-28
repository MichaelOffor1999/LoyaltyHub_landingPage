"use client";
import { useState, useEffect } from "react";

type Persona = "customer" | "business";

// ─── Customer screen steps ──────────────────────────────────────────────────

function CustomerStep0({ k }: { k: number }) {
  return (
    <div key={k} className="step-fade-up flex flex-col items-center justify-center h-full gap-3 px-5">
      <div
        style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg,#c97b3a,#e8944a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "checkPop 0.5s ease-out forwards",
          boxShadow: "0 0 24px rgba(232,148,74,0.45)",
        }}
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <path d="M8 16l6 6 10-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-xs font-semibold" style={{ color: "rgba(253,248,243,0.5)" }}>MTB Barbershop</p>
      <div style={{ animation: "ptsTick 0.45s 0.2s ease-out both" }}>
        <span className="text-5xl font-black" style={{ color: "#e8944a" }}>+10</span>
        <span className="text-2xl font-bold" style={{ color: "#e8944a" }}> pts</span>
      </div>
      <p className="text-sm font-medium" style={{ color: "rgba(253,248,243,0.6)" }}>Points earned!</p>
      <div style={{ marginTop: 4, padding: "6px 16px", borderRadius: 99, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
        <span className="text-xs font-semibold" style={{ color: "rgba(253,248,243,0.55)" }}>Balance: </span>
        <span className="text-xs font-bold" style={{ color: "#fdf8f3" }}>60 pts</span>
      </div>
    </div>
  );
}

function CustomerStep1({ k }: { k: number }) {
  return (
    <div key={k} className="step-fade-up flex flex-col h-full px-4 pt-3 gap-3">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(253,248,243,0.4)" }}>Your Rewards</p>
      <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px 14px" }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-bold" style={{ color: "#fdf8f3" }}>Free Haircut</p>
            <p className="text-xs" style={{ color: "rgba(253,248,243,0.45)" }}>60 / 100 pts</p>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,123,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
              <path d="M4 9h10M12 6l3 3-3 3" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg,#c97b3a,#e8944a)",
            animation: "progressFill 1.2s 0.1s ease-out forwards",
            width: "42%",
          }} />
        </div>
        <p className="text-xs mt-1.5" style={{ color: "rgba(253,248,243,0.4)" }}>40 more visits to unlock</p>
      </div>
      <div style={{ animation: "badgePop 0.5s 0.4s ease-out both", borderRadius: 12, padding: "10px 14px", background: "linear-gradient(135deg,rgba(201,123,58,0.18),rgba(232,148,74,0.08))", border: "1px solid rgba(201,123,58,0.3)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🥈</span>
        <div>
          <p className="text-xs font-bold" style={{ color: "#e8944a" }}>Silver Member</p>
          <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>2× points on every visit</p>
        </div>
      </div>
      <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "10px 14px" }}>
        <p className="text-xs font-semibold" style={{ color: "rgba(253,248,243,0.4)" }}>Next tier: Gold</p>
        <p className="text-xs" style={{ color: "rgba(253,248,243,0.25)" }}>Visit 15 more times</p>
      </div>
    </div>
  );
}

function CustomerStep2({ k }: { k: number }) {
  return (
    <div key={k} className="step-fade-up flex flex-col h-full relative">
      {/* Notification banner */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        background: "rgba(20,22,30,0.96)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px 12px 16px 16px",
        padding: "12px 14px",
        margin: "0 6px",
        animation: "notifSlide 3s ease forwards",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}>
        <div className="flex items-center gap-2 mb-1">
          <div style={{ width: 20, height: 20, borderRadius: 6, background: "linear-gradient(135deg,#c97b3a,#e8944a)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M2 5h6M5 2v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <span className="text-xs font-bold" style={{ color: "#fdf8f3" }}>MTB Barbershop</span>
          <span className="text-xs" style={{ color: "rgba(253,248,243,0.35)" }}>now</span>
        </div>
        <p className="text-xs leading-snug" style={{ color: "rgba(253,248,243,0.8)" }}>
          🎁 You&apos;re <strong style={{ color: "#e8944a" }}>1 visit</strong> away from a free haircut. Come back this week!
        </p>
      </div>
      {/* Dimmed background app */}
      <div className="flex flex-col px-4 pt-3 gap-2 opacity-30" style={{ filter: "blur(1px)", paddingTop: 70 }}>
        <p className="text-xs font-bold" style={{ color: "rgba(253,248,243,0.5)" }}>My Rewards</p>
        <div style={{ height: 48, borderRadius: 10, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)" }} />
        <div style={{ height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)" }} />
      </div>
    </div>
  );
}

function CustomerStep3({ k }: { k: number }) {
  const confetti = ["#e8944a","#c97b3a","#fdf8f3","#f5b97a","#e8944a","#fff","#c97b3a","#f5b97a"];
  return (
    <div key={k} className="step-fade-up flex flex-col items-center justify-center h-full gap-3 px-4 relative overflow-hidden">
      {/* Confetti particles */}
      {confetti.map((c, i) => (
        <div key={i} style={{
          position: "absolute",
          top: 10 + (i % 3) * 12,
          left: 20 + i * 28,
          width: 6, height: 6,
          borderRadius: i % 2 === 0 ? "50%" : 2,
          background: c,
          animation: `confettiFall ${0.9 + i * 0.12}s ${i * 0.07}s ease-in forwards`,
        }} />
      ))}
      <div style={{ fontSize: 48, lineHeight: 1 }}>🎉</div>
      <p className="text-xl font-black" style={{ color: "#fdf8f3" }}>Reward Unlocked!</p>
      <p className="text-xs" style={{ color: "rgba(253,248,243,0.5)" }}>Free Haircut — MTB Barbershop</p>
      <div style={{ borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", padding: "12px 20px", textAlign: "center" }}>
        {/* Mock QR */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,10px)", gap: 2, margin: "0 auto 8px" }}>
          {Array.from({length: 36}).map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: [0,1,5,6,7,11,12,17,18,23,24,25,29,30,35].includes(i) ? "#fdf8f3" : "transparent" }} />
          ))}
        </div>
        <p className="text-xs font-semibold" style={{ color: "rgba(253,248,243,0.5)" }}>Show to redeem</p>
      </div>
    </div>
  );
}

// ─── Business screen steps ───────────────────────────────────────────────────

function BusinessStep0({ k }: { k: number }) {
  return (
    <div key={k} className="step-fade-up flex flex-col h-full px-4 pt-3 gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(253,248,243,0.4)" }}>Dashboard</p>
        <span className="text-xs" style={{ color: "rgba(253,248,243,0.3)" }}>Today</span>
      </div>
      {/* Toast */}
      <div style={{ borderRadius: 12, padding: "10px 12px", background: "rgba(201,123,58,0.12)", border: "1px solid rgba(232,148,74,0.3)", display: "flex", alignItems: "center", gap: 8, animation: "toastIn 0.4s 0.1s ease-out both" }}>
        <span style={{ fontSize: 16 }}>✅</span>
        <div>
          <p className="text-xs font-bold" style={{ color: "#e8944a" }}>James O. just checked in</p>
          <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>Earned 10 pts · Silver member</p>
        </div>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Today's visits", value: "13", sub: "+2 vs yesterday" },
          { label: "Active members", value: "284", sub: "this month" },
        ].map((s, i) => (
          <div key={i} style={{ borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", animation: `toastIn 0.4s ${0.2 + i * 0.1}s ease-out both` }}>
            <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>{s.label}</p>
            <p className="text-xl font-black" style={{ color: "#fdf8f3" }}>{s.value}</p>
            <p className="text-xs" style={{ color: "#e8944a" }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 12, padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "rgba(253,248,243,0.35)" }}>Recent visits</p>
        {["James O.", "Sarah M.", "Priya K."].map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 2 ? 6 : 0, animation: `rowsFadeIn 0.35s ${0.3 + i * 0.1}s ease-out both` }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#c97b3a,#e8944a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>
              {n.split(" ").map(x => x[0]).join("")}
            </div>
            <span className="text-xs font-medium" style={{ color: "rgba(253,248,243,0.7)" }}>{n}</span>
            <span className="text-xs" style={{ color: "rgba(253,248,243,0.3)", marginLeft: "auto" }}>just now</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BusinessStep1({ k }: { k: number }) {
  return (
    <div key={k} className="step-fade-up flex flex-col h-full px-4 pt-3 gap-3">
      <div style={{ borderRadius: 12, padding: "12px 14px", background: "rgba(232,148,74,0.1)", border: "1px solid rgba(232,148,74,0.3)", display: "flex", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(232,148,74,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7.5" stroke="#e8944a" strokeWidth="1.2"/>
            <path d="M8 5v3.5M8 11h.01" stroke="#e8944a" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "#e8944a" }}>3 customers at risk</p>
          <p className="text-xs" style={{ color: "rgba(253,248,243,0.45)" }}>Haven&apos;t visited in 28+ days</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          { name: "Marcus T.", days: "34 days ago", spend: "£340 lifetime" },
          { name: "Sarah K.",  days: "31 days ago", spend: "£210 lifetime" },
          { name: "Dev P.",    days: "29 days ago", spend: "£180 lifetime" },
        ].map((c, i) => (
          <div key={i} style={{ borderRadius: 10, padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, animation: `rowsFadeIn 0.35s ${i * 0.1}s ease-out both`}}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(232,148,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#e8944a", flexShrink: 0 }}>
              {c.name.split(" ").map(x => x[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <p className="text-xs font-bold" style={{ color: "#fdf8f3" }}>{c.name}</p>
              <p className="text-xs" style={{ color: "rgba(253,248,243,0.35)" }}>Last: {c.days}</p>
            </div>
            <p className="text-xs" style={{ color: "rgba(253,248,243,0.3)" }}>{c.spend}</p>
          </div>
        ))}
      </div>
      <button style={{ borderRadius: 10, padding: "10px 0", background: "linear-gradient(135deg,#c97b3a,#e8944a)", color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", width: "100%", animation: "badgePop 0.45s 0.35s ease-out both" }}>
        Send Re-engagement Offer →
      </button>
    </div>
  );
}

function BusinessStep2({ k }: { k: number }) {
  const bars = [38, 55, 48, 72, 95, 62, 44];
  const days = ["M","T","W","T","F","S","S"];
  return (
    <div key={k} className="step-fade-up flex flex-col h-full px-4 pt-3 gap-4">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(253,248,243,0.4)" }}>Analytics</p>
      <div style={{ borderRadius: 12, padding: "12px 14px", background: "rgba(201,123,58,0.1)", border: "1px solid rgba(201,123,58,0.25)" }}>
        <p className="text-xs font-semibold" style={{ color: "rgba(253,248,243,0.5)" }}>Key insight</p>
        <p className="text-sm font-bold mt-0.5" style={{ color: "#fdf8f3" }}>Fridays are your peak loyalty day</p>
        <p className="text-xs mt-0.5" style={{ color: "#e8944a" }}>40% of weekly repeat customers</p>
      </div>
      <div>
        <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "rgba(253,248,243,0.3)" }}>Visit frequency this week</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 60 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{
                width: "100%", borderRadius: "4px 4px 0 0",
                height: `${h * 0.58}px`,
                background: i === 4 ? "linear-gradient(180deg,#e8944a,#c97b3a)" : "rgba(201,123,58,0.22)",
                transformOrigin: "bottom",
                animation: `barGrow 0.6s ${i * 0.07}s ease-out both`,
                boxShadow: i === 4 ? "0 0 12px rgba(232,148,74,0.4)" : "none",
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
          {days.map((d, i) => (
            <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: i === 4 ? "#e8944a" : "rgba(253,248,243,0.25)", fontWeight: i === 4 ? 700 : 400 }}>{d}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ label: "Avg. visits/mo", val: "6.2×" }, { label: "Retention rate", val: "78%" }].map((s, i) => (
          <div key={i} style={{ borderRadius: 10, padding: "8px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", animation: `toastIn 0.4s ${0.5 + i * 0.1}s ease-out both` }}>
            <p className="text-xs" style={{ color: "rgba(253,248,243,0.35)" }}>{s.label}</p>
            <p className="text-lg font-black" style={{ color: "#fdf8f3" }}>{s.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BusinessStep3({ k }: { k: number }) {
  return (
    <div key={k} className="step-fade-up flex flex-col h-full px-4 pt-3 gap-3">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(253,248,243,0.4)" }}>Monthly Revenue</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Last month", val: "£2,100", sub: "baseline", dim: true },
          { label: "This month", val: "£2,847", sub: "↑ growing", dim: false },
        ].map((s, i) => (
          <div key={i} style={{ borderRadius: 14, padding: "14px 12px", background: s.dim ? "rgba(255,255,255,0.04)" : "rgba(201,123,58,0.1)", border: `1px solid ${s.dim ? "rgba(255,255,255,0.07)" : "rgba(232,148,74,0.3)"}`, animation: `toastIn 0.45s ${i * 0.1}s ease-out both` }}>
            <p className="text-xs font-semibold" style={{ color: "rgba(253,248,243,0.4)" }}>{s.label}</p>
            <p className="text-2xl font-black mt-1" style={{ color: s.dim ? "rgba(253,248,243,0.45)" : "#fdf8f3" }}>{s.val}</p>
            <p className="text-xs" style={{ color: s.dim ? "rgba(253,248,243,0.25)" : "#e8944a" }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ borderRadius: 99, padding: "8px 20px", background: "linear-gradient(135deg,#c97b3a,#e8944a)", animation: "badgePop 0.5s 0.3s ease-out both", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span className="text-xl font-black" style={{ color: "#fff" }}>+35%</span>
          <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.8)" }}>vs last month</span>
        </div>
      </div>
      <div style={{ borderRadius: 12, padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "rgba(253,248,243,0.35)" }}>Revenue breakdown</p>
        {[["Repeat customers", "68%"], ["New customers", "22%"], ["Reward redemptions", "10%"]].map(([l, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < 2 ? 4 : 0 }}>
            <span className="text-xs" style={{ color: "rgba(253,248,243,0.45)" }}>{l}</span>
            <span className="text-xs font-bold" style={{ color: "#e8944a" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Phone frame ─────────────────────────────────────────────────────────────

function PhoneFrame({ persona, step, stepKey }: { persona: Persona; step: number; stepKey: number }) {
  const screenBg = persona === "customer"
    ? "linear-gradient(160deg,#1a1025 0%,#0d1117 100%)"
    : "linear-gradient(160deg,#0d1117 0%,#131b24 100%)";

  const customerScreens = [
    <CustomerStep0 key={stepKey} k={stepKey} />,
    <CustomerStep1 key={stepKey} k={stepKey} />,
    <CustomerStep2 key={stepKey} k={stepKey} />,
    <CustomerStep3 key={stepKey} k={stepKey} />,
  ];
  const businessScreens = [
    <BusinessStep0 key={stepKey} k={stepKey} />,
    <BusinessStep1 key={stepKey} k={stepKey} />,
    <BusinessStep2 key={stepKey} k={stepKey} />,
    <BusinessStep3 key={stepKey} k={stepKey} />,
  ];
  const screen = persona === "customer" ? customerScreens[step] : businessScreens[step];

  return (
    <div style={{
      width: 260, height: 520, flexShrink: 0,
      background: "#111520",
      borderRadius: 44,
      padding: 10,
      boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(201,123,58,0.12)",
      position: "relative",
    }}>
      {/* Screen */}
      <div style={{
        width: "100%", height: "100%",
        borderRadius: 36,
        background: screenBg,
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px 6px", flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(253,248,243,0.6)" }}>9:41</span>
          <div style={{ width: 80, height: 18, borderRadius: 99, background: "#111520", position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)" }} />
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[1,1,1].map((_,i) => <div key={i} style={{ width: 3, height: 6 + i*2, borderRadius: 1, background: "rgba(253,248,243,0.6)" }}/>)}
            <svg width="12" height="10" fill="none" viewBox="0 0 12 10" style={{ marginLeft: 2 }}><rect x="0.5" y="2.5" width="9" height="7" rx="1.5" stroke="rgba(253,248,243,0.6)" strokeWidth="1"/><path d="M10 4.5h1.5v3H10" stroke="rgba(253,248,243,0.6)" strokeWidth="1" strokeLinecap="round"/></svg>
          </div>
        </div>
        {/* Content area */}
        <div style={{ flex: 1, height: "calc(100% - 40px)", overflow: "hidden" }}>
          {screen}
        </div>
        {/* Home indicator */}
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 80, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.18)" }} />
      </div>
    </div>
  );
}

// ─── Step dots ───────────────────────────────────────────────────────────────

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 6, height: 6, borderRadius: 99,
          background: i === current ? "#e8944a" : "rgba(255,255,255,0.18)",
          transition: "width 0.3s ease, background 0.3s ease",
        }} />
      ))}
    </div>
  );
}

// ─── Copy per persona ─────────────────────────────────────────────────────────

const personaContent = {
  customer: {
    badge: "👤 Customer View",
    headline: "Your stamps. Your rewards. Always in your pocket.",
    bullets: [
      "Earn points automatically on every visit",
      "Track your progress toward free rewards",
      "Get notified when you're one visit away",
    ],
  },
  business: {
    badge: "🏪 Business Owner View",
    headline: "Every customer. Every visit. All the data you've been missing.",
    bullets: [
      "See who's loyal, who's at risk, and who's your VIP",
      "Get alerted before regulars go to a competitor",
      "Watch revenue grow as loyalty compounds",
    ],
  },
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function HeroDemo() {
  const [persona, setPersona] = useState<Persona>("customer");
  const [flipClass, setFlipClass] = useState<"" | "phone-flip-out" | "phone-flip-in">("");
  const [step, setStep] = useState(0);
  const [stepKey, setStepKey] = useState(0);

  // Auto-flip hint after 3.5s
  useEffect(() => {
    const t = setTimeout(() => switchTo("business"), 3500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step cycling: reset on persona change
  useEffect(() => {
    setStep(0);
    setStepKey(k => k + 1);
    const iv = setInterval(() => {
      setStep(s => {
        const next = (s + 1) % 4;
        setStepKey(k => k + 1);
        return next;
      });
    }, 2600);
    return () => clearInterval(iv);
  }, [persona]);

  function switchTo(next: Persona) {
    if (next === persona || flipClass !== "") return;
    setFlipClass("phone-flip-out");
    setTimeout(() => {
      setPersona(next);
      setFlipClass("phone-flip-in");
      setTimeout(() => setFlipClass(""), 300);
    }, 250);
  }

  const content = personaContent[persona];

  return (
    <section className="w-full py-20" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-full max-w-5xl mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-12">
          <div className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            style={{ background: "rgba(201,123,58,0.12)", color: "#e8944a", border: "1px solid rgba(201,123,58,0.25)" }}>
            See it in action
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#fdf8f3" }}>
            One platform, two perspectives
          </h2>
          <p className="text-base mt-3 max-w-lg mx-auto" style={{ color: "rgba(253,248,243,0.5)" }}>
            Choose a view to see how LoyaltyHub works for both sides of the relationship.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.06)", borderRadius: 99, padding: 4, border: "1px solid rgba(255,255,255,0.1)", gap: 4 }}>
            {(["customer", "business"] as Persona[]).map(p => (
              <button
                key={p}
                onClick={() => switchTo(p)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 99,
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: persona === p ? "linear-gradient(135deg,#c97b3a,#e8944a)" : "transparent",
                  color: persona === p ? "#fff" : "rgba(253,248,243,0.5)",
                  boxShadow: persona === p ? "0 4px 16px rgba(201,123,58,0.3)" : "none",
                }}
              >
                {p === "customer" ? "👤  I'm a Customer" : "🏪  I'm a Business Owner"}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: copy */}
          <div className="flex-1 flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold w-fit mx-auto lg:mx-0"
              style={{ background: "rgba(201,123,58,0.12)", border: "1px solid rgba(201,123,58,0.2)", color: "#e8944a" }}>
              {content.badge}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug" style={{ color: "#fdf8f3", transition: "all 0.3s ease" }}>
              {content.headline}
            </h3>
            <ul className="flex flex-col gap-3">
              {content.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-left">
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(201,123,58,0.15)", border: "1px solid rgba(201,123,58,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
                      <path d="M2 5l2.5 2.5L8 2.5" stroke="#e8944a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: "rgba(253,248,243,0.65)" }}>{b}</span>
                </li>
              ))}
            </ul>
            <div style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>
                {persona === "customer"
                  ? "Customers join for free. No app download required — just scan and go."
                  : "Set up in under 5 minutes. No technical knowledge needed."}
              </p>
            </div>
          </div>

          {/* Right: phone */}
          <div className="flex flex-col items-center order-1 lg:order-2" style={{ position: "relative" }}>
            {/* Glow behind phone */}
            <div style={{
              position: "absolute",
              width: 280, height: 280,
              borderRadius: "50%",
              background: persona === "customer"
                ? "radial-gradient(circle, rgba(201,123,58,0.2) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(201,123,58,0.15) 0%, transparent 70%)",
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              transition: "background 0.5s ease",
              pointerEvents: "none",
              zIndex: 0,
            }} />
            <div className={flipClass} style={{ position: "relative", zIndex: 1 }}>
              <PhoneFrame persona={persona} step={step} stepKey={stepKey} />
            </div>
            <StepDots total={4} current={step} />
            <p className="text-xs mt-3" style={{ color: "rgba(253,248,243,0.3)" }}>
              Auto-playing demo · {step + 1} of 4
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

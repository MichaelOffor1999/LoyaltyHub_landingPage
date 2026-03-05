"use client";

import { useEffect, useState } from "react";
import { SplineScene } from "./splite";

// The interactive robot from Spline — drop-in for the hero right panel
// Scene: https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode
const ROBOT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

// Cycles: 0→1→2→3→4 stamps filling up, then resets — 1.2s per stamp
function useStampCycle() {
  const [stamps, setStamps] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning(true);
      setTimeout(() => {
        setStamps((s) => {
          const next = (s + 1) % 6; // 0–5, reset after 5
          if (next === 5) {
            // Reward unlocked!
            setNotify(true);
            setTimeout(() => setNotify(false), 2800);
          }
          return next;
        });
        setScanning(false);
      }, 500);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return { stamps, scanning, notify };
}

export function HeroSplineCard() {
  const { stamps, scanning, notify } = useStampCycle();
  const total = 5;
  const isComplete = stamps === 0 && !scanning; // just reset = reward claimed

  return (
    <div
      className="relative w-full h-[420px] lg:h-[520px] rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1208 100%)",
        border: "1px solid rgba(201,123,58,0.25)",
        boxShadow: "0 0 60px rgba(201,123,58,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(201,123,58,0.18) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      {/* ── Floating loyalty card — bottom-left, robot "presents" it ── */}
      <div
        className="absolute bottom-14 left-4 z-30 w-[190px] rounded-2xl px-4 py-3 flex flex-col gap-2"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)",
          boxShadow: scanning
            ? "0 0 0 2px #e8944a, 0 8px 32px rgba(201,123,58,0.55)"
            : "0 8px 32px rgba(0,0,0,0.5)",
          transition: "box-shadow 0.3s ease",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Sarah K.</p>
            <p className="text-sm font-black text-white leading-tight">Barista & Co</p>
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white"
            style={{ background: "#22c55e" }}
          >
            ACTIVE
          </span>
        </div>

        {/* Stamp dots */}
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: total }).map((_, i) => {
            const filled = i < stamps;
            return (
              <div
                key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-400"
                style={{
                  background: filled ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                  border: filled ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  boxShadow: filled && i === stamps - 1 ? "0 0 10px rgba(255,255,255,0.5)" : "none",
                  transform: filled && i === stamps - 1 ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {filled && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-white/60"
            style={{
              width: `${(stamps / total) * 100}%`,
              transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>

        <p className="text-[9px] text-white/50 font-medium">
          {stamps}/{total} stamps · <span className="text-white/80">Free Coffee</span>
        </p>

        {/* Scan pulse ring — shown when scanning */}
        {scanning && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: "2px solid rgba(201,123,58,0.9)",
              animation: "ping 0.5s ease-out forwards",
            }}
          />
        )}
      </div>

      {/* ── Scan indicator — top of card ── */}
      {scanning && (
        <div
          className="absolute bottom-[175px] left-[60px] z-40 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider"
          style={{
            background: "rgba(201,123,58,0.95)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(201,123,58,0.6)",
            animation: "fadeInUp 0.2s ease-out",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
          Scanning…
        </div>
      )}

      {/* ── Reward unlocked toast ── */}
      {notify && (
        <div
          className="absolute top-4 left-4 z-40 flex items-center gap-2 rounded-2xl px-3 py-2.5"
          style={{
            background: "linear-gradient(135deg,#c97b3a,#e8944a)",
            boxShadow: "0 8px 32px rgba(201,123,58,0.55)",
            animation: "slideInLeft 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-wider">Reward Unlocked! 🎉</p>
            <p className="text-[9px] text-white/80 font-medium">Sarah K. earns a Free Coffee</p>
          </div>
        </div>
      )}

      {/* ── Loyalty AI badge — top right ── */}
      <div
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest"
        style={{
          background: "rgba(201,123,58,0.15)",
          border: "1px solid rgba(201,123,58,0.35)",
          color: "#e8944a",
          backdropFilter: "blur(8px)",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Loyalty AI
      </div>

      {/* ── Live stat — right side ── */}
      <div
        className="absolute bottom-14 right-4 z-30 flex flex-col items-center gap-1 rounded-2xl px-3 py-2.5"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="text-xl font-black" style={{ color: "#e8944a" }}>+34%</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-white/50 text-center leading-tight">Return<br/>rate</span>
      </div>

      {/* The 3D robot */}
      <SplineScene scene={ROBOT_SCENE} className="absolute inset-0 w-full h-full z-10" />

      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { SplineScene } from "./splite";

const ROBOT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

// Animates stamps 0→5, shows reward toast, resets
function useStampCycle() {
  const [stamps, setStamps] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [notify, setNotify] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      setTimeout(() => {
        setStamps((s) => {
          const next = s + 1;
          if (next >= 5) {
            setNotify(true);
            setTimeout(() => {
              setNotify(false);
              setStamps(0);
            }, 2800);
            return 5;
          }
          return next;
        });
        setScanning(false);
      }, 500);
    }, 1900);
    return () => clearInterval(interval);
  }, []);

  return { stamps, scanning, notify, pulse };
}

// Counter animation hook
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return value;
}

const TOTAL_STAMPS = 5;

function StampDot({ filled, isLatest, index }: { filled: boolean; isLatest: boolean; index: number }) {
  return (
    <div
      className="relative w-[30px] h-[30px] rounded-full flex items-center justify-center"
      style={{
        background: filled
          ? "linear-gradient(135deg,#c97b3a,#f5b97a)"
          : "rgba(255,255,255,0.07)",
        border: filled ? "none" : "1.5px solid rgba(255,255,255,0.15)",
        boxShadow: isLatest
          ? "0 0 0 3px rgba(201,123,58,0.4), 0 0 14px rgba(232,148,74,0.7)"
          : filled
          ? "0 2px 8px rgba(201,123,58,0.35)"
          : "none",
        transform: isLatest ? "scale(1.18)" : "scale(1)",
        transition: `all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.04}s`,
      }}
    >
      {filled ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
      )}
    </div>
  );
}

export function HeroSplineCard() {
  const { stamps, scanning, notify, pulse } = useStampCycle();
  const returnRate = useCountUp(34, 1400);
  const customers = useCountUp(847, 1600);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden select-none"
      style={{
        height: "480px",
        background: "linear-gradient(145deg, #0d0d12 0%, #120e06 60%, #0a0a0f 100%)",
        border: "1px solid rgba(201,123,58,0.2)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,123,58,0.1)",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: "-60px", left: "-40px", width: "280px", height: "280px",
          background: "radial-gradient(circle, rgba(201,123,58,0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none z-0"
        style={{
          bottom: "-40px", right: "-40px", width: "220px", height: "220px",
          background: "radial-gradient(circle, rgba(42,82,190,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── TOP ROW ── */}
      {/* Loyalty AI chip — top-left */}
      <div
        className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full px-3 py-1.5"
        style={{
          background: "rgba(10,10,15,0.8)",
          border: "1px solid rgba(201,123,58,0.35)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "hb-pulse 2s ease-in-out infinite" }}
        />
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#e8944a" }}>
          Loyalty AI
        </span>
      </div>

      {/* Mini stats — top-right */}
      <div
        className="absolute top-4 right-4 z-30 flex items-center gap-2 rounded-2xl px-3 py-2"
        style={{
          background: "rgba(10,10,15,0.75)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm font-black leading-none" style={{ color: "#e8944a" }}>+{returnRate}%</span>
          <span className="text-[8px] font-semibold uppercase tracking-wider mt-0.5 leading-none" style={{ color: "rgba(255,255,255,0.4)" }}>returns</span>
        </div>
        <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="flex flex-col items-center">
          <span className="text-sm font-black leading-none" style={{ color: "#f1f0ee" }}>{customers.toLocaleString()}</span>
          <span className="text-[8px] font-semibold uppercase tracking-wider mt-0.5 leading-none" style={{ color: "rgba(255,255,255,0.4)" }}>fans</span>
        </div>
      </div>

      {/* ── REWARD TOAST ── */}
      {notify && (
        <div
          className="absolute top-14 left-1/2 z-50 flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg,#c97b3a 0%,#e8944a 100%)",
            boxShadow: "0 8px 40px rgba(201,123,58,0.55), 0 0 0 1px rgba(255,255,255,0.15) inset",
            animation: "hb-slide-down 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
            whiteSpace: "nowrap",
          }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg" style={{ background: "rgba(255,255,255,0.2)" }}>
            🎁
          </div>
          <div>
            <p className="text-[11px] font-black text-white uppercase tracking-wider leading-tight">Free Coffee Unlocked! 🎉</p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>Sarah K. earned her reward</p>
          </div>
        </div>
      )}

      {/* ── 3D ROBOT ── */}
      <SplineScene scene={ROBOT_SCENE} className="absolute inset-0 w-full h-full z-10" />

      {/* ── LOYALTY CARD — bottom-left, floats ── */}
      <div
        className="absolute z-30"
        style={{ bottom: "16px", left: "12px", width: "196px", animation: "hb-float 3.5s ease-in-out infinite" }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1c3d6b 0%, #1e5495 50%, #163357 100%)",
            boxShadow: pulse
              ? "0 0 0 2.5px #e8944a, 0 12px 40px rgba(201,123,58,0.6), 0 0 0 5px rgba(201,123,58,0.15)"
              : "0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08) inset",
            transition: "box-shadow 0.3s ease",
            padding: "12px 14px 10px",
          }}
        >
          {/* Shine sweep */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)" }} />
          {/* Decorative circles */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.03)" }} />

          {/* Header */}
          <div className="flex items-start justify-between mb-2.5 relative">
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest leading-none mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Member</p>
              <p className="text-[13px] font-black text-white leading-tight">Sarah K.</p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="rounded-full px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-white" style={{ background: "rgba(34,197,94,0.85)" }}>Active</span>
              <p className="text-[8px] font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>Barista & Co</p>
            </div>
          </div>

          {/* Stamps */}
          <div className="flex gap-[6px] mb-2.5 relative">
            {Array.from({ length: TOTAL_STAMPS }).map((_, i) => (
              <StampDot key={i} filled={i < stamps} isLatest={i === stamps - 1} index={i} />
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-[3px] w-full rounded-full overflow-hidden mb-1.5" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(stamps / TOTAL_STAMPS) * 100}%`,
                background: "linear-gradient(90deg,#c97b3a,#f5b97a)",
                boxShadow: "0 0 8px rgba(201,123,58,0.6)",
                transition: "width 0.55s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[8px] font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>{stamps}/{TOTAL_STAMPS} stamps</p>
            <p className="text-[8px] font-black" style={{ color: "#f5b97a" }}>Free Coffee ☕</p>
          </div>

          {/* Scan ring */}
          {scanning && (
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: "2px solid rgba(201,123,58,0.9)", animation: "hb-ping 0.5s ease-out forwards" }} />
          )}
        </div>

        {/* Scan label */}
        {scanning && (
          <div
            className="mt-1.5 flex items-center justify-center gap-1.5 rounded-full py-1 px-3"
            style={{ background: "rgba(201,123,58,0.9)", animation: "hb-fade-up 0.2s ease-out" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
            <span className="text-[9px] font-black uppercase tracking-wider text-white">Scanning QR…</span>
          </div>
        )}
      </div>

      {/* ── MINI ANALYTICS CARD — bottom-right ── */}
      <div
        className="absolute bottom-4 right-3 z-30 rounded-2xl"
        style={{
          width: "108px",
          background: "rgba(12,12,18,0.85)",
          border: "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          padding: "10px 10px 8px",
          animation: "hb-float 4s ease-in-out 0.8s infinite",
        }}
      >
        <p className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>This week</p>
        <div className="flex items-end gap-[3px] h-10 mb-2">
          {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i === 5 ? "linear-gradient(180deg,#e8944a,#c97b3a)" : "rgba(201,123,58,0.25)",
                boxShadow: i === 5 ? "0 0 6px rgba(232,148,74,0.5)" : "none",
              }}
            />
          ))}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-base font-black leading-none" style={{ color: "#f1f0ee" }}>+34%</span>
          <span className="text-[9px] font-semibold" style={{ color: "#22c55e" }}>↑</span>
        </div>
        <p className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>return rate</p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes hb-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes hb-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes hb-ping {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.06); }
        }
        @keyframes hb-fade-up {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hb-slide-down {
          from { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}

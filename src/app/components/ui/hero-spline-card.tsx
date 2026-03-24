"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

const TOTAL_STAMPS = 5;

function StampDot({ filled, isLatest, index }: { filled: boolean; isLatest: boolean; index: number }) {
  return (
    <div
      className="relative w-[34px] h-[34px] rounded-full flex items-center justify-center"
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
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
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

  return (
    <div className="w-full flex items-center justify-center select-none" style={{ minHeight: "420px" }}>
      {/* Floating card wrapper */}
      <div style={{ animation: "hb-float 3.5s ease-in-out infinite" }}>
        {/* Reward toast above card */}
        <div style={{ height: "52px", display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: "12px" }}>
          {notify && (
            <div
              className="flex items-center gap-3 rounded-2xl px-5 py-3"
              style={{
                background: "linear-gradient(135deg,#c97b3a 0%,#e8944a 100%)",
                boxShadow: "0 8px 40px rgba(201,123,58,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset",
                animation: "hb-slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
                whiteSpace: "nowrap",
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg" style={{ background: "rgba(255,255,255,0.2)" }}>
                🎁
              </div>
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-wider leading-tight">Free Coffee Unlocked!</p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>Sarah K. earned her reward</p>
              </div>
            </div>
          )}
        </div>

        {/* The card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            width: "320px",
            background: "linear-gradient(135deg, #1a3a6b 0%, #1e5495 45%, #163060 100%)",
            boxShadow: pulse
              ? "0 0 0 2.5px #e8944a, 0 24px 60px rgba(28,61,107,0.7), 0 0 0 6px rgba(201,123,58,0.12)"
              : "0 24px 60px rgba(28,61,107,0.55), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 40px rgba(30,84,149,0.3)",
            transition: "box-shadow 0.3s ease",
            padding: "24px 24px 20px",
          }}
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)" }} />
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="absolute -bottom-10 -left-8 w-40 h-40 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.03)" }} />

          {/* Card top: logo + brand name + active badge */}
          <div className="flex items-center justify-between mb-6 relative">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Image
                  src="/favicon.png"
                  alt="Clienty"
                  width={26}
                  height={26}
                  style={{ borderRadius: "6px" }}
                  priority
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: "rgba(255,255,255,0.45)" }}>Powered by</p>
                <p className="text-[15px] font-black text-white leading-tight tracking-tight">Clienty</p>
              </div>
            </div>
            <span
              className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white"
              style={{ background: "rgba(34,197,94,0.9)", boxShadow: "0 0 10px rgba(34,197,94,0.4)" }}
            >
              Active
            </span>
          </div>

          {/* Member info */}
          <div className="mb-5 relative">
            <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Member</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-black text-white leading-tight">Sarah K.</p>
              <p className="text-[10px] font-semibold mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Barista & Co</p>
            </div>
          </div>

          {/* Stamps row */}
          <div className="flex gap-2 mb-4 relative">
            {Array.from({ length: TOTAL_STAMPS }).map((_, i) => (
              <StampDot key={i} filled={i < stamps} isLatest={i === stamps - 1} index={i} />
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-[4px] w-full rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
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

          <div className="flex items-center justify-between relative">
            <p className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>{stamps}/{TOTAL_STAMPS} stamps</p>
            <p className="text-[10px] font-black" style={{ color: "#f5b97a" }}>Free Coffee ☕</p>
          </div>

          {/* Scan ring pulse */}
          {scanning && (
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ border: "2px solid rgba(201,123,58,0.9)", animation: "hb-ping 0.5s ease-out forwards" }} />
          )}
        </div>

        {/* Scan label below card */}
        {scanning && (
          <div
            className="mt-3 flex items-center justify-center gap-2 rounded-full py-1.5 px-4 mx-auto"
            style={{ background: "rgba(201,123,58,0.9)", width: "fit-content", animation: "hb-fade-up 0.2s ease-out" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">Scanning QR…</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes hb-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes hb-ping {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.04); }
        }
        @keyframes hb-fade-up {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hb-slide-up {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

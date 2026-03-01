"use client";
import { useState, useEffect } from "react";

const HINTS = ["coffee shops", "gyms", "salons", "restaurants", "barbershops", "nail bars", "bakeries", "spas", "pet groomers", "yoga studios", "boutiques", "car washes"];

const CARDS = [
  { biz: "Coffee Ritual",  customer: "James O.",  reward: "Free Coffee",    stamps: 4, total: 5,  gradient: "linear-gradient(140deg,#7a3e12,#c97b3a)", checkColor: "#c97b3a" },
  { biz: "PureMotion Gym", customer: "Sarah K.",  reward: "Free Month",     stamps: 7, total: 10, gradient: "linear-gradient(140deg,#1a3a5c,#2e6da4)", checkColor: "#2e6da4" },
  { biz: "Luxe Nails",     customer: "Priya M.",  reward: "Free Treatment", stamps: 3, total: 6,  gradient: "linear-gradient(140deg,#4a1a5c,#9b4fc8)", checkColor: "#9b4fc8" },
  { biz: "Barista & Co",   customer: "Leo T.",    reward: "Free Brunch",    stamps: 2, total: 4,  gradient: "linear-gradient(140deg,#14401e,#22863a)", checkColor: "#22863a" },
  { biz: "FitZone Studio", customer: "Ava R.",    reward: "Free Class",     stamps: 5, total: 8,  gradient: "linear-gradient(140deg,#3d1a00,#e8944a)", checkColor: "#e8944a" },
];

const SLOT_STYLES = [
  { rotate: 0,  tx: 0,   ty: 0,  z: 3, opacity: 1,    scale: 1    },
  { rotate: 4,  tx: 12,  ty: 6,  z: 2, opacity: 1,    scale: 0.96 },
  { rotate: -7, tx: -16, ty: 10, z: 1, opacity: 0.75, scale: 0.92 },
];

type CardData = typeof CARDS[0];

function LoyaltyCard({ card, slot, exiting }: { card: CardData; slot: number; exiting: boolean }) {
  const s = SLOT_STYLES[slot];
  const tx = exiting ? s.tx + 40 : s.tx;
  const ty = exiting ? -70 : s.ty;
  const transform = `rotate(${s.rotate}deg) translateX(${tx}px) translateY(${ty}px) scale(${s.scale})`;

  return (
    <div
      style={{
        width: "clamp(260px, 32vw, 360px)",
        borderRadius: 20,
        background: card.gradient,
        padding: "18px 20px",
        boxShadow: slot === 0 ? "0 18px 50px rgba(0,0,0,0.28)" : "0 8px 24px rgba(0,0,0,0.16)",
        transform,
        zIndex: s.z,
        opacity: exiting ? 0 : s.opacity,
        position: "absolute",
        top: 0,
        left: 0,
        transition: exiting
          ? "transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease"
          : "transform 0.55s cubic-bezier(0.34,1.1,0.64,1), opacity 0.45s ease, box-shadow 0.4s ease",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.8 }}>{card.customer}</p>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{card.biz}</p>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, borderRadius: 99, background: "#22c55e", color: "#fff", padding: "3px 8px" }}>ACTIVE</span>
      </div>

      {/* Stamps */}
      <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
        {Array.from({ length: card.total }).map((_, i) => (
          <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: i < card.stamps ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {i < card.stamps && i < card.total - 1 && (
              <svg width="13" height="13" fill="none" viewBox="0 0 13 13">
                <path d="M2.5 6.5l2.5 2.5 5-5" stroke={card.checkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i === card.total - 1 && (
              <svg width="13" height="13" fill="none" viewBox="0 0 13 13">
                <rect x="1.5" y="3" width="10" height="8.5" rx="1.5" stroke={i < card.stamps ? card.checkColor : "rgba(255,255,255,0.35)"} strokeWidth="1.2"/>
                <path d="M4.5 3V2a2 2 0 014 0v1" stroke={i < card.stamps ? card.checkColor : "rgba(255,255,255,0.35)"} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.2)", overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${(card.stamps / card.total) * 100}%`, borderRadius: 99, background: "rgba(255,255,255,0.8)" }} />
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{card.stamps}/{card.total}</p>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{card.reward}</p>
        </div>
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28" opacity={0.35}>
          <rect x="2" y="2" width="10" height="10" rx="2" stroke="white" strokeWidth="1.5"/>
          <rect x="16" y="2" width="10" height="10" rx="2" stroke="white" strokeWidth="1.5"/>
          <rect x="2" y="16" width="10" height="10" rx="2" stroke="white" strokeWidth="1.5"/>
          <rect x="16" y="16" width="10" height="10" rx="2" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>
    </div>
  );
}

export default function IndustryGrid() {
  // order[0]=front card index, order[1]=middle, order[2]=back
  const [order, setOrder]     = useState([0, 1, 2]);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      // 1. Trigger exit animation on the front card
      setExiting(true);
      // 2. After it animates out, rotate the deck
      setTimeout(() => {
        setOrder(([f, m, b]) => {
          const next = (f + 3) % CARDS.length;
          return [m, b, next];
        });
        setExiting(false);
      }, 400);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="w-full mt-16 fade-up-delay">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left — copy */}
          <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
            <div
              className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold w-fit mx-auto lg:mx-0"
              style={{ background: "rgba(201,123,58,0.1)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.22)" }}
            >
              Works for any business
            </div>

            <h2 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: "#111827" }}>
              You don&apos;t have a{" "}
              <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                coffee shop problem
              </span>{" "}
              or a{" "}
              <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                gym problem.
              </span>
            </h2>

            <h2 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: "#111827" }}>
              You have a{" "}
              <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                repeat customer problem.
              </span>
            </h2>

            <div className="flex flex-wrap gap-2">
              {HINTS.map((name, i) => (
                <span key={i} className="rounded-full px-3 py-1 text-sm font-medium" style={{ background: "#faf9f7", border: "1px solid rgba(0,0,0,0.08)", color: "#374151" }}>
                  {name}
                </span>
              ))}
              <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: "rgba(201,123,58,0.08)", border: "1px solid rgba(201,123,58,0.2)", color: "#c97b3a" }}>
                + many more
              </span>
            </div>
          </div>

          {/* Right — cycling card stack */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div style={{ width: "clamp(280px, 35vw, 400px)", height: "clamp(220px, 26vw, 300px)", position: "relative" }}>
              {/* Paint back → middle → front so front is on top */}
              <LoyaltyCard card={CARDS[order[2]]} slot={2} exiting={false} />
              <LoyaltyCard card={CARDS[order[1]]} slot={1} exiting={false} />
              <LoyaltyCard card={CARDS[order[0]]} slot={0} exiting={exiting} />
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 6 }}>
              {CARDS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === order[0] ? 18 : 6,
                    height: 6,
                    borderRadius: 99,
                    background: i === order[0] ? "#c97b3a" : "rgba(0,0,0,0.12)",
                    transition: "width 0.3s ease, background 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

        </div>
    </section>
  );
}

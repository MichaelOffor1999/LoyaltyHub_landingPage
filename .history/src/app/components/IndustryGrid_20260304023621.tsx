"use client";
import { useState } from "react";

const HINTS = ["coffee shops", "gyms", "salons", "restaurants", "barbershops", "nail bars", "bakeries", "spas", "pet groomers", "yoga studios", "boutiques", "car washes"];

const CARDS = [
  { biz: "Coffee Ritual",  customer: "James O.",  reward: "Free Coffee",    stamps: 4, total: 5,  gradient: "linear-gradient(140deg,#7a3e12,#c97b3a)", checkColor: "#c97b3a" },
  { biz: "PureMotion Gym", customer: "Sarah K.",  reward: "Free Month",     stamps: 7, total: 10, gradient: "linear-gradient(140deg,#1a3a5c,#2e6da4)", checkColor: "#2e6da4" },
  { biz: "Luxe Nails",     customer: "Priya M.",  reward: "Free Treatment", stamps: 3, total: 6,  gradient: "linear-gradient(140deg,#4a1a5c,#9b4fc8)", checkColor: "#9b4fc8" },
];

type CardData = typeof CARDS[0];

function LoyaltyCard({
  card,
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isActive,
}: {
  card: CardData;
  style: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        width: "clamp(240px, 30vw, 340px)",
        borderRadius: 20,
        background: card.gradient,
        padding: "18px 20px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
        position: "absolute",
        top: 0,
        left: 0,
        cursor: "pointer",
        outline: isActive ? "2px solid rgba(255,255,255,0.5)" : "none",
        transition: "transform 0.5s cubic-bezier(0.34,1.1,0.64,1), opacity 0.45s ease, filter 0.4s ease",
        ...style,
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

// Default stacked positions: back (0) → middle (1) → front (2)
const DEFAULT_SLOTS: React.CSSProperties[] = [
  // back card — offset bottom-right, darkened
  { transform: "translateX(20px) translateY(16px) rotate(4deg) scale(0.93)", zIndex: 1, opacity: 0.6, filter: "grayscale(50%)" },
  // middle card
  { transform: "translateX(10px) translateY(8px) rotate(2deg) scale(0.97)", zIndex: 2, opacity: 0.8, filter: "grayscale(20%)" },
  // front card — straight, full colour
  { transform: "translateX(0px) translateY(0px) rotate(0deg) scale(1)", zIndex: 3, opacity: 1, filter: "none" },
];

function StackedCards() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive]   = useState<number | null>(null);

  const focused = hovered ?? active;

  function getStyle(index: number): React.CSSProperties {
    const base = { ...DEFAULT_SLOTS[index] };

    // When back card (index 0) is focused, fan the others away
    if (focused === 0) {
      if (index === 1) return { ...base, transform: "translateX(28px) translateY(80px) rotate(6deg) scale(0.97)", zIndex: 2, opacity: 1, filter: "none" };
      if (index === 2) return { ...base, transform: "translateX(50px) translateY(140px) rotate(-2deg) scale(1)", zIndex: 3, opacity: 1, filter: "none" };
    }
    // When middle card (index 1) is focused, fan front away
    if (focused === 1) {
      if (index === 2) return { ...base, transform: "translateX(40px) translateY(110px) rotate(-3deg) scale(1)", zIndex: 3, opacity: 1, filter: "none" };
    }
    // When front card (index 2) is focused, lift it slightly
    if (focused === 2) {
      if (index === 2) return { ...base, transform: "translateX(0px) translateY(-10px) rotate(0deg) scale(1.02)", zIndex: 3, opacity: 1, filter: "none" };
    }
    // Reveal full colour for any focused card
    if (focused === index) {
      return { ...base, filter: "none", opacity: 1 };
    }

    return base;
  }

  const handleTap = (index: number) => {
    const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (isTouchDevice) setActive(active === index ? null : index);
  };

  return (
    // height accommodates the fanned-out spread
    <div style={{ width: "clamp(260px, 32vw, 360px)", height: "clamp(290px, 34vw, 360px)", position: "relative" }}>
      {/* Render back → front so front sits on top */}
      {[0, 1, 2].map((index) => (
        <LoyaltyCard
          key={index}
          card={CARDS[index]}
          style={getStyle(index)}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleTap(index)}
          isActive={active === index}
        />
      ))}
    </div>
  );
}

export default function IndustryGrid() {
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

          <h2 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: "var(--foreground)" }}>
            You don&apos;t have a{" "}
            <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              coffee shop problem
            </span>{" "}
            or a{" "}
            <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              gym problem.
            </span>
          </h2>

          <h2 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: "var(--foreground)" }}>
            You have a{" "}
            <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              repeat customer problem.
            </span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {HINTS.map((name, i) => (
              <span key={i} className="rounded-full px-3 py-1 text-sm font-medium" style={{ background: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--text-sub)" }}>
                {name}
              </span>
            ))}
            <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: "rgba(201,123,58,0.08)", border: "1px solid rgba(201,123,58,0.2)", color: "#c97b3a" }}>
              + many more
            </span>
          </div>
        </div>

        {/* Right — interactive stacked cards */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <StackedCards />
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Hover the cards to explore
          </p>
        </div>

      </div>
    </section>
  );
}

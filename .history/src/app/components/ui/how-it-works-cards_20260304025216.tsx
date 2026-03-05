"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Loyalty stamp card ──────────────────────────────────────────────────────

interface StampDotProps {
  filled: boolean;
  icon?: boolean;
}

function StampDot({ filled, icon }: StampDotProps) {
  return (
    <div
      className={cn(
        "size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
        filled
          ? "bg-white/25 shadow-inner"
          : "bg-white/10 border border-white/20",
      )}
    >
      {filled && !icon && (
        <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {filled && icon && (
        <svg className="size-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
        </svg>
      )}
    </div>
  );
}

interface HowItWorksCardProps {
  className?: string;
  step: string;
  gradient: string;
  customerName: string;
  businessName: string;
  stamps: number;
  totalStamps: number;
  reward: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
}

function HowItWorksCard({
  className,
  step,
  gradient,
  customerName,
  businessName,
  stamps,
  totalStamps,
  reward,
  onHover,
  onLeave,
  isActive,
  onTap,
}: HowItWorksCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && !isActive) {
      e.preventDefault();
      onTap?.();
    }
  };

  const progress = stamps / totalStamps;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "relative flex h-[200px] w-[320px] sm:w-[380px] select-none flex-col justify-between",
        "rounded-2xl px-5 py-4 cursor-pointer",
        "transition-all duration-500",
        "shadow-[0_8px_32px_rgba(0,0,0,0.18)]",
        isActive && "ring-2 ring-white/40",
        className,
      )}
      style={{ background: gradient }}
    >
      {/* Step badge */}
      <div
        className="absolute -top-2.5 -left-2.5 size-8 rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg"
        style={{ background: "linear-gradient(135deg,#c97b3a,#e8944a)", color: "#fff" }}
      >
        {step}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">{customerName}</p>
          <p className="text-lg font-black text-white leading-tight">{businessName}</p>
        </div>
        <span className="rounded-full bg-[#22c55e] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow">
          ACTIVE
        </span>
      </div>

      {/* Stamps */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalStamps }).map((_, i) => (
          <StampDot key={i} filled={i < stamps} icon={i === stamps - 1 && stamps > 0} />
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-white/60 transition-all duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-white">{stamps}/{totalStamps}</span>
            <p className="text-[11px] text-white/60 font-medium leading-none mt-0.5">{reward}</p>
          </div>
          <div className="grid grid-cols-2 gap-0.5 opacity-40">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="size-3 rounded-sm border border-white/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stacked wrapper ─────────────────────────────────────────────────────────

const CARDS: Omit<HowItWorksCardProps, "onHover" | "onLeave" | "isActive" | "onTap" | "className">[] = [
  {
    step: "01",
    gradient: "linear-gradient(135deg, #1e4d2b 0%, #2d7a45 100%)",
    customerName: "Leo T.",
    businessName: "Barista & Co",
    stamps: 2,
    totalStamps: 4,
    reward: "Free Brunch",
  },
  {
    step: "02",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)",
    customerName: "Sarah K.",
    businessName: "PureMotion Gym",
    stamps: 7,
    totalStamps: 10,
    reward: "Free Month",
  },
  {
    step: "03",
    gradient: "linear-gradient(135deg, #5b1e6e 0%, #9b3dbd 100%)",
    customerName: "Priya M.",
    businessName: "Luxe Nails",
    stamps: 3,
    totalStamps: 6,
    reward: "Free Treatment",
  },
];

export default function HowItWorksCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const focused = hoveredIndex ?? activeIndex;

  const getCardClass = (index: number, base: string) => {
    // Back card (0) hovered → fan middle (1) and front (2) away
    if (focused === 0 && index === 1)
      return base + " !translate-y-20 sm:!translate-y-28 !translate-x-12 sm:!translate-x-20";
    if (focused === 0 && index === 2)
      return base + " !translate-y-28 sm:!translate-y-44 !translate-x-20 sm:!translate-x-36";
    // Middle card (1) hovered → fan front (2) away
    if (focused === 1 && index === 2)
      return base + " !translate-y-24 sm:!translate-y-36 !translate-x-20 sm:!translate-x-36";
    return base;
  };

  const defaultClasses = [
    // Back card
    "[grid-area:stack] hover:-translate-y-8 before:absolute before:w-full before:h-full before:inset-0 before:rounded-2xl before:content-[''] before:bg-background/50 before:transition-opacity before:duration-500 hover:before:opacity-0 before:pointer-events-none grayscale-[60%] hover:grayscale-0",
    // Middle card
    "[grid-area:stack] translate-x-6 sm:translate-x-10 translate-y-5 sm:translate-y-8 hover:-translate-y-1 before:absolute before:w-full before:h-full before:inset-0 before:rounded-2xl before:content-[''] before:bg-background/35 before:transition-opacity before:duration-500 hover:before:opacity-0 before:pointer-events-none grayscale-[30%] hover:grayscale-0",
    // Front card (no overlay, full colour)
    "[grid-area:stack] translate-x-12 sm:translate-x-20 translate-y-10 sm:translate-y-16 hover:translate-y-8 sm:hover:translate-y-12",
  ];

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {CARDS.map((card, index) => (
        <HowItWorksCard
          key={index}
          {...card}
          className={getCardClass(index, defaultClasses[index])}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
          isActive={activeIndex === index}
          onTap={() => setActiveIndex(index === activeIndex ? null : index)}
        />
      ))}
    </div>
  );
}

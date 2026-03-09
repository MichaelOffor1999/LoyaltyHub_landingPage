"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Card data matched to each step ──────────────────────────────── */

const STEPS = [
  {
    step: "01",
    title: "Create your program",
    desc: "Set your rewards, tiers, and branding in minutes.",
    card: {
      gradient: "linear-gradient(135deg, #1e4d2b 0%, #2d7a45 100%)",
      customerName: "Leo T.",
      businessName: "Barista & Co",
      stamps: 2,
      totalStamps: 4,
      reward: "Free Brunch",
    },
  },
  {
    step: "02",
    title: "Invite your customers",
    desc: "Customers download the free app and get their own QR code — you scan it at the till to stamp their card.",
    card: {
      gradient: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)",
      customerName: "Sarah K.",
      businessName: "PureMotion Gym",
      stamps: 7,
      totalStamps: 10,
      reward: "Free Month",
    },
  },
  {
    step: "03",
    title: "Watch them return",
    desc: "Customers earn points and redeem rewards — you watch revenue grow.",
    card: {
      gradient: "linear-gradient(135deg, #5b1e6e 0%, #9b3dbd 100%)",
      customerName: "Priya M.",
      businessName: "Luxe Nails",
      stamps: 3,
      totalStamps: 6,
      reward: "Free Treatment",
    },
  },
];

/* ─── Small stamp dot ─────────────────────────────────────────────── */

function StampDot({ filled, icon }: { filled: boolean; icon?: boolean }) {
  return (
    <div
      className={cn(
        "size-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
        filled ? "bg-white/25 shadow-inner" : "bg-white/10 border border-white/20"
      )}
    >
      {filled && !icon && (
        <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {filled && icon && (
        <svg className="size-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
        </svg>
      )}
    </div>
  );
}

/* ─── Mini loyalty card for mobile ────────────────────────────────── */

function MiniCard({
  gradient,
  customerName,
  businessName,
  stamps,
  totalStamps,
  reward,
  visible,
}: {
  gradient: string;
  customerName: string;
  businessName: string;
  stamps: number;
  totalStamps: number;
  reward: string;
  visible: boolean;
}) {
  const progress = stamps / totalStamps;

  return (
    <div
      className="w-full rounded-2xl px-4 py-3 flex flex-col justify-between gap-2.5 transition-all duration-700 ease-out"
      style={{
        background: gradient,
        boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
        maxHeight: visible ? 200 : 0,
        marginTop: visible ? 12 : 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
            {customerName}
          </p>
          <p className="text-base font-black text-white leading-tight">{businessName}</p>
        </div>
        <span className="rounded-full bg-[#22c55e] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow">
          ACTIVE
        </span>
      </div>

      {/* Stamps */}
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: totalStamps }).map((_, i) => (
          <StampDot key={i} filled={i < stamps} icon={i === stamps - 1 && stamps > 0} />
        ))}
      </div>

      {/* Progress bar + count */}
      <div>
        <div className="h-1 w-full rounded-full bg-white/15 overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full bg-white/60 transition-all duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-white">
              {stamps}/{totalStamps}
            </span>
            <p className="text-[10px] text-white/60 font-medium leading-none mt-0.5">
              {reward}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-0.5 opacity-40">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="size-2.5 rounded-sm border border-white/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Single step with intersection observer ──────────────────────── */

function StepWithCard({
  step,
  title,
  desc,
  card,
  index,
  isLast,
}: {
  step: string;
  title: string;
  desc: string;
  card: (typeof STEPS)[0]["card"];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 transition-all duration-500"
          style={{
            background:
              index === 1
                ? "linear-gradient(135deg, #c97b3a, #e8944a)"
                : "rgba(201,123,58,0.12)",
            color: index === 1 ? "#fff" : "#e8944a",
            boxShadow:
              index === 1 ? "0 4px 12px rgba(201,123,58,0.3)" : "none",
          }}
        >
          {step}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 my-1"
            style={{ background: "rgba(201,123,58,0.25)" }}
          />
        )}
      </div>

      {/* Content + card */}
      <div className={isLast ? "pb-0 pt-1" : "pb-6 pt-1"}>
        <span
          className="text-[10px] font-bold tracking-wider uppercase"
          style={{ color: "#e8944a" }}
        >
          Step {step}
        </span>
        <h3
          className="text-base font-bold mt-0.5"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm font-medium mt-1 leading-relaxed"
          style={{ color: "var(--text-sub)" }}
        >
          {desc}
        </p>

        {/* Loyalty card — slides in when step is in view */}
        <MiniCard {...card} visible={inView} />
      </div>
    </div>
  );
}

/* ─── Main mobile component ───────────────────────────────────────── */

export default function MobileHowItWorks() {
  return (
    <div className="md:hidden">
      <div className="flex flex-col gap-0 px-2">
        {STEPS.map((s, i) => (
          <StepWithCard
            key={i}
            step={s.step}
            title={s.title}
            desc={s.desc}
            card={s.card}
            index={i}
            isLast={i === STEPS.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

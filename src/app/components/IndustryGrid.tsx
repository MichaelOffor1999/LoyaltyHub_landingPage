"use client";

import { useState, useEffect, useRef } from "react";
import {
  Scissors,
  Hand,
  Flower2,
  SprayCan,
  Heart,
  Eye,
} from "lucide-react";

const DURATION = 6000; // ms per tab

const industries = [
  {
    title: "Barbers",
    icon: Scissors,
    tagline: "Fill your chair every single day",
    description:
      "Every 6th cut is on you. Clients book ahead to claim their reward — filling your chair automatically and predictably.",
    bullets: [
      "Visit-based rewards that drive rebooking",
      "At-risk alerts when a regular hasn\u2019t booked",
      "Referral tracking to reward word-of-mouth",
    ],
  },
  {
    title: "Hair Salons",
    icon: SprayCan,
    tagline: "Turn first-time clients into lifelong regulars",
    description:
      "Reward colour appointments, blowouts, and treatments. Clients who earn towards their next visit rebook before they leave.",
    bullets: [
      "Service-based stamp cards with visual progress",
      "Automated reminders when roots are due",
      "VIP tiers for your highest-spending clients",
    ],
  },
  {
    title: "Nail Techs",
    icon: Hand,
    tagline: "Clients who earn rewards rebook 3\u00d7 more",
    description:
      "Offer a free set after 5 appointments and watch bookings soar. Nail clients love collecting — give them a reason to stay loyal.",
    bullets: [
      "Treatment-based stamp cards with visual progress",
      "Push reminders when it\u2019s time for their next fill",
      "Birthday rewards that keep clients coming back",
    ],
  },
  {
    title: "Spas & Wellness",
    icon: Flower2,
    tagline: "High-value clients deserve high-value rewards",
    description:
      "Tier-based loyalty keeps your VIPs feeling seen and returning. Premium experiences should come with premium recognition.",
    bullets: [
      "Gold / Platinum tiers based on spend and visits",
      "Complimentary add-ons for your most loyal guests",
      "Personalised offers based on treatment history",
    ],
  },
  {
    title: "Lash & Brow",
    icon: Eye,
    tagline: "Keep your books full between infills",
    description:
      "Lash and brow clients need regular maintenance — reward that habit. Fill gaps in your diary with automated nudges and loyalty perks.",
    bullets: [
      "Infill reminders that drive consistent rebooking",
      "Loyalty stamps for lash lifts, tints, and extensions",
      "Track client preferences and appointment history",
    ],
  },
  {
    title: "Skincare & Facials",
    icon: Heart,
    tagline: "Build skincare routines your clients stick to",
    description:
      "Facials and skin treatments work best with consistency. Reward regular visits and watch client retention soar.",
    bullets: [
      "Course-based rewards for treatment plans",
      "Seasonal offer campaigns to fill quiet periods",
      "Real-time insight into visit frequency and trends",
    ],
  },
];

export default function IndustryGrid() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const goTo = (idx: number) => {
    setContentVisible(false);
    setTimeout(() => {
      setActive(idx);
      setProgress(0);
      setContentVisible(true);
    }, 180);
  };

  // Auto-scroll pill strip to keep active tab visible
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return;
    const btn = strip.children[active] as HTMLElement | undefined;
    if (!btn) return;
    const left = btn.offsetLeft - strip.offsetWidth / 2 + btn.offsetWidth / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (100 / (DURATION / 50)), 100));
    }, 50);

    timerRef.current = setTimeout(() => {
      goTo((active + 1) % industries.length);
    }, DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused]);

  const o = industries[active];
  const Icon = o.icon;

  return (
    <section
      className="w-full mt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="text-center">
          <div
            className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            style={{
              background: "rgba(201,123,58,0.1)",
              color: "#c97b3a",
              border: "1px solid rgba(201,123,58,0.22)",
            }}
          >
            Built for self-care
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            Your clients love what you do.
          </h2>
          <h2
            className="text-3xl sm:text-4xl font-black leading-tight mt-1"
            style={{ color: "var(--foreground)" }}
          >
            Give them a reason to{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #c97b3a, #e8944a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              keep coming back.
            </span>
          </h2>
        </div>

        {/* Tab strip — horizontally scrollable on mobile */}
        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 px-1 -mx-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {industries.map((ind, i) => {
            const TabIcon = ind.icon;
            const isActive = i === active;
            return (
              <button
                key={ind.title}
                onClick={() => goTo(i)}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0"
                style={{
                  scrollSnapAlign: "center",
                  background: isActive
                    ? "linear-gradient(135deg, #c97b3a, #e8944a)"
                    : "rgba(255,255,255,0.04)",
                  color: isActive ? "#fff" : "rgba(240,236,230,0.55)",
                  border: isActive
                    ? "1px solid rgba(201,123,58,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isActive
                    ? "0 2px 8px rgba(201,123,58,0.25)"
                    : "none",
                }}
              >
                <TabIcon size={15} strokeWidth={2.2} />
                <span className="hidden sm:inline">{ind.title}</span>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 3, background: "rgba(201,123,58,0.1)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #c97b3a, #e8944a)",
              transition: "width 50ms linear",
            }}
          />
        </div>

        {/* Content panel */}
        <div
          className="rounded-2xl p-8 sm:p-10 transition-all duration-200"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(8px)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            minHeight: 280,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Left: icon + text */}
            <div className="flex-1 flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,123,58,0.12), rgba(232,148,74,0.08))",
                    border: "1px solid rgba(201,123,58,0.18)",
                  }}
                >
                  <Icon size={20} strokeWidth={2} style={{ color: "#c97b3a" }} />
                </div>
                <div>
                  <h3
                    className="text-lg sm:text-xl font-extrabold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {o.title}
                  </h3>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#c97b3a" }}
                  >
                    {o.tagline}
                  </p>
                </div>
              </div>

              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "rgba(240,236,230,0.75)" }}
              >
                {o.description}
              </p>
            </div>

            {/* Right: bullets */}
            <div className="sm:w-[280px] flex flex-col gap-2.5 shrink-0 items-center sm:items-start">
              {o.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: "rgba(201,123,58,0.1)",
                      border: "1px solid rgba(201,123,58,0.2)",
                    }}
                  >
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#c97b3a" }}
                    >
                      ✓
                    </span>
                  </div>
                  <span
                    className="text-sm leading-snug"
                    style={{ color: "#4b5563" }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <p
          className="text-xs font-medium text-center"
          style={{ color: "rgba(240,236,230,0.4)" }}
        >
          Click any industry above — clientIn works for all of them
        </p>
      </div>
    </section>
  );
}

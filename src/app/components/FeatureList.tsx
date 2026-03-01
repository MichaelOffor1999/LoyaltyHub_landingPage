"use client";
import { useState, useEffect, useRef } from "react";

const DURATION = 7000; // ms per slide

const outcomes = [
  {
    pain: "You're losing regulars and don't know why",
    solution: "Clienty tells you exactly which customers haven't come back — before they're gone for good.",
    outcome: "Bring back customers you'd have lost",
    bullets: [
      "Automatic at-risk alerts when a regular goes quiet",
      "One-tap targeted offer to pull them back in",
      "See visit history for every individual customer",
    ],
  },
  {
    pain: "You have 40 regulars. You can't contact a single one of them.",
    solution: "Clienty gives you a direct line to every customer who's ever walked through your door — so when it's a quiet Tuesday, you can actually do something about it.",
    outcome: "Own your customer relationships",
    bullets: [
      "Send targeted offers directly to customers in the app",
      "No relying on Instagram reach or hoping they see your post",
      "Re-engage quiet regulars with one tap — before they forget you",
    ],
  },
  {
    pain: "You're giving discounts to customers who were coming back anyway.",
    solution: "Clienty shows you exactly who needs an incentive and who doesn't — so every offer you send earns its cost back, and then some.",
    outcome: "Spend less on discounts, make more from loyalty",
    bullets: [
      "See which customers are at risk vs. reliably returning",
      "Target offers only at the customers who actually need the nudge",
      "Track which offers drove real visits — not just opens",
    ],
  },
];

export default function FeatureList() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    setContentVisible(false);
    setTimeout(() => {
      setActive(idx);
      setProgress(0);
      setContentVisible(true);
    }, 220);
  };

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
      goTo((active + 1) % outcomes.length);
    }, DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [active, paused]);

  const o = outcomes[active];

  return (
    <section className="w-full mt-8 mb-8">
      <div
        className="w-full rounded-3xl p-8 sm:p-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
          >
            Why businesses choose Clienty
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#111827" }}>
            Built around the problems<br />you actually have
          </h2>
        </div>

        {/* Tab layout */}
        <div className="flex flex-col sm:flex-row gap-5 items-stretch">

          {/* Left: tab selectors */}
          <div className="flex flex-col gap-3 sm:w-72 shrink-0">
            {outcomes.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="text-left rounded-2xl px-5 py-4 relative overflow-hidden"
                  style={{
                    background: isActive ? "rgba(201,123,58,0.07)" : "rgba(0,0,0,0.02)",
                    border: isActive ? "1px solid rgba(201,123,58,0.3)" : "1px solid rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    transition: "background 0.25s ease, border-color 0.25s ease",
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        height: 3,
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #c97b3a, #e8944a)",
                        borderRadius: "0 2px 0 12px",
                        transition: "width 0.05s linear",
                      }}
                    />
                  )}
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ color: isActive ? "#111827" : "#9ca3af", transition: "color 0.25s ease" }}
                  >
                    &ldquo;{item.pain}&rdquo;
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: content panel */}
          <div
            className="flex-1 rounded-2xl p-6 flex flex-col justify-between"
            style={{
              background: "rgba(201,123,58,0.04)",
              border: "1px solid rgba(201,123,58,0.15)",
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.22s ease, transform 0.22s ease",
            }}
          >
            <div className="flex flex-col gap-4">
              <div
                className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: "rgba(232,148,74,0.15)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.2)" }}
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r="6" fill="#e8944a" fillOpacity="0.2"/>
                  <path d="M4 6l1.5 1.5L8 4" stroke="#e8944a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {o.outcome}
              </div>

              <p className="text-base leading-relaxed font-medium" style={{ color: "#374151" }}>
                {o.solution}
              </p>

              <ul className="flex flex-col gap-2.5 mt-1">
                {o.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-sm"
                    style={{
                      color: "#374151",
                      opacity: contentVisible ? 1 : 0,
                      transform: contentVisible ? "translateY(0)" : "translateY(6px)",
                      transition: `opacity 0.3s ease ${j * 80 + 120}ms, transform 0.3s ease ${j * 80 + 120}ms`,
                    }}
                  >
                    <svg width="17" height="17" fill="none" viewBox="0 0 17 17" className="mt-0.5 shrink-0">
                      <circle cx="8.5" cy="8.5" r="8.5" fill="#c97b3a" fillOpacity="0.13"/>
                      <path d="M5.5 8.5l2.5 2.5 4-4" stroke="#e8944a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress dots + pause indicator */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex gap-2">
                {outcomes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      width: i === active ? 20 : 7,
                      height: 7,
                      borderRadius: 99,
                      background: i === active ? "#c97b3a" : "rgba(0,0,0,0.12)",
                      transition: "width 0.3s ease, background 0.3s ease",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
              {paused && (
                <span className="text-xs font-medium" style={{ color: "#9ca3af" }}>
                  paused
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";

export default function AnalyticsSpotlight() {
  return (
    <section className="w-full mt-8 mb-8">
      <div className="w-full rounded-3xl p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div
          className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
          style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
        >
          Customer Intelligence
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
          Know your customers<br />better than ever before
        </h2>
        <p className="text-sm sm:text-base max-w-xl mx-auto font-semibold" style={{ color: "rgba(240,236,230,0.75)" }}>
          Most businesses are flying blind. clientIn gives you real data on exactly who walks through your door, what keeps them coming back, and who&apos;s about to leave.
        </p>
      </div>

      {/* Two-column layout: insights list + mock dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

        {/* Left: insight callouts — matched to real app features */}
        <div className="flex flex-col gap-3">
          {/* Mobile: compact list in one card */}
          <div className="sm:hidden card rounded-2xl p-3">
            {[
              {
                icon: (
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                    <path d="M5 14l3-4 3 2 4-6" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: "Monthly comparison at a glance",
              },
              {
                icon: (
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                    <path d="M10 5v6M7 8l3-3 3 3" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: "See who's active right now",
              },
              {
                icon: (
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="10" fill="#e8944a" fillOpacity="0.15"/>
                    <path d="M10 6v3.5M10 13h.01" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                label: "Catch at-risk customers before they leave",
              },
              {
                icon: (
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                    <rect x="4" y="12" width="2.5" height="3" rx="0.5" fill="#e8944a"/>
                    <rect x="7.5" y="9" width="2.5" height="6" rx="0.5" fill="#e8944a"/>
                    <rect x="11" y="7" width="2.5" height="8" rx="0.5" fill="#e8944a"/>
                    <rect x="14.5" y="5" width="2.5" height="10" rx="0.5" fill="#e8944a"/>
                  </svg>
                ),
                label: "Visit trends, day by day",
              },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 py-2.5 ${i < 3 ? "border-b" : ""}`} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="shrink-0">{item.icon}</div>
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Desktop: individual cards with descriptions */}
          {[
            {
              icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                  <path d="M5 14l3-4 3 2 4-6" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              label: "Monthly comparison at a glance",
              desc: "Instantly compare this month vs. last — visits, active customers, and growth trends all in one view.",
            },
            {
              icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                  <path d="M10 5v6M7 8l3-3 3 3" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              label: "See who's active right now",
              desc: "Track total customers, who's visited this month, and loyalty completions — all updating in real time.",
            },
            {
              icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#e8944a" fillOpacity="0.15"/>
                  <path d="M10 6v3.5M10 13h.01" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ),
              label: "Catch at-risk customers before they leave",
              desc: "Set your own risk threshold (e.g. 30 days). Get flagged when regulars go quiet — At Risk, High Risk, and average days since last visit.",
            },
            {
              icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                  <rect x="4" y="12" width="2.5" height="3" rx="0.5" fill="#e8944a"/>
                  <rect x="7.5" y="9" width="2.5" height="6" rx="0.5" fill="#e8944a"/>
                  <rect x="11" y="7" width="2.5" height="8" rx="0.5" fill="#e8944a"/>
                  <rect x="14.5" y="5" width="2.5" height="10" rx="0.5" fill="#e8944a"/>
                </svg>
              ),
              label: "Visit trends, day by day",
              desc: "See your busiest days of the week with a visual visit trend chart — spot patterns and plan your staffing and promotions.",
            },
          ].map((item, i) => (
            <div key={i} className="hidden sm:flex card card-hover rounded-2xl p-3 sm:p-5 gap-3 sm:gap-4 items-start">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <div className="text-sm font-bold mb-0 sm:mb-1" style={{ color: "var(--foreground)" }}>{item.label}</div>
                <div className="text-sm leading-relaxed" style={{ color: "rgba(240,236,230,0.55)" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: real app screenshot inside phone frame */}
        <div className="flex items-center justify-center">
          {/* Phone outline */}
          <div
            className="relative w-full max-w-[300px] mx-auto p-[10px]"
            style={{
              borderRadius: 44,
              background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
              boxShadow: "0 0 0 1.5px #3a3a3a, 0 0 0 3px #111, 0 20px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* Side buttons */}
            <div className="absolute -left-[3px] top-[80px] w-[3px] h-8 rounded-l-sm" style={{ background: "#2a2a2a" }} />
            <div className="absolute -left-[3px] top-[124px] w-[3px] h-10 rounded-l-sm" style={{ background: "#2a2a2a" }} />
            <div className="absolute -left-[3px] top-[172px] w-[3px] h-10 rounded-l-sm" style={{ background: "#2a2a2a" }} />
            <div className="absolute -right-[3px] top-[120px] w-[3px] h-14 rounded-r-sm" style={{ background: "#2a2a2a" }} />

            {/* Screen */}
            <div style={{ borderRadius: 36, overflow: "hidden" }}>
              <Image
                src="/insight-2.png"
                alt="Customer Insights dashboard"
                width={400}
                height={800}
                className="w-full h-auto"
                style={{ display: "block" }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

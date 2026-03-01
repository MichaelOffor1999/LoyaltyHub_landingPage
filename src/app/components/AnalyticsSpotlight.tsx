export default function AnalyticsSpotlight() {
  return (
    <section className="w-full mt-8 mb-8">
      <div className="w-full rounded-3xl p-6 sm:p-8" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div
          className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
          style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
        >
          Customer Intelligence
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: "#111827" }}>
          Know your customers<br />better than ever before
        </h2>
        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "#6b7280" }}>
          Most businesses are flying blind. Clienty gives you real data on exactly who walks through your door, what keeps them coming back, and who&apos;s about to leave.
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
              <div key={i} className={`flex items-center gap-3 py-2.5 ${i < 3 ? "border-b" : ""}`} style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <div className="shrink-0">{item.icon}</div>
                <span className="text-sm font-semibold" style={{ color: "#111827" }}>{item.label}</span>
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
                <div className="text-sm font-bold mb-0 sm:mb-1" style={{ color: "#111827" }}>{item.label}</div>
                <div className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: mock analytics dashboard — matches real Customer Insights screen */}
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#0d1117", border: "1px solid rgba(201,123,58,0.2)", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>

          {/* Screen title */}
          <div className="text-center">
            <span className="text-sm font-bold" style={{ color: "#fdf8f3" }}>Customer Insights</span>
          </div>

          {/* Monthly Comparison card */}
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-bold mb-2" style={{ color: "#fdf8f3" }}>Monthly Comparison</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>This Month</p>
                <p className="text-xl font-black" style={{ color: "#fdf8f3" }}>47</p>
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.35)" }}>visits</p>
              </div>
              {/* Trend arrow icon */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                  <path d="M6 20l7-8 4 4 6-8" stroke="rgba(253,248,243,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 8h5v5" stroke="rgba(253,248,243,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>Last Month</p>
                <p className="text-xl font-black" style={{ color: "rgba(253,248,243,0.45)" }}>32</p>
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.3)" }}>visits</p>
              </div>
            </div>
          </div>

          {/* 2×2 Stat Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Total Customers */}
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                  <circle cx="6" cy="6" r="2.5" stroke="rgba(253,248,243,0.5)" strokeWidth="1.3"/>
                  <circle cx="12" cy="6" r="2.5" stroke="rgba(253,248,243,0.5)" strokeWidth="1.3"/>
                  <path d="M1 16c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="rgba(253,248,243,0.5)" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M12 11c2.8 0 5 2.2 5 5" stroke="rgba(253,248,243,0.3)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span className="text-xs font-bold rounded-md px-2 py-0.5" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                  <svg width="10" height="10" fill="none" viewBox="0 0 10 10" style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }}>
                    <path d="M2 7l3-4 3 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <p className="text-lg font-black" style={{ color: "#fdf8f3" }}>284</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>Total Customers</p>
                <svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M3 5h4M5 3l2 2-2 2" stroke="rgba(253,248,243,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            {/* Active This Month */}
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                  <path d="M3 12l3-4 3 2 3-4 3 3" stroke="rgba(253,248,243,0.5)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-bold rounded-md px-2 py-0.5" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>78%</span>
              </div>
              <p className="text-lg font-black" style={{ color: "#fdf8f3" }}>221</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>Active This Month</p>
                <svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M3 5h4M5 3l2 2-2 2" stroke="rgba(253,248,243,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            {/* Completed Loyalty */}
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 15 }}>🏆</span>
                <span className="text-xs font-bold rounded-md px-2 py-0.5" style={{ background: "rgba(201,123,58,0.15)", color: "#e8944a" }}>12%</span>
              </div>
              <p className="text-lg font-black" style={{ color: "#fdf8f3" }}>34</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>Completed Loyalty</p>
                <svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M3 5h4M5 3l2 2-2 2" stroke="rgba(253,248,243,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            {/* Need Attention */}
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 15 }}>⚠️</span>
                <span className="text-xs font-bold rounded-md px-2 py-0.5" style={{ background: "rgba(234,179,8,0.15)", color: "#eab308" }}>Risk</span>
              </div>
              <p className="text-lg font-black" style={{ color: "#fdf8f3" }}>9</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.4)" }}>Need Attention</p>
                <svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M3 5h4M5 3l2 2-2 2" stroke="rgba(253,248,243,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* Visit Trend chart */}
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold" style={{ color: "#fdf8f3" }}>Visit Trend</p>
                <p className="text-xs" style={{ color: "rgba(253,248,243,0.35)" }}>Last 7 days</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <span className="text-xs font-semibold rounded-full px-3 py-1" style={{ background: "rgba(201,123,58,0.15)", color: "#e8944a", border: "1px solid rgba(201,123,58,0.25)" }}>
                  📊 Patterns
                </span>
                <span className="text-xs font-semibold rounded-full px-3 py-1 flex items-center gap-1" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(253,248,243,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8944a", display: "inline-block" }} /> Tap bar
                </span>
              </div>
            </div>
            <div className="flex items-end gap-2" style={{ height: 48 }}>
              {[35, 58, 45, 72, 90, 62, 48].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div style={{
                    width: "100%",
                    height: `${h * 0.65}px`,
                    borderRadius: 4,
                    background: i === 6
                      ? "linear-gradient(180deg, #e8944a, #c97b3a)"
                      : "rgba(201,123,58,0.22)",
                    transition: "height 0.3s ease",
                  }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                <span key={i} className="flex-1 text-center text-xs" style={{ color: i === 6 ? "#e8944a" : "rgba(253,248,243,0.3)", fontWeight: i === 6 ? 700 : 400 }}>{d}</span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-xs" style={{ color: "rgba(253,248,243,0.35)" }}>Total this week</span>
              <span className="text-sm font-bold" style={{ color: "#fdf8f3" }}>47 visits</span>
            </div>
          </div>

          {/* Bottom nav bar — matches real app */}
          <div className="flex items-center justify-around pt-3 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[
              { label: "Dashboard", icon: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="2" y="2" width="5.5" height="5.5" rx="1.5" stroke="rgba(253,248,243,0.35)" strokeWidth="1.3"/><rect x="10.5" y="2" width="5.5" height="5.5" rx="1.5" stroke="rgba(253,248,243,0.35)" strokeWidth="1.3"/><rect x="2" y="10.5" width="5.5" height="5.5" rx="1.5" stroke="rgba(253,248,243,0.35)" strokeWidth="1.3"/><rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1.5" stroke="rgba(253,248,243,0.35)" strokeWidth="1.3"/></svg>, active: false },
              { label: "Loyalty", icon: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" stroke="rgba(253,248,243,0.35)" strokeWidth="1.3" strokeLinejoin="round"/></svg>, active: false },
              { label: "Insights", icon: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M3 14l4-5 3 3 5-7" stroke="#e8944a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, active: true },
              { label: "Scanner", icon: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M2 5V3a1 1 0 011-1h2M13 2h2a1 1 0 011 1v2M16 13v2a1 1 0 01-1 1h-2M5 16H3a1 1 0 01-1-1v-2" stroke="rgba(253,248,243,0.35)" strokeWidth="1.3" strokeLinecap="round"/></svg>, active: false },
              { label: "Settings", icon: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="2.5" stroke="rgba(253,248,243,0.35)" strokeWidth="1.3"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M3.4 14.6l1.4-1.4M13.2 4.8l1.4-1.4" stroke="rgba(253,248,243,0.35)" strokeWidth="1.3" strokeLinecap="round"/></svg>, active: false },
            ].map((tab, i) => (
              <div key={i} className="flex flex-col items-center gap-1" style={{ cursor: "default" }}>
                {tab.icon}
                <span className="text-xs font-semibold" style={{ color: tab.active ? "#e8944a" : "rgba(253,248,243,0.35)" }}>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

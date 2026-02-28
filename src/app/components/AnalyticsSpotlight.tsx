export default function AnalyticsSpotlight() {
  return (
    <section className="w-full mt-8 mb-8">
      <div className="w-full rounded-3xl p-8 sm:p-10" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div className="text-center mb-14">
        <div
          className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
          style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
        >
          Customer Intelligence
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "#111827" }}>
          Know your customers<br />better than ever before
        </h2>
        <p className="text-base max-w-xl mx-auto" style={{ color: "#6b7280" }}>
          Most businesses are flying blind. LoyaltyHub gives you real data on exactly who walks through your door, what keeps them coming back, and who&apos;s about to leave.
        </p>
      </div>

      {/* Two-column layout: insights list + mock dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left: insight callouts */}
        <div className="flex flex-col gap-4">
          {[
            {
              icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                  <path d="M7 10l2.5 2.5L13 7" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              label: "Identify your VIPs instantly",
              desc: "See which customers visit most often and spend the most — so you can reward and retain them.",
            },
            {
              icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                  <path d="M10 6v4l2.5 2.5" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ),
              label: "Spot at-risk customers before they leave",
              desc: "Get notified when a loyal customer hasn't visited in a while — reach out before they go to a competitor.",
            },
            {
              icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                  <path d="M5 14l3-4 3 2 4-6" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              label: "Understand what rewards actually work",
              desc: "See which rewards drive the most repeat visits and double down on what your customers love.",
            },
            {
              icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="#c97b3a" fillOpacity="0.15"/>
                  <circle cx="10" cy="10" r="4" stroke="#e8944a" strokeWidth="1.8"/>
                  <path d="M10 6V10l2 2" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ),
              label: "Track visit frequency & spending patterns",
              desc: "Know your busiest days, your average transaction value, and how customer behaviour shifts over time.",
            },
          ].map((item, i) => (
            <div key={i} className="card rounded-2xl p-5 flex gap-4 items-start">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <div className="text-sm font-bold mb-1" style={{ color: "#111827" }}>{item.label}</div>
                <div className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: mock analytics dashboard — intentionally dark, looks like a real app */}
        <div className="rounded-3xl p-6 flex flex-col gap-5" style={{ background: "#0d1117", border: "1px solid rgba(201,123,58,0.2)", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
          {/* Dashboard header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: "#fdf8f3" }}>Customer Insights</span>
            <span
              className="text-xs rounded-full px-3 py-1 font-semibold"
              style={{ background: "rgba(201,123,58,0.15)", color: "#e8944a", border: "1px solid rgba(201,123,58,0.25)" }}
            >
              Last 30 days
            </span>
          </div>

          {/* Top stat row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: "284", l: "Active customers" },
              { n: "6.2×", l: "Avg. visits/month" },
              { n: "+23%", l: "Revenue growth" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-3 flex flex-col gap-1 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-xl font-extrabold" style={{ color: "#e8944a" }}>{s.n}</span>
                <span className="text-xs leading-tight" style={{ color: "rgba(253,248,243,0.5)" }}>{s.l}</span>
              </div>
            ))}
          </div>

          {/* At-risk alert */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: "rgba(232,148,74,0.08)", border: "1px solid rgba(232,148,74,0.2)" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18" className="mt-0.5 shrink-0">
              <circle cx="9" cy="9" r="9" fill="#e8944a" fillOpacity="0.15"/>
              <path d="M9 5.5v4M9 12h.01" stroke="#e8944a" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <div>
              <div className="text-sm font-semibold" style={{ color: "#e8944a" }}>14 customers at risk</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(253,248,243,0.5)" }}>Haven&apos;t visited in 28+ days. Send a re-engagement offer?</div>
            </div>
          </div>

          {/* Top customers list */}
          <div>
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "rgba(253,248,243,0.4)" }}>Top Customers This Month</div>
            <div className="flex flex-col gap-2">
              {[
                { name: "Sarah M.", visits: 14, badge: "VIP" },
                { name: "James O.", visits: 11, badge: null },
                { name: "Priya K.", visits: 9, badge: null },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg, #c97b3a, #e8944a)", color: "#fff" }}
                    >
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#fdf8f3" }}>{c.name}</span>
                    {c.badge && (
                      <span
                        className="text-xs rounded-full px-2 py-0.5 font-semibold"
                        style={{ background: "rgba(201,123,58,0.2)", color: "#e8944a" }}
                      >
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: "rgba(253,248,243,0.45)" }}>{c.visits} visits</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart (decorative) */}
          <div>
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "rgba(253,248,243,0.4)" }}>Visit Frequency This Week</div>
            <div className="flex items-end gap-1.5 h-12">
              {[40, 65, 50, 80, 95, 70, 55].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{
                  height: `${h}%`,
                  background: i === 4
                    ? "linear-gradient(180deg, #e8944a, #c97b3a)"
                    : "rgba(201,123,58,0.25)",
                }} />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <span key={i} className="flex-1 text-center text-xs" style={{ color: i === 4 ? "#e8944a" : "rgba(253,248,243,0.3)" }}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

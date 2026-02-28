"use client";

type Event = {
  icon: string;
  name: string;
  action: string;
  biz: string;
  ago: string;
  color: string;
};

const ROW1: Event[] = [
  { icon: "🎉", name: "Marcus T.",       action: "redeemed a free haircut",               biz: "MTB Barbershop",     ago: "just now", color: "#22c55e" },
  { icon: "⭐", name: "Dev P.",          action: "earned their 4th stamp",                biz: "MTB Barbershop",     ago: "5m ago",   color: "#e8944a" },
  { icon: "🏆", name: "Erin M.",         action: "completed her loyalty card",             biz: "Relief Barbershop",  ago: "12m ago",  color: "#f5b97a" },
  { icon: "👤", name: "New customer",    action: "joined via QR scan",                    biz: "Relief Barbershop",  ago: "34m ago",  color: "#6366f1" },
  { icon: "💪", name: "James O.",        action: "made their 5th visit — free cut earned", biz: "MTB Barbershop",     ago: "1h ago",   color: "#22c55e" },
  { icon: "🎁", name: "Priya S.",        action: "is 1 visit from a free reward",         biz: "MTB Barbershop",     ago: "1h ago",   color: "#e8944a" },
  { icon: "🔥", name: "4 customers",     action: "returned after re-engagement offer",    biz: "Relief Barbershop",  ago: "2h ago",   color: "#ef4444" },
  { icon: "⭐", name: "Leo K.",          action: "left a ⭐⭐⭐⭐⭐ review after their reward", biz: "MTB Barbershop",  ago: "3h ago",   color: "#f5b97a" },
];

const ROW2: Event[] = [
  { icon: "⚠️", name: "Sarah K.",        action: "at risk — re-engagement offer sent",    biz: "Relief Barbershop",  ago: "2m ago",   color: "#e8944a" },
  { icon: "📊", name: "Visit trend",     action: "peaked — Friday drives 40% more visits", biz: "MTB Barbershop",    ago: "8m ago",   color: "#6366f1" },
  { icon: "🔔", name: "14 customers",   action: "notified about weekend special",         biz: "MTB Barbershop",     ago: "20m ago",  color: "#e8944a" },
  { icon: "💡", name: "Wednesday offer", action: "brought 2× Tuesday's traffic",           biz: "MTB Barbershop",     ago: "1h ago",   color: "#6366f1" },
  { icon: "⚠️", name: "9 regulars",     action: "flagged as at-risk — 28+ days away",    biz: "Relief Barbershop",  ago: "2h ago",   color: "#ef4444" },
  { icon: "📈", name: "Monthly revenue", action: "up 35% vs last month",                  biz: "Relief Barbershop",  ago: "4h ago",   color: "#22c55e" },
  { icon: "🔔", name: "Offer sent",      action: "£10 off — opens 71% higher than email", biz: "MTB Barbershop",     ago: "yesterday",color: "#e8944a" },
  { icon: "💡", name: "Insight",         action: "top 10% customers visit 3× per month",  biz: "Relief Barbershop",  ago: "yesterday",color: "#6366f1" },
];

// Duplicate for seamless infinite scroll
const ROW1_DUP = [...ROW1, ...ROW1];
const ROW2_DUP = [...ROW2, ...ROW2];

function EventCard({ event }: { event: Event }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "10px 14px",
        whiteSpace: "nowrap",
        flexShrink: 0,
        backdropFilter: "blur(6px)",
      }}
    >
      <span style={{ fontSize: 15 }}>{event.icon}</span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fdf8f3" }}>{event.name}</span>
        <span style={{ fontSize: 12, color: "rgba(253,248,243,0.45)" }}>{event.action}</span>
      </div>
      <div
        style={{
          background: `${event.color}18`,
          border: `1px solid ${event.color}33`,
          borderRadius: 99,
          padding: "2px 8px",
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, color: event.color }}>{event.biz}</span>
      </div>
      <span style={{ fontSize: 10, color: "rgba(253,248,243,0.22)" }}>{event.ago}</span>
    </div>
  );
}

const STATS = [
  { value: "35%",  label: "more return visits",         sub: "avg. across all businesses using LoyaltyHub" },
  { value: "14",   label: "hours saved per month",      sub: "no more manual tracking or paper cards" },
  { value: "£2.4K",label: "avg. added monthly revenue", sub: "from re-engaged and returning customers" },
];

export default function LivePulse() {
  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 80,
        paddingBottom: 88,
        overflow: "hidden",
      }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", padding: "0 24px", marginBottom: 52 }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(201,123,58,0.12)",
            border: "1px solid rgba(201,123,58,0.25)",
            borderRadius: 99,
            padding: "6px 16px",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#e8944a" }}>🔴 Live Activity</span>
        </div>
        <h2
          style={{
            fontSize: "clamp(26px, 5vw, 46px)",
            fontWeight: 900,
            color: "#fdf8f3",
            lineHeight: 1.15,
            marginBottom: 14,
          }}
        >
          While you&apos;re cutting hair —<br />
          <span
            style={{
              background: "linear-gradient(90deg, #c97b3a, #e8944a, #f5b97a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LoyaltyHub never stops
          </span>
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "rgba(253,248,243,0.48)",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Every stamp, every at-risk alert, every returning customer — tracked and actioned automatically.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div style={{ overflow: "hidden", marginBottom: 10, maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            animation: "pulseFeedLeft 38s linear infinite",
            width: "max-content",
          }}
        >
          {ROW1_DUP.map((ev, i) => (
            <EventCard key={i} event={ev} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            animation: "pulseFeedRight 46s linear infinite",
            width: "max-content",
          }}
        >
          {ROW2_DUP.map((ev, i) => (
            <EventCard key={i} event={ev} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          marginTop: 56,
          padding: "0 24px",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "24px 32px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              minWidth: 200,
              flex: "1 1 200px",
              maxWidth: 300,
            }}
          >
            <span
              style={{
                fontSize: 46,
                fontWeight: 900,
                lineHeight: 1,
                background: "linear-gradient(135deg, #c97b3a, #e8944a, #f5b97a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 6,
              }}
            >
              {s.value}
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fdf8f3", marginBottom: 4 }}>{s.label}</span>
            <span style={{ fontSize: 12, color: "rgba(253,248,243,0.35)", lineHeight: 1.4 }}>{s.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

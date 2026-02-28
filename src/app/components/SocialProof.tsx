import ScrollReveal from "./ScrollReveal";

// Brand mark components using real logos with CSS cropping
function MTBMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: 8, flexShrink: 0, background: "#f5f0ea" }}>
      <img
        src="/logo-mtb.jpg"
        alt="MTB Barbershop"
        style={{ width: h, height: h, objectFit: "contain", display: "block", padding: 3 }}
      />
    </div>
  );
}

function ReliefMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
      <img
        src="/logo-relief.jpg"
        alt="Relief Barbershop"
        style={{ width: h, height: h, objectFit: "cover", objectPosition: "center center", display: "block" }}
      />
    </div>
  );
}

export { MTBMark, ReliefMark };

const testimonials = [
  {
    quote: "Our regulars actually come back more now. We had customers we hadn't seen in months show up after we sent a tailored offer through LoyaltyHub. That was the moment I knew it worked.",
    mark: <MTBMark />,
    business: "MTB Barbershop",
    featured: true,
    stars: 5,
  },
  {
    quote: "I used to have no idea who my best clients were beyond memory. Now I can see exactly who's been in, how often, and who I'm at risk of losing. It's changed how I run the shop.",
    mark: <ReliefMark />,
    business: "Relief Barbershop",
    featured: false,
    stars: 5,
  },
];

export default function SocialProof() {
  return (
    <section className="w-full mt-8 mb-8">
      <div className="w-full rounded-3xl p-8 sm:p-10" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
      <ScrollReveal staggerChildren className="flex flex-col gap-5">
      <div className="text-center mb-5">
        <div
          className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
          style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
        >
          Real businesses. Real results.
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#111827" }}>
          Already trusted by local businesses
        </h2>
          <p className="mt-3 text-sm" style={{ color: "#6b7280" }}>
          These are real business owners using LoyaltyHub today.
        </p>
      </div>

      {/* Trusted-by logo strip */}
      <div
        className="flex items-center justify-center gap-10 py-5 rounded-2xl"
        style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-3">
          <MTBMark size="sm" />
          <span className="text-sm font-semibold" style={{ color: "#374151" }}>MTB Barbershop</span>
        </div>
        <div style={{ width: 1, height: 36, background: "rgba(0,0,0,0.1)" }} />
        <div className="flex items-center gap-3">
          <ReliefMark size="sm" />
          <span className="text-sm font-semibold" style={{ color: "#374151" }}>Relief Barbershop</span>
        </div>
      </div>

      {/* Testimonial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <div key={i} className={`${t.featured ? "card-featured" : "card"} rounded-2xl p-6 flex flex-col gap-4`}>
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: t.stars }).map((_, s) => (
                <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#e8944a">
                  <path d="M7 1l1.55 3.14L12 4.63l-2.5 2.44.59 3.43L7 8.77l-3.09 1.63.59-3.43L2 4.63l3.45-.49L7 1z"/>
                </svg>
              ))}
            </div>
            {/* Quote */}
            <p className="text-sm leading-relaxed flex-1" style={{ color: "#374151" }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            {/* Brand */}
            <div className="mt-auto pt-3 flex items-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {t.mark}
              <span className="text-sm font-semibold" style={{ color: "#111827" }}>{t.business}</span>
            </div>
          </div>
        ))}
      </div>
      </ScrollReveal>
      </div>
    </section>
  );
}

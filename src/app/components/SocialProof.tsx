import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

// Brand mark components using real logos with CSS cropping
function MTBMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: 8, flexShrink: 0, background: "#f5f0ea" }}>
      <Image
        src="/logo-mtb.jpg"
        alt="MTB Barbershop"
        width={h}
        height={h}
        style={{ objectFit: "contain", padding: 3 }}
      />
    </div>
  );
}

function ReliefMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
      <Image
        src="/logo-relief.jpg"
        alt="Relief"
        width={h}
        height={h}
        style={{ objectFit: "cover", objectPosition: "center center" }}
      />
    </div>
  );
}

export { MTBMark, ReliefMark };

function TenCutsMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(0,0,0,0.08)" }}>
      <Image
        src="/logo-10cuts.jpg"
        alt="10 Cuts"
        width={h * 2}
        height={h * 2}
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}

export { TenCutsMark };

const testimonials = [
  {
    quote: "Our regulars actually come back more now. We had customers we hadn't seen in months show up after we sent a tailored offer through Clienty. That was the moment I knew it worked.",
    mark: <MTBMark />,
    business: "MTB Barbershop",
    featured: true,
    stars: 5,
  },
  {
    quote: "I used to have no idea who my best clients were beyond memory. Now I can see exactly who's been in, how often, and who I'm at risk of losing. It's changed how I run the shop.",
    mark: <ReliefMark />,
    business: "Relief",
    featured: false,
    stars: 5,
  },
  {
    quote: "Before Clienty we were handing out paper stamp cards that people kept losing. Now everything's digital, customers love it, and we've seen a real jump in repeat bookings.",
    mark: <TenCutsMark />,
    business: "10 Cuts",
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
          These are real business owners using Clienty today.
        </p>
      </div>

      {/* Trusted-by logo strip — infinite marquee */}
      <div
        className="overflow-hidden rounded-2xl py-4 sm:py-5"
        style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div className="marquee-track">
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} className="marquee-content" aria-hidden={copy > 0}>
              <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                <MTBMark size="sm" />
                <span className="text-[10px] sm:text-xs font-semibold" style={{ color: "#374151" }}>MTB Barbershop</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                <ReliefMark size="sm" />
                <span className="text-[10px] sm:text-xs font-semibold" style={{ color: "#374151" }}>Relief</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                <TenCutsMark size="sm" />
                <span className="text-[10px] sm:text-xs font-semibold" style={{ color: "#374151" }}>10 Cuts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial cards — horizontal scroll on mobile, grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
        {testimonials.map((t, i) => (
          <div key={i} className={`${t.featured ? "card-featured" : "card"} card-hover rounded-2xl p-5 sm:p-6 flex flex-col gap-3 sm:gap-4 min-w-[80%] sm:min-w-0 snap-center shrink-0 sm:shrink`}>
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: t.stars }).map((_, s) => (
                <svg key={s} width="16" height="16" viewBox="0 0 14 14" fill="#e8944a">
                  <path d="M7 1l1.55 3.14L12 4.63l-2.5 2.44.59 3.43L7 8.77l-3.09 1.63.59-3.43L2 4.63l3.45-.49L7 1z"/>
                </svg>
              ))}
            </div>
            {/* Quote */}
            <p className="text-sm leading-relaxed flex-1" style={{ color: "#374151" }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            {/* Brand */}
            <div className="mt-auto pt-3 flex items-center gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
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

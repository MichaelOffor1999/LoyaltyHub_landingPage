"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

// Brand mark components using real logos with CSS cropping
function MTBMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: 8, flexShrink: 0, background: "#f5f0ea" }}>
      <Image src="/logo-mtb.jpg" alt="MTB Barbershop" width={h} height={h} style={{ objectFit: "contain", padding: 3 }} />
    </div>
  );
}

function ReliefMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
      <Image src="/logo-relief.jpg" alt="Relief" width={h} height={h} style={{ objectFit: "cover", objectPosition: "center center" }} />
    </div>
  );
}

export { MTBMark, ReliefMark };

function TenCutsMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(0,0,0,0.08)" }}>
      <Image src="/logo-10cuts.jpg" alt="10 Cuts" width={h * 2} height={h * 2} style={{ objectFit: "cover", objectPosition: "center" }} />
    </div>
  );
}

export { TenCutsMark };

const testimonials = [
  {
    id: 1,
    quote: "Our regulars actually come back more now. We had customers we hadn't seen in months show up after we sent a tailored offer through Clienty. That was the moment I knew it worked.",
    mark: <MTBMark />,
    markSm: <MTBMark size="sm" />,
    business: "MTB Barbershop",
    stars: 5,
    imageSrc: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
  },
  {
    id: 2,
    quote: "I used to have no idea who my best clients were beyond memory. Now I can see exactly who's been in, how often, and who I'm at risk of losing. It's changed how I run the shop.",
    mark: <ReliefMark />,
    markSm: <ReliefMark size="sm" />,
    business: "Relief",
    stars: 5,
    imageSrc: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  },
  {
    id: 3,
    quote: "Before Clienty we were handing out paper stamp cards that people kept losing. Now everything's digital, customers love it, and we've seen a real jump in repeat bookings.",
    mark: <TenCutsMark />,
    markSm: <TenCutsMark size="sm" />,
    business: "10 Cuts",
    stars: 5,
    imageSrc: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function SocialProof() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIdx(idx);
          }
        });
      },
      { root: el, threshold: 0.6 }
    );
    cardRefs.current.forEach((card) => { if (card) observer.observe(card); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    const card = cardRefs.current[idx];
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section className="w-full mt-8 mb-8">
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
        <div className="overflow-hidden rounded-2xl py-4 sm:py-5">
          <div style={{ display: "flex", flexWrap: "nowrap", width: "max-content", animation: "marquee-scroll 20s linear infinite" }}>
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", flexShrink: 0, gap: "3.5rem", padding: "0 1.75rem" }} aria-hidden={copy > 0}>
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
      </ScrollReveal>

      {/* Testimonial cards — image background with gradient overlay */}
      <motion.div
        ref={scrollRef}
        className="mt-2 flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-2 px-2 scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl shadow-md min-w-[72%] sm:min-w-[300px] max-w-[360px] snap-center shrink-0"
            style={{ height: 380 }}
          >
            {/* Background image */}
            <img
              src={t.imageSrc}
              alt={t.business}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Stars top-left */}
            <div className="absolute top-4 left-4 flex gap-0.5">
              {Array.from({ length: t.stars }).map((_, s) => (
                <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#e8944a">
                  <path d="M7 1l1.55 3.14L12 4.63l-2.5 2.44.59 3.43L7 8.77l-3.09 1.63.59-3.43L2 4.63l3.45-.49L7 1z"/>
                </svg>
              ))}
            </div>

            {/* Content overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-left text-white">
              <Quote className="mb-3 h-7 w-7 text-white/40" aria-hidden="true" />
              <blockquote className="text-sm font-medium leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "0.75rem" }}>
                {t.markSm}
                <span className="text-sm font-semibold text-white">{t.business}</span>
              </figcaption>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll dots + swipe hint */}
      <div className="flex flex-col items-center gap-2 mt-3">
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to review ${i + 1}`}
              style={{
                width: activeIdx === i ? 20 : 8,
                height: 8,
                borderRadius: 99,
                background: activeIdx === i ? "#c97b3a" : "rgba(0,0,0,0.12)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium" style={{ color: "#9ca3af" }}>
          Swipe for more &rarr;
        </span>
      </div>
    </section>
  );
}

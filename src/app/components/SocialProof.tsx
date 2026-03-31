"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

function ReliefMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
      <Image src="/logo-relief.jpg" alt="Relief" width={h} height={h} style={{ objectFit: "cover", objectPosition: "center center" }} />
    </div>
  );
}

const testimonial = {
  quote: "I used to have no idea who my best clients were beyond memory. Now I can see exactly who's been in, how often, and who I'm at risk of losing. It's changed how I run the shop.",
  business: "Relief",
  stars: 5,
  imageSrc: "/relief-testimonial.jpg",
};

export default function SocialProof() {
  return (
    <section className="w-full mt-8 mb-8">
      <ScrollReveal staggerChildren variant="fade-right" staggerBase={120} className="flex flex-col gap-5">
        <div className="text-center mb-6">
          <div
            className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
          >
            Real businesses. Real results.
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--foreground)" }}>
            Already trusted by local businesses
          </h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(240,236,230,0.55)" }}>
            These are real business owners using clientIn today.
          </p>
        </div>
      </ScrollReveal>

      {/* Single centered testimonial card */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className="relative overflow-hidden rounded-3xl shadow-2xl w-full"
          style={{ maxWidth: 560, height: 420 }}
        >
          {/* Background image */}
          <img
            src={testimonial.imageSrc}
            alt={testimonial.business}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Gradient overlay — stronger at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          {/* Subtle border */}
          <div className="absolute inset-0 rounded-3xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />

          {/* Stars — top left */}
          <div className="absolute top-5 left-5 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="15" height="15" viewBox="0 0 14 14" fill="#e8944a">
                <polygon points="7,1 8.55,4.14 12,4.63 9.5,7.07 10.09,10.5 7,8.77 3.91,10.5 4.5,7.07 2,4.63 5.45,4.14" />
              </svg>
            ))}
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
            <Quote className="mb-4 h-8 w-8" style={{ color: "#c97b3a", opacity: 0.8 }} aria-hidden="true" />
            <blockquote className="text-base sm:text-lg font-medium leading-relaxed" style={{ letterSpacing: "-0.01em" }}>
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption
              className="mt-5 flex items-center gap-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1rem" }}
            >
              <ReliefMark size="sm" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{testimonial.business}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Verified customer</span>
              </div>
            </figcaption>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

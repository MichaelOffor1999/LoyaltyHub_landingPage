# Testimonials Section — Code Reference

This documents the full code for the testimonials / social proof section used on the ClientIn landing page.

---

## Files

- `src/app/components/SocialProof.tsx` — the main section rendered on the landing page
- `src/app/components/ui/twitter-testimonial-cards.tsx` — reusable Twitter-style stacked card component (not currently used in the main section but available)

---

## `SocialProof.tsx`

```tsx
"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

// ─── Logo mark components ──────────────────────────────────────────────────

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

function TenCutsMark({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? 32 : 48;
  return (
    <div style={{ width: h, height: h, overflow: "hidden", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)" }}>
      <Image src="/logo-10cuts.jpg" alt="10 Cuts" width={h * 2} height={h * 2} style={{ objectFit: "cover", objectPosition: "center" }} />
    </div>
  );
}

// ─── Testimonial data ──────────────────────────────────────────────────────

const testimonials = [
  {
    id: 1,
    quote: "Our regulars actually come back more now. We had customers we hadn't seen in months show up after we sent a tailored offer through clientIn. That was the moment I knew it worked.",
    mark: <MTBMark />,
    markSm: <MTBMark size="sm" />,
    business: "MTB Barbershop",
    stars: 5,
    imageSrc: "/mtb-testimonial.jpg",
  },
  {
    id: 2,
    quote: "I used to have no idea who my best clients were beyond memory. Now I can see exactly who's been in, how often, and who I'm at risk of losing. It's changed how I run the shop.",
    mark: <ReliefMark />,
    markSm: <ReliefMark size="sm" />,
    business: "Relief",
    stars: 5,
    imageSrc: "/relief-testimonial.jpg",
  },
  {
    id: 3,
    quote: "Before clientIn we were handing out paper stamp cards that people kept losing. Now everything's digital, customers love it, and we've seen a real jump in repeat bookings.",
    mark: <TenCutsMark />,
    markSm: <TenCutsMark size="sm" />,
    business: "10 Cuts",
    stars: 5,
    imageSrc: "/10cuts-testimonial.jpg",
  },
];

// ─── Animation variants ────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ─── Main component ────────────────────────────────────────────────────────

export default function SocialProof() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection observer to track which card is centred (for dot indicator)
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
      <ScrollReveal staggerChildren variant="fade-right" staggerBase={120} className="flex flex-col gap-5">
        <div className="text-center mb-5">
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

      {/* Horizontally scrollable testimonial cards */}
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
            {/* Background photo */}
            <img
              src={t.imageSrc}
              alt={t.business}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Star rating — top left */}
            <div className="absolute top-4 left-4 flex gap-0.5">
              {Array.from({ length: t.stars }).map((_, s) => (
                <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#e8944a">
                  <path d="M7 1l1.55 3.14L12 4.63l-2.5 2.44.59 3.43L7 8.77l-3.09 1.63.59-3.43L2 4.63l3.45-.49L7 1z"/>
                </svg>
              ))}
            </div>

            {/* Quote + business name — bottom overlay */}
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

      {/* Scroll position dots + swipe hint */}
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
                background: activeIdx === i ? "#c97b3a" : "rgba(255,255,255,0.1)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium" style={{ color: "rgba(240,236,230,0.4)" }}>
          Swipe for more &rarr;
        </span>
      </div>
    </section>
  );
}
```

---

## `twitter-testimonial-cards.tsx`

Reusable stacked Twitter/X-style card component. Supports hover/tap interactions to fan out stacked cards.

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  className?: string;
  avatar?: string;
  username?: string;
  handle?: string;
  content?: string;
  date?: string;
  verified?: boolean;
  likes?: number;
  retweets?: number;
  tweetUrl?: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg className="size-4 text-[#1d9bf0]" viewBox="0 0 22 22" fill="currentColor">
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function TestimonialCard({
  className,
  avatar,
  username = "PEPE",
  handle = "@PEPE_bigbrother",
  content = "This is amazing! Absolutely loving what the team is building here.",
  date = "Jan 5, 2026",
  verified = true,
  likes = 142,
  retweets = 23,
  tweetUrl,
  onHover,
  onLeave,
  isActive,
  onTap,
}: TestimonialCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && !isActive) {
      e.preventDefault();
      onTap?.();
    }
  };

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "relative flex h-auto min-h-[140px] sm:min-h-[180px] w-[260px] sm:w-[380px] -skew-y-[8deg] select-none flex-col rounded-2xl border border-border bg-card/90 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-4 transition-all duration-500 hover:border-border/80 hover:bg-card cursor-pointer",
        isActive && "ring-2 ring-primary/50",
        className,
      )}
    >
      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="size-9 sm:size-12 rounded-full bg-gradient-to-br from-green-400 via-yellow-400 to-green-500 flex items-center justify-center overflow-hidden shrink-0">
          {avatar ? (
            <img src={avatar} alt={username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg sm:text-2xl">🐸</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-foreground truncate text-xs sm:text-base">{username}</span>
            {verified && <VerifiedBadge />}
          </div>
          <span className="text-muted-foreground text-[10px] sm:text-sm">{handle}</span>
        </div>
        <TwitterIcon className="size-4 sm:size-5 text-foreground shrink-0" />
      </div>

      <p className="text-foreground text-xs sm:text-[15px] leading-relaxed mb-2 sm:mb-3 line-clamp-3 sm:line-clamp-4">
        {content}
      </p>

      <div className="flex items-center justify-between text-muted-foreground text-[10px] sm:text-sm mt-auto">
        <span>{date}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {/* Heart icon */}
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Retweet icon */}
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>{retweets}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

interface TestimonialsProps {
  cards?: TestimonialCardProps[];
}

export default function Testimonials({ cards }: TestimonialsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getCardClassName = (index: number, baseClassName: string) => {
    const focusedIndex = hoveredIndex ?? activeIndex;
    if (focusedIndex === 0 && index === 1) return baseClassName + " !translate-y-20 sm:!translate-y-32 !translate-x-14 sm:!translate-x-24";
    if (focusedIndex === 0 && index === 2) return baseClassName + " !translate-y-28 sm:!translate-y-44 !translate-x-24 sm:!translate-x-40";
    if (focusedIndex === 1 && index === 2) return baseClassName + " !translate-y-24 sm:!translate-y-40 !translate-x-24 sm:!translate-x-40";
    return baseClassName;
  };

  // Default demo cards
  const defaultCards: TestimonialCardProps[] = [
    {
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80",
      username: "Sarah Chen", handle: "@sarahchen",
      content: "This component is exactly what I needed for my landing page. The stacked effect is beautiful and feels premium.",
      date: "Jan 3, 2026", verified: true, likes: 42, retweets: 8, tweetUrl: "https://x.com",
    },
    {
      className: "[grid-area:stack] translate-x-8 sm:translate-x-16 translate-y-6 sm:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
      avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80",
      username: "Mike Johnson", handle: "@mikej_dev",
      content: "The hover interactions are so smooth. Love how the cards spread apart to reveal the ones behind.",
      date: "Jan 2, 2026", verified: true, likes: 28, retweets: 5, tweetUrl: "https://x.com",
    },
    {
      className: "[grid-area:stack] translate-x-16 sm:translate-x-32 translate-y-12 sm:translate-y-20 hover:translate-y-6 sm:hover:translate-y-10",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
      username: "Alex Rivera", handle: "@alexrivera",
      content: "Finally a testimonial component that looks native to Twitter/X! Dark mode support is chef's kiss.",
      date: "Jan 1, 2026", verified: true, likes: 156, retweets: 23, tweetUrl: "https://x.com",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <TestimonialCard
          key={index}
          {...cardProps}
          className={getCardClassName(index, cardProps.className || "")}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
          isActive={activeIndex === index}
          onTap={() => setActiveIndex(index === activeIndex ? null : index)}
        />
      ))}
    </div>
  );
}

export { TestimonialCard, Testimonials };
export type { TestimonialCardProps, TestimonialsProps };
```

---

## Image assets required

Place these in `/public/`:

| File | Used in |
|------|---------|
| `mtb-testimonial.jpg` | MTB Barbershop card background |
| `relief-testimonial.jpg` | Relief card background |
| `10cuts-testimonial.jpg` | 10 Cuts card background |
| `logo-mtb.jpg` | MTB logo mark |
| `logo-relief.jpg` | Relief logo mark |
| `logo-10cuts.jpg` | 10 Cuts logo mark |

## Dependencies

```bash
npm install framer-motion lucide-react
```

## Usage in `page.tsx`

```tsx
import SocialProof from "@/app/components/SocialProof";

// Inside your page JSX:
<SocialProof />
```

"use client";
import { useEffect, useRef, ReactNode } from "react";

export type SRVariant =
  | "fade-up"        // default — slides up from below
  | "fade-down"      // drops in from above
  | "fade-left"      // slides in from left
  | "fade-right"     // slides in from right
  | "scale-up"       // grows from 92% + fade
  | "blur-in"        // blurs in, no translate
  | "flip-up"        // perspective flip from bottom
  | "slide-reveal";  // mask-wipe reveal

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  staggerChildren?: boolean;
  staggerBase?: number;
  className?: string;
  variant?: SRVariant;
  /** Per-child variants when staggerChildren is true */
  childVariants?: SRVariant[];
  /** 0–1, how much of the element must be visible to trigger */
  threshold?: number;
}

// Maps a variant to the CSS class pair [hidden, visible]
const VARIANT_CLASSES: Record<SRVariant, { hidden: string; visible: string }> = {
  "fade-up":     { hidden: "sr-hidden-up",    visible: "sr-visible" },
  "fade-down":   { hidden: "sr-hidden-down",  visible: "sr-visible" },
  "fade-left":   { hidden: "sr-hidden-left",  visible: "sr-visible" },
  "fade-right":  { hidden: "sr-hidden-right", visible: "sr-visible" },
  "scale-up":    { hidden: "sr-hidden-scale", visible: "sr-visible" },
  "blur-in":     { hidden: "sr-hidden-blur",  visible: "sr-visible" },
  "flip-up":     { hidden: "sr-hidden-flip",  visible: "sr-visible" },
  "slide-reveal":{ hidden: "sr-hidden-up",    visible: "sr-visible" },
};

export default function ScrollReveal({
  children,
  delay = 0,
  staggerChildren = false,
  staggerBase = 100,
  className = "",
  variant = "fade-up",
  childVariants,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (staggerChildren) {
      const kids = Array.from(el.children) as HTMLElement[];
      kids.forEach((child, i) => {
        const v = childVariants?.[i] ?? variant;
        child.classList.add(VARIANT_CLASSES[v].hidden);
        child.style.transitionDelay = `${i * staggerBase}ms`;
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            kids.forEach((child, i) => {
              const v = childVariants?.[i] ?? variant;
              child.classList.remove(VARIANT_CLASSES[v].hidden);
              child.classList.add(VARIANT_CLASSES[v].visible);
            });
            observer.unobserve(el);
          }
        },
        { threshold }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      const cls = VARIANT_CLASSES[variant];
      el.classList.add(cls.hidden);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.remove(cls.hidden);
              el.classList.add(cls.visible);
            }, delay);
            observer.unobserve(el);
          }
        },
        { threshold }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [delay, staggerChildren, staggerBase, variant, childVariants, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

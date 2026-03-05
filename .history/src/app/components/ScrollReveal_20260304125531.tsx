"use client";
import { useEffect, useRef, ReactNode } from "react";

export type SRVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "blur-in"
  | "flip-up";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  staggerChildren?: boolean;
  staggerBase?: number;
  className?: string;
  variant?: SRVariant;
  childVariants?: SRVariant[];
  threshold?: number;
}

const VARIANT_CLASSES: Record<SRVariant, string> = {
  "fade-up":    "sr-hidden-up",
  "fade-down":  "sr-hidden-down",
  "fade-left":  "sr-hidden-left",
  "fade-right": "sr-hidden-right",
  "scale-up":   "sr-hidden-scale",
  "blur-in":    "sr-hidden-blur",
  "flip-up":    "sr-hidden-flip",
};

export default function ScrollReveal({
  children,
  delay = 0,
  staggerChildren = false,
  staggerBase = 110,
  className = "",
  variant = "fade-up",
  childVariants,
  threshold = 0.08,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (staggerChildren) {
      const kids = Array.from(el.children) as HTMLElement[];
      kids.forEach((child, i) => {
        const v = childVariants?.[i] ?? variant;
        child.classList.add(VARIANT_CLASSES[v]);
        child.style.transitionDelay = `${i * staggerBase}ms`;
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            kids.forEach((child, i) => {
              const v = childVariants?.[i] ?? variant;
              child.classList.remove(VARIANT_CLASSES[v]);
              child.classList.add("sr-visible");
            });
            observer.unobserve(el);
          }
        },
        { threshold }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      const hiddenClass = VARIANT_CLASSES[variant];
      el.classList.add(hiddenClass);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.remove(hiddenClass);
              el.classList.add("sr-visible");
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

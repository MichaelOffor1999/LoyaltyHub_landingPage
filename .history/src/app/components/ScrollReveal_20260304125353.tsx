"use client";
import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number; // ms — for single-block mode
  staggerChildren?: boolean; // reveal each direct child in cascade
  staggerBase?: number; // ms delay per child (default 110)
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  staggerChildren = false,
  staggerBase = 110,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (staggerChildren) {
      // Hide each direct child individually with staggered delays
      const kids = Array.from(el.children) as HTMLElement[];
      kids.forEach((child, i) => {
        child.classList.add("sr-hidden");
        child.style.transitionDelay = `${i * staggerBase}ms`;
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            kids.forEach((child) => child.classList.add("sr-visible"));
            observer.unobserve(el);
          }
        },
        { threshold: 0.08 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      // Original single-block mode
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add("sr-visible");
            }, delay);
            observer.unobserve(el);
          }
        },
        { threshold: 0.08 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [delay, staggerChildren, staggerBase]);

  return (
    <div
      ref={ref}
      className={staggerChildren ? className : `sr-hidden ${className}`}
    >
      {children}
    </div>
  );
}

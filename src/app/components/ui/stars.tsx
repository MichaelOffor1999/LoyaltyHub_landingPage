"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;          // twinkle speed multiplier
  phase: number;          // initial phase offset for twinkle
  parallaxFactor: number; // 0 = fixed, 1 = full scroll parallax
}

export interface StarsBackgroundProps {
  /** Number of stars to render. Default: 200 */
  starCount?: number;
  /** Minimum star radius in px. Default: 0.4 */
  minRadius?: number;
  /** Maximum star radius in px. Default: 1.8 */
  maxRadius?: number;
  /** Enable subtle parallax on mouse move. Default: true */
  parallax?: boolean;
  /** Parallax intensity (px). Default: 25 */
  parallaxStrength?: number;
  /** Enable twinkle animation. Default: true */
  twinkle?: boolean;
  /** Twinkle speed multiplier. Default: 1 */
  twinkleSpeed?: number;
  /** Star colour. Default: "rgba(255,255,255,{opacity})" */
  starColor?: string;
  /** Extra class names for the wrapper div */
  className?: string;
  /** aria-hidden on the canvas (decorative). Default: true */
  ariaHidden?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * StarsBackground — a canvas-based animated star field that respects the
 * project's dark/light theme (hidden when `data-theme="light"` via CSS).
 *
 * Drop it inside any relative/fixed positioned container:
 *
 * ```tsx
 * <div className="relative">
 *   <StarsBackground />
 *   <YourContent />
 * </div>
 * ```
 */
export function StarsBackground({
  starCount = 200,
  minRadius = 0.4,
  maxRadius = 1.8,
  parallax = true,
  parallaxStrength = 25,
  twinkle = true,
  twinkleSpeed = 1,
  starColor,
  className,
  ariaHidden = true,
}: StarsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  // ── Build / rebuild the star array whenever dimensions or count change ──
  const initStars = useCallback(
    (w: number, h: number) => {
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: randomBetween(minRadius, maxRadius),
        opacity: randomBetween(0.3, 1),
        speed: randomBetween(0.3, 1.2),
        phase: Math.random() * Math.PI * 2,
        parallaxFactor: randomBetween(0.02, 0.08),
      }));
    },
    [starCount, minRadius, maxRadius]
  );

  // ── Main animation loop ──────────────────────────────────────────────────
  const animate = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dt = timestamp - timeRef.current;
      timeRef.current = timestamp;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const normX = (mx / width - 0.5) * 2;  // -1 … +1
      const normY = (my / height - 0.5) * 2; // -1 … +1

      for (const star of starsRef.current) {
        // Parallax offset
        const px = parallax ? normX * parallaxStrength * star.parallaxFactor * 10 : 0;
        const py = parallax ? normY * parallaxStrength * star.parallaxFactor * 10 : 0;

        // Twinkle opacity
        let alpha = star.opacity;
        if (twinkle) {
          const t = (timestamp * 0.001 * twinkleSpeed * star.speed) + star.phase;
          alpha = 0.3 + 0.7 * ((Math.sin(t) + 1) / 2);
        }

        // Draw
        const drawX = star.x + px;
        const drawY = star.y + py;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);

        if (starColor) {
          ctx.fillStyle = starColor;
          ctx.globalAlpha = alpha;
        } else {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.globalAlpha = 1;
        }

        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    },
    [parallax, parallaxStrength, twinkle, twinkleSpeed, starColor]
  );

  // ── Setup: resize observer + RAF ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      const { offsetWidth: w, offsetHeight: h } = canvas.parentElement ?? canvas;
      canvas.width = w;
      canvas.height = h;
      initStars(w, h);
    };

    setSize();

    const ro = new ResizeObserver(setSize);
    ro.observe(canvas.parentElement ?? canvas);

    // Kick off animation
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [initStars, animate]);

  // ── Mouse tracking for parallax ─────────────────────────────────────────
  useEffect(() => {
    if (!parallax) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [parallax]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden={ariaHidden}
      className={cn(
        // Fill the parent, sit behind content, transition with theme
        "absolute inset-0 w-full h-full pointer-events-none stars-layer",
        className
      )}
      style={{ zIndex: 0 }}
    />
  );
}

export default StarsBackground;

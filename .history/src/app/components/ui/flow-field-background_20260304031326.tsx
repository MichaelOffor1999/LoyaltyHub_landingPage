"use client";

import { useEffect, useRef } from "react";

// ─── NeuralBackground ─────────────────────────────────────────────────────────
// Adapted from the NeuralBackground / flow-field source component.
//
// Differences from the original:
//  • Brand orange (#e8944a) particles instead of indigo
//  • Fixed full-viewport canvas — no bg-black wrapper, so page bg shows through
//  • Hidden in light mode via .neural-bg-layer CSS (see globals.css)
//  • pointer-events-none — never blocks page interaction
//  • Trail fade is painted ONLY on the canvas pixel buffer; it does NOT render
//    any DOM element over the page content

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Config ────────────────────────────────────────────────────────────────
    const COLOR = "#e8944a"; // brand orange
    const TRAIL_OPACITY = 0.12; // lower = longer trails
    const PARTICLE_COUNT = 500;
    const SPEED = 0.8;
    const BG_COLOR = "10, 10, 15"; // matches --background rgb values

    let width = container.clientWidth;
    let height = container.clientHeight;
    let animId = 0;
    const mouse = { x: -1000, y: -1000 };

    // ── Particle class ────────────────────────────────────────────────────────
    class Particle {
      x = Math.random() * width;
      y = Math.random() * height;
      vx = 0;
      vy = 0;
      age = 0;
      life = Math.random() * 200 + 100;

      update() {
        const angle =
          (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
        this.vx += Math.cos(angle) * 0.2 * SPEED;
        this.vy += Math.sin(angle) * 0.2 * SPEED;

        // Mouse repulsion
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.vx -= dx * force * 0.05;
          this.vy -= dy * force * 0.05;
        }

        this.vx *= 0.95;
        this.vy *= 0.95;
        this.x += this.vx;
        this.y += this.vy;
        this.age++;

        if (this.age > this.life) this.reset();

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = 0;
        this.vy = 0;
        this.age = 0;
        this.life = Math.random() * 200 + 100;
      }

      draw() {
        const alpha = Math.max(
          0,
          1 - Math.abs((this.age / this.life) - 0.5) * 2
        );
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = COLOR;
        ctx!.fillRect(this.x, this.y, 1.5, 1.5);
      }
    }

    // ── Initialise ────────────────────────────────────────────────────────────
    let particles: Particle[] = [];

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      // Fill with the background colour so the trail has something to blend into
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgb(${BG_COLOR})`;
      ctx.fillRect(0, 0, width, height);
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    };

    // ── Animation loop ────────────────────────────────────────────────────────
    const animate = () => {
      // Trail: semi-transparent rect painted onto the canvas buffer only
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(${BG_COLOR}, ${TRAIL_OPACITY})`;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.update();
        p.draw();
      }

      animId = requestAnimationFrame(animate);
    };

    // ── Event listeners ───────────────────────────────────────────────────────
    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      init();
    };

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    init();
    animate();

    window.addEventListener("resize", onResize);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="neural-bg-layer"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}

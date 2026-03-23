"use client";
import { useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;           // 0 → 1 (birth → death)
  maxLife: number;        // total frames before reset
  size: number;
  hue: number;            // degrees on colour wheel
  brightness: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;       // 0 → 1
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PARTICLE_COUNT  = 70;
const CONNECTION_DIST = 160;   // px — max distance to draw a link
const FLOW_SCALE      = 0.0025; // noise zoom (larger = smoother curves)
const SPEED           = 0.55;
const BRAND_HUE       = 28;    // orange brand colour (hsl hue)

// ─── Simplex-ish noise (value noise, fast & dependency-free) ─────────────────

function hash(n: number) {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

function noise2d(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix     + iy * 57);
  const b = hash(ix + 1 + iy * 57);
  const c = hash(ix     + (iy + 1) * 57);
  const d = hash(ix + 1 + (iy + 1) * 57);
  return (
    a +
    ux * (b - a) +
    uy * (c - a) +
    ux * uy * (a - b - c + d)
  );
}

// Returns a flow angle in radians for position (x, y) at time t
function flowAngle(x: number, y: number, t: number): number {
  const n = noise2d(x * FLOW_SCALE + t * 0.3, y * FLOW_SCALE + t * 0.2);
  return n * Math.PI * 4; // 0 → 4π  (two full rotations max)
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FlowFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let tick = 0;

    const particles: Particle[] = [];
    const connections: Connection[] = [];

    // ── Resize handler ──────────────────────────────────────────────────────
    const resize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // ── Spawn a single particle at a random position ─────────────────────────
    const spawnParticle = (p: Particle) => {
      p.x          = Math.random() * width;
      p.y          = Math.random() * height;
      p.vx         = 0;
      p.vy         = 0;
      p.life       = 0;
      p.maxLife    = 220 + Math.random() * 280; // frames
      p.size       = 1.2 + Math.random() * 1.8;
      // Mix brand orange (hue ~28) with a small white/gold spread
      p.hue        = BRAND_HUE + (Math.random() - 0.5) * 30;
      p.brightness = 65 + Math.random() * 25;
    };

    // Initialise pool
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p: Particle = {
        x: 0, y: 0, vx: 0, vy: 0,
        life: 0, maxLife: 1,
        size: 1, hue: BRAND_HUE, brightness: 80,
      };
      spawnParticle(p);
      p.life = Math.random() * p.maxLife; // stagger initial ages
      particles.push(p);
    }

    // ── Main loop ─────────────────────────────────────────────────────────────
    const draw = () => {
      tick++;

      // Fully clear the canvas each frame — keeps it transparent so the page
      // background shows through and no other animations are obscured.
      ctx.clearRect(0, 0, width, height);

      const t = tick * 0.003;

      // ── Update particles ────────────────────────────────────────────────────
      for (const p of particles) {
        const angle = flowAngle(p.x, p.y, t);
        p.vx = p.vx * 0.92 + Math.cos(angle) * SPEED * 0.08;
        p.vy = p.vy * 0.92 + Math.sin(angle) * SPEED * 0.08;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Recycle
        if (
          p.life > p.maxLife ||
          p.x < -20 || p.x > width + 20 ||
          p.y < -20 || p.y > height + 20
        ) {
          spawnParticle(p);
        }
      }

      // ── Build connection list ────────────────────────────────────────────────
      connections.length = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            connections.push({ from: i, to: j, strength: 1 - dist / CONNECTION_DIST });
          }
        }
      }

      // ── Draw connections ────────────────────────────────────────────────────
      for (const { from, to, strength } of connections) {
        const pA = particles[from];
        const pB = particles[to];
        const lifeA = Math.sin((pA.life / pA.maxLife) * Math.PI);
        const lifeB = Math.sin((pB.life / pB.maxLife) * Math.PI);
        const alpha = strength * 0.22 * lifeA * lifeB;

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.strokeStyle = `hsla(${BRAND_HUE}, 60%, 60%, ${alpha})`;
        ctx.lineWidth   = strength * 0.8;
        ctx.stroke();
      }

      // ── Draw particles ──────────────────────────────────────────────────────
      for (const p of particles) {
        const lifeFrac = Math.sin((p.life / p.maxLife) * Math.PI); // fade in/out
        const alpha    = lifeFrac * 0.85;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, ${p.brightness}%, ${alpha})`;
        ctx.fill();

        // Subtle glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grd.addColorStop(0, `hsla(${p.hue}, 80%, ${p.brightness}%, ${alpha * 0.4})`);
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="flow-field-layer"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        background: "transparent",
      }}
    />
  );
}

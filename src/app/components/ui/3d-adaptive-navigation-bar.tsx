"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";


interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home",     href: "#top",      id: "top"      },
  { label: "Features", href: "#features", id: "features" },
  { label: "FAQ",      href: "#faq",      id: "faq"      },
  { label: "Waitlist", href: "#waitlist", id: "waitlist" },
];

/**
 * AdaptivePillNav
 * Collapses to a single active-label pill and expands on hover.
 * Placed as a fixed, centered overlay at the top of the page.
 */
export function AdaptivePillNav() {
  const [activeId, setActiveId] = useState("top");
  const [expanded, setExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hovering, setHovering] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // spring-animated pill width
  const pillWidth = useSpring(148, { stiffness: 240, damping: 28, mass: 1 });

  // ── Scroll spy ───────────────────────────────────────────────────────────
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((n) => n.id);

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (sectionIds.includes(id)) setActiveId(id);
        }
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Hover expand / collapse ──────────────────────────────────────────────
  // Expand immediately on hover, collapse after a delay.
  useEffect(() => {
    if (!hovering) {
      hoverTimeout.current = setTimeout(() => setExpanded(false), 550);
      return () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      };
    }

    // hovering === true
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    // Avoid synchronous setState in effect body.
    queueMicrotask(() => setExpanded(true));
    return () => {};
  }, [hovering]);

  // Keep animation concerns separate from state transitions
  useEffect(() => {
    pillWidth.set(expanded ? 540 : 148);
  }, [expanded, pillWidth]);

  const handleClick = (item: NavItem) => {
    setIsTransitioning(true);
    setActiveId(item.id);
    setHovering(false);

    // Smooth-scroll to section
    const el = document.getElementById(item.id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => setIsTransitioning(false), 420);
  };

  const activeItem = NAV_ITEMS.find((n) => n.id === activeId) ?? NAV_ITEMS[0];

  // ── Box-shadow helper ────────────────────────────────────────────────────
  const shadow = expanded
    ? `0 2px 4px rgba(0,0,0,.08), 0 6px 12px rgba(0,0,0,.12),
       0 12px 24px rgba(0,0,0,.14), 0 24px 48px rgba(0,0,0,.10),
       inset 0 2px 2px rgba(255,255,255,.8),
       inset 0 -3px 8px rgba(0,0,0,.12),
       inset 3px 3px 8px rgba(0,0,0,.10),
       inset -3px 3px 8px rgba(0,0,0,.09)`
    : isTransitioning
    ? `0 3px 6px rgba(0,0,0,.10), 0 8px 16px rgba(0,0,0,.08),
       inset 0 2px 1px rgba(255,255,255,.85),
       inset 0 -2px 6px rgba(0,0,0,.08),
       inset 0 0 20px rgba(255,255,255,.15)`
    : `0 3px 6px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.10),
       0 16px 32px rgba(0,0,0,.08),
       inset 0 2px 1px rgba(255,255,255,.70),
       inset 0 -2px 6px rgba(0,0,0,.10),
       inset 2px 2px 8px rgba(0,0,0,.08),
       inset -2px 2px 8px rgba(0,0,0,.07)`;

  return (
    // Outer wrapper — full-width bar so the pill centres itself
    <div
      className="fixed top-4 inset-x-0 z-[60] flex items-center justify-center pointer-events-none"
      aria-label="Main navigation"
    >
      {/* Left: Logo — always visible */}
      <div
        className="absolute left-4 sm:left-14 flex items-center gap-2 pointer-events-auto"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <a href="#top" aria-label="clientIn — back to top" className="flex items-center">
          <span
            className="font-black text-sm sm:text-base tracking-[0.15em] sm:tracking-[0.2em] uppercase"
            style={{ color: "#ffffff" }}
          >
            clientIn
          </span>
        </a>
      </div>

      {/* Centre: Adaptive pill */}
      <motion.nav
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative rounded-full pointer-events-auto"
        style={{
          width: pillWidth,
          height: 52,
          background: `linear-gradient(135deg,
            #fcfcfd 0%, #f8f8fa 15%, #f3f4f6 30%, #eeeff2 45%,
            #e9eaed 60%, #e4e5e8 75%, #dee0e3 90%, #e2e3e6 100%)`,
          boxShadow: shadow,
          overflow: "hidden",
          transition: "box-shadow 0.3s ease-out",
        }}
      >
        {/* ── Gloss / lighting layers ── */}
        {/* Top ridge */}
        <div
          className="absolute inset-x-0 top-0 rounded-t-full pointer-events-none"
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.95) 5%, rgba(255,255,255,1) 15%, rgba(255,255,255,1) 85%, rgba(255,255,255,.95) 95%, rgba(255,255,255,0) 100%)",
            filter: "blur(.3px)",
          }}
        />
        {/* Top hemisphere */}
        <div
          className="absolute inset-x-0 top-0 rounded-full pointer-events-none"
          style={{
            height: "55%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,.45) 0%, rgba(255,255,255,.25) 30%, rgba(255,255,255,.10) 60%, rgba(255,255,255,0) 100%)",
          }}
        />
        {/* Directional light */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,.40) 0%, rgba(255,255,255,.20) 20%, rgba(255,255,255,.08) 40%, rgba(255,255,255,0) 65%)",
          }}
        />
        {/* Main gloss reflection */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: expanded ? "18%" : "15%",
            top: "16%",
            width: expanded ? 140 : 60,
            height: 14,
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,.70) 0%, rgba(255,255,255,.35) 40%, rgba(255,255,255,.10) 70%, rgba(255,255,255,0) 100%)",
            filter: "blur(4px)",
            transform: "rotate(-12deg)",
            transition: "all .3s ease",
          }}
        />
        {/* Bottom curvature shadow */}
        <div
          className="absolute inset-x-0 bottom-0 rounded-b-full pointer-events-none"
          style={{
            height: "50%",
            background:
              "linear-gradient(0deg, rgba(0,0,0,.14) 0%, rgba(0,0,0,.08) 25%, rgba(0,0,0,.03) 50%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,.22)", opacity: 0.7 }}
        />
        {/* Edge definition */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.10)" }}
        />

        {/* ── Nav content ── */}
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          {/* Collapsed — single label */}
          {!expanded && (
            <AnimatePresence mode="wait">
              <motion.span
                key={activeItem.id}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  fontSize: 15,
                  fontWeight: 680,
                  color: "#1a1a1a",
                  letterSpacing: "0.45px",
                  whiteSpace: "nowrap",
                  fontFamily: "Inter, -apple-system, sans-serif",
                  WebkitFontSmoothing: "antialiased",
                  textShadow:
                    "0 1px 0 rgba(0,0,0,.35), 0 -1px 0 rgba(255,255,255,.8), 1px 1px 0 rgba(0,0,0,.18)",
                }}
              >
                {activeItem.label}
              </motion.span>
            </AnimatePresence>
          )}

          {/* Expanded — all items */}
          {expanded && (
            <div className="flex items-center justify-evenly w-full">
              {NAV_ITEMS.map((item, i) => {
                const isActive = item.id === activeId;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ delay: i * 0.06, duration: 0.22, ease: "easeOut" }}
                    onClick={() => handleClick(item)}
                    style={{
                      fontSize: isActive ? 15 : 14.5,
                      fontWeight: isActive ? 700 : 510,
                      color: isActive ? "#1a1a1a" : "#656565",
                      background: "transparent",
                      border: "none",
                      padding: "10px 14px",
                      outline: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.4px",
                      fontFamily: "Inter, -apple-system, sans-serif",
                      WebkitFontSmoothing: "antialiased",
                      transform: isActive ? "translateY(-1.5px)" : "translateY(0)",
                      textShadow: isActive
                        ? "0 1px 0 rgba(0,0,0,.35), 0 -1px 0 rgba(255,255,255,.8)"
                        : "0 1px 0 rgba(0,0,0,.22), 0 -1px 0 rgba(255,255,255,.65)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#3a3a3a";
                        e.currentTarget.style.transform = "translateY(-.5px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#656565";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </motion.nav>

      {/* Right: CTA — always visible */}
      <div
        className="absolute right-8 sm:right-14 flex items-center gap-2.5 pointer-events-auto"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <a
          href="#waitlist"
          className="rounded-full px-4 py-2 text-sm font-bold transition hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #c97b3a, #e8944a)",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(201,123,58,0.4)",
          }}
        >
          Join Waitlist
        </a>
      </div>
    </div>
  );
}

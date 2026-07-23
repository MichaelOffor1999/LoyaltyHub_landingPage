"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const links = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Collabs",      href: "/collabs" },
  { label: "Pricing",      href: "/subscribe" },
  { label: "Download",     href: "/download" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 inset-x-0 z-[60] flex items-center justify-between px-5 sm:px-10"
      style={{
        height: 60,
        background: scrolled ? "rgba(245,240,232,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(26,20,16,0.08)" : "1px solid transparent",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 shrink-0">
        <Image src="/logo.png" alt="clientIn" width={26} height={26} className="rounded-full" />
        <span className="font-black text-sm tracking-[0.12em] uppercase" style={{ color: "#1a1410" }}>
          clientIn
        </span>
      </a>

      {/* Centre links — desktop only */}
      <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-[13px] font-medium transition-opacity hover:opacity-50"
            style={{ color: "rgba(26,20,16,0.65)" }}
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a
        href="/download"
        className="shrink-0 px-4 py-2 rounded-full text-[12px] font-bold transition-opacity hover:opacity-75"
        style={{ background: "#1a1410", color: "#fff" }}
      >
        Get the app
      </a>
    </nav>
  );
}

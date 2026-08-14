"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const links = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Collabs",      href: "/collabs" },
  { label: "Manage Plan",  href: "/subscribe" },
  { label: "Download",     href: "/download" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-[60] flex items-center justify-between px-5 sm:px-10"
        style={{
          height: 60,
          background: scrolled || open ? "rgba(245,240,232,0.96)" : "transparent",
          backdropFilter: scrolled || open ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled || open ? "blur(14px)" : "none",
          borderBottom: scrolled || open ? "1px solid rgba(26,20,16,0.08)" : "1px solid transparent",
          transition: "background 0.25s ease, border-color 0.25s ease",
        }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* CTA — always visible */}
          <a
            href="/download"
            className="shrink-0 px-4 py-2 rounded-full text-[12px] font-bold transition-opacity hover:opacity-75"
            style={{ background: "#1a1410", color: "#fff" }}
          >
            Get the app
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className="block w-5 rounded-full"
              style={{
                height: 2,
                background: "#1a1410",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform: open ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-5 rounded-full"
              style={{
                height: 2,
                background: "#1a1410",
                transition: "opacity 0.2s ease",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-5 rounded-full"
              style={{
                height: 2,
                background: "#1a1410",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className="fixed inset-x-0 z-[59] md:hidden flex flex-col px-6 pt-6 pb-8 gap-1"
        style={{
          top: 60,
          background: "rgba(245,240,232,0.97)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(26,20,16,0.08)",
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={() => setOpen(false)}
            className="py-4 text-base font-semibold border-b"
            style={{ color: "#1a1410", borderColor: "rgba(26,20,16,0.08)" }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Download clientIn",
  description: "Get the clientIn app on iOS. Digital loyalty for self-care businesses.",
};

const screenshots = [
  { src: "/app-screen-join.png", alt: "Join clientIn" },
  { src: "/app-screen-discover.png", alt: "Discover new places" },
  { src: "/app-screen-wallet.png", alt: "Stamp cards and rewards" },
  { src: "/app-screen-loyalty.png", alt: "Create loyalty programs" },
  { src: "/app-screen-insights.png", alt: "See your customers" },
];

export default function DownloadPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#faf7f2", fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>

      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-12">

        <div className="mb-6">
          <Image src="/logo.png" alt="clientIn" width={72} height={72} className="rounded-[22px] mx-auto" style={{ boxShadow: "0 8px 32px rgba(201,123,58,0.25)" }} />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(26,20,16,0.38)" }}>
          Now available on iOS
        </p>
        <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight" style={{ color: "#1a1410", letterSpacing: "-0.02em" }}>
          Get clientIn
        </h1>
        <p className="text-base max-w-sm mb-10" style={{ color: "rgba(26,20,16,0.52)", lineHeight: 1.65 }}>
          Digital loyalty for self-care businesses. Download free and set up your program in minutes.
        </p>

        {/* Download badges */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">

          {/* App Store */}
          <a
            href="https://apps.apple.com/ie/app/clientin/id6759510406"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-opacity hover:opacity-85 active:scale-95"
            style={{ background: "#1a1410", minWidth: 190, textDecoration: "none" }}
          >
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true">
              <path d="M18.068 13.825c-.03-3.22 2.63-4.77 2.75-4.845-1.5-2.192-3.83-2.49-4.655-2.52-1.975-.2-3.87 1.17-4.875 1.17-1.005 0-2.56-1.145-4.21-1.115-2.155.03-4.15 1.26-5.26 3.185-2.25 3.905-.575 9.685 1.62 12.855 1.075 1.555 2.35 3.3 4.025 3.235 1.62-.065 2.23-1.05 4.19-1.05 1.96 0 2.51 1.05 4.225 1.015 1.74-.03 2.845-1.575 3.91-3.135 1.24-1.79 1.745-3.545 1.77-3.635-.04-.015-3.39-1.305-3.42-5.16v-.005z" fill="white"/>
              <path d="M14.8 4.38c.89-1.08 1.49-2.575 1.325-4.075-1.28.055-2.84.855-3.76 1.935-.825.955-1.55 2.495-1.355 3.965 1.43.11 2.89-.73 3.79-1.825z" fill="white"/>
            </svg>
            <div className="text-left">
              <p className="text-[9px] font-medium leading-none mb-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>Download on the</p>
              <p className="text-base font-bold leading-none" style={{ color: "#fff" }}>App Store</p>
            </div>
          </a>

          {/* Google Play — Coming Soon */}
          <div
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-not-allowed"
            style={{ background: "rgba(26,20,16,0.06)", border: "1px solid rgba(26,20,16,0.09)", minWidth: 190 }}
          >
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden="true">
              <path d="M1.22 0.5C0.77 0.76 0.5 1.22 0.5 1.82v20.36c0 .6.27 1.06.72 1.32l.12.07 11.4-11.4v-.27L1.34 0.43l-.12.07z" fill="rgba(26,20,16,0.2)"/>
              <path d="M16.45 15.9l-3.79-3.79v-.27l3.8-3.8.08.05 4.5 2.56c1.28.73 1.28 1.92 0 2.65l-4.5 2.56-.09.04z" fill="rgba(26,20,16,0.2)"/>
              <path d="M16.54 15.86L12.66 12 1.22 23.5c.42.44 1.11.5 1.89.05l13.43-7.69" fill="rgba(26,20,16,0.2)"/>
              <path d="M16.54 8.14L3.11.45C2.33 0 1.64.06 1.22.5L12.66 12l3.88-3.86z" fill="rgba(26,20,16,0.2)"/>
            </svg>
            <div className="text-left">
              <p className="text-[9px] font-medium leading-none mb-0.5" style={{ color: "rgba(26,20,16,0.3)" }}>Coming soon on</p>
              <p className="text-base font-bold leading-none" style={{ color: "rgba(26,20,16,0.3)" }}>Google Play</p>
            </div>
          </div>

        </div>

        <p className="text-[11px]" style={{ color: "rgba(26,20,16,0.32)" }}>
          Free to download &nbsp;·&nbsp; iOS 16+ &nbsp;·&nbsp; Ireland
        </p>
      </section>

      {/* Screenshots strip */}
      <div className="w-full overflow-x-auto pb-8" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-4 px-6" style={{ width: "max-content", margin: "0 auto" }}>
          {screenshots.map((s) => (
            <div
              key={s.src}
              className="shrink-0 rounded-3xl overflow-hidden"
              style={{
                width: 200,
                height: 434,
                boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={200}
                height={434}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 px-6 pt-10 pb-4">
        {[
          { label: "For business owners", desc: "Manage loyalty programs, view insights, send push notifications" },
          { label: "For customers", desc: "Collect stamps, redeem rewards, discover local spots" },
          { label: "One app", desc: "Sign in as a business or customer, one download" },
        ].map((f) => (
          <div
            key={f.label}
            className="rounded-2xl px-5 py-4 text-center max-w-[200px]"
            style={{ background: "rgba(26,20,16,0.04)", border: "1px solid rgba(26,20,16,0.07)" }}
          >
            <p className="text-xs font-bold mb-1" style={{ color: "#1a1410" }}>{f.label}</p>
            <p className="text-[11px] leading-relaxed" style={{ color: "rgba(26,20,16,0.45)" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Re-CTA */}
      <div className="flex flex-col items-center px-6 pt-10 pb-16 text-center">
        <p className="text-sm mb-5 font-medium" style={{ color: "rgba(26,20,16,0.45)" }}>Ready to get started?</p>
        <a
          href="https://apps.apple.com/ie/app/clientin/id6759510406"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-xl text-sm font-bold tracking-wide transition-opacity hover:opacity-80"
          style={{ background: "#1a1410", color: "#fff" }}
        >
          Download on the App Store →
        </a>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-5 max-w-5xl mx-auto" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
        <span className="text-[11px]" style={{ color: "rgba(26,20,16,0.32)" }}>
          © {new Date().getFullYear()} clientIn &nbsp;·&nbsp;
          <a href="/terms" className="hover:opacity-70 transition-opacity">Terms</a>
          &nbsp;·&nbsp;
          <a href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</a>
        </span>
        <span className="text-[11px]" style={{ color: "rgba(26,20,16,0.28)" }}>Ireland</span>
      </footer>

    </div>
  );
}

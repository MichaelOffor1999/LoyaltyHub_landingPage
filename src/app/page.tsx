import Image from "next/image";
import FeatureList from "./components/FeatureList";
import IndustryGrid from "./components/IndustryGrid";
import SocialProof from "./components/SocialProof";
import AnalyticsSpotlight from "./components/AnalyticsSpotlight";
import FAQ from "./components/FAQ";
import WaitlistForm from "./components/WaitlistForm";
import ScrollReveal from "./components/ScrollReveal";
import StepCard from "./components/StepCard";
import HowItWorksCards from "./components/ui/how-it-works-cards";
import { HeroSplineCard } from "./components/ui/hero-spline-card";
import TopoBackground from "./components/ui/topo-background";
import AnimatedHeroHeadline from "./components/AnimatedHeroHeadline";

export default function Home() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--background)" }}>

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
        style={{ background: "#c97b3a", color: "#fff" }}
      >
        Skip to main content
      </a>

      {/* ─── Top bar: logo + CTA ─── */}
      <div className="fixed top-0 inset-x-0 z-[60] flex items-center justify-between px-5 sm:px-10 py-4 pointer-events-none">
        <a href="#top" className="pointer-events-auto">
          <span className="font-black text-sm sm:text-base tracking-[0.15em] uppercase" style={{ color: "#ffffff" }}>
            clientIn
          </span>
        </a>
        <a
          href="#waitlist"
          className="pointer-events-auto px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all hover:opacity-90"
          style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.08)" }}
        >
          Join Waitlist
        </a>
      </div>

      {/* ─── Full-bleed dark hero — sticky so light content slides over it ─── */}
      <div
        className="w-full"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
            overflow: "hidden",
            background: "linear-gradient(135deg, #0d0805 0%, #1a0f06 30%, #2b1608 55%, #1a0c05 80%, #0a0604 100%)",
        }}
      >
        {/* Dark gradient overlay — keeps text crisp, darkens bottom for panel transition */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.78) 100%)", zIndex: 1 }} />
        {/* Topographic contour-line background — sits on top of photo */}
        <TopoBackground />

        {/* Hero — full width, nav-inset padding */}
        <div className="w-full px-8 sm:px-14 relative flex flex-col pt-[72px]" style={{ zIndex: 3 }}>

          {/* ── First viewport: Starlink-style — headline upper-centre, form anchored near bottom ── */}
          <section id="top" className="w-full flex flex-col items-center" style={{ minHeight: "calc(100dvh - 72px)" }}>

            {/* Top spacer — smaller to push everything up */}
            <div style={{ flex: "0.3" }} />

            {/* Headline — centred, single line */}
            <div className="w-full flex flex-col justify-center items-center" style={{ fontSize: "clamp(1.2rem, 5vw, 4rem)" }}>
              <AnimatedHeroHeadline />
            </div>

            {/* Subtitle — bold, Starlink-style */}
            <ScrollReveal variant="fade-up" delay={700} className="flex flex-col items-center w-full text-center mt-4">
              <p className="max-w-2xl" style={{ lineHeight: 1.5 }}>
                <span className="block text-lg sm:text-xl md:text-2xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>Stop guessing.</span>
                <span className="block text-lg sm:text-xl md:text-2xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>Know who&apos;s loyal and who&apos;s leaving.</span>
              </p>
            </ScrollReveal>

            {/* Form — closer to subtitle */}
            <ScrollReveal variant="fade-up" delay={900} className="flex flex-col items-center w-full text-center mt-8">
              <div className="w-full max-w-xl" id="waitlist">
                <WaitlistForm large light />
              </div>
            </ScrollReveal>

            {/* Bottom spacer — fills remaining space */}
            <div style={{ flex: "1" }} />

          </section>

          {/* ── Below the fold: card ── */}
          <div className="w-full flex flex-col items-center pb-16">
            {/* Interactive 3D loyalty card */}
            <div className="w-full max-w-[460px]">
              <HeroSplineCard />
            </div>
          </div>

          {/* Trusted-by strip */}
          <div className="pb-16 flex flex-col items-center gap-3 w-full">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Trusted by</p>
            <div className="overflow-hidden w-full max-w-lg">
              <div style={{ display: "flex", flexWrap: "nowrap", width: "max-content", animation: "marquee-scroll 20s linear infinite" }}>
                {[0, 1, 2, 3].map((copy) => (
                  <div key={copy} style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", flexShrink: 0, gap: "3.5rem", padding: "0 1.75rem" }} aria-hidden={copy > 0}>
                    <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
                        <Image src="/logo-mtb.jpg" alt="MTB Barbershop" width={36} height={36} style={{ objectFit: "contain", padding: 2 }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>MTB Barbershop</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
                        <Image src="/logo-relief.jpg" alt="Relief" width={36} height={36} style={{ objectFit: "cover", objectPosition: "center" }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>Relief</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
                        <Image src="/logo-10cuts.jpg" alt="10 Cuts" width={72} height={72} style={{ objectFit: "cover", objectPosition: "center" }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>10 Cuts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>{/* end hero constrained */}
      </div>{/* end dark hero */}

      {/* ─── Panel 2: Industry + How it Works — scrolls over dark hero ─── */}
      <div className="w-full relative" style={{ position: "relative", zIndex: 10, background: "#1a1612", borderRadius: "28px 28px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)", marginTop: "-2px" }}>
      <main id="main-content" className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 pt-12">

        {/* Industry Grid */}
        <ScrollReveal className="w-full" variant="scale-up" threshold={0.08}>
          <IndustryGrid />
        </ScrollReveal>

        {/* How it works */}
        <section
          id="how-it-works"
          className="w-full mt-16 rounded-3xl py-14 sm:py-16 px-6 sm:px-10 relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)", boxShadow: "0 0 60px rgba(201,123,58,0.06)" }}
        >
          <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "350px", background: "radial-gradient(ellipse, rgba(201,123,58,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
          <ScrollReveal delay={0} className="text-center mb-10 relative" variant="blur-in">
            <div
              className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
              style={{ background: "rgba(201,123,58,0.12)", color: "#e8944a", border: "1px solid rgba(201,123,58,0.3)" }}
            >
              How it works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--foreground)" }}>
              Up and running in 3 steps
            </h2>
          </ScrollReveal>

          {/* Mobile: cards + timeline */}
          <ScrollReveal className="sm:hidden" variant="fade-up">
            <div className="flex justify-center mb-8" style={{ transform: "scale(0.82)", transformOrigin: "top center" }}>
              <HowItWorksCards />
            </div>
            <div className="flex flex-col gap-0 px-2">
              {[
                { step: "01", title: "Create your program", desc: "Set your rewards, tiers, and branding in minutes." },
                { step: "02", title: "Invite your customers", desc: "Customers download the free app and get their own QR code — you scan it at the till to stamp their card." },
                { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards — you watch revenue grow." },
              ].map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black shrink-0"
                      style={{
                        background: i === 1 ? "linear-gradient(135deg, #c97b3a, #e8944a)" : "rgba(201,123,58,0.12)",
                        color: i === 1 ? "#fff" : "#e8944a",
                        boxShadow: i === 1 ? "0 4px 12px rgba(201,123,58,0.3)" : "none",
                      }}
                    >
                      {s.step}
                    </div>
                    {i < 2 && <div className="w-px flex-1 my-1" style={{ background: "rgba(201,123,58,0.25)" }} />}
                  </div>
                  <div className={`pb-${i < 2 ? "6" : "0"} pt-1`}>
                    <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "#e8944a" }}>{`Step ${s.step}`}</span>
                    <h3 className="text-base font-bold mt-0.5" style={{ color: "var(--foreground)" }}>{s.title}</h3>
                    <p className="text-sm font-medium mt-1 leading-relaxed" style={{ color: "var(--text-sub)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Desktop: stacked loyalty cards + step list side-by-side */}
          <ScrollReveal className="hidden sm:flex items-center justify-center gap-10 lg:gap-16" staggerChildren variant="fade-left" staggerBase={160}>
            {/* Left: stacked cards */}
            <div className="shrink-0 py-10 pl-4 max-w-[380px]">
              <HowItWorksCards />
            </div>

            {/* Right: numbered steps */}
            <div className="flex flex-col gap-8 max-w-xs">
              {[
                { step: "01", title: "Create your program", desc: "Set your rewards, tiers, and branding in minutes." },
                { step: "02", title: "Invite your customers", desc: "Customers download the free app and get their own QR code — you scan it at the till to stamp their card." },
                { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards — you watch revenue grow." },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div
                    className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black"
                    style={{
                      background: i === 1 ? "linear-gradient(135deg,#c97b3a,#e8944a)" : "rgba(201,123,58,0.1)",
                      color: i === 1 ? "#fff" : "#e8944a",
                      boxShadow: i === 1 ? "0 4px 16px rgba(201,123,58,0.3)" : "none",
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#e8944a" }}>Step {s.step}</p>
                    <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>{s.title}</h3>
                    <p className="text-sm font-medium leading-relaxed mt-1" style={{ color: "var(--text-sub)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

      </main>
      </div>{/* end panel 2 */}

      {/* ─── Panel 3: Features + Analytics + Social Proof + FAQ ─── */}
      <div className="w-full relative" style={{ background: "#141210" }}>
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-16">

          {/* Feature List */}
          <section id="features" className="w-full">
            <FeatureList />
          </section>

          {/* Analytics Spotlight */}
          <ScrollReveal className="w-full" variant="flip-up" threshold={0.08}>
            <AnalyticsSpotlight />
          </ScrollReveal>

          {/* Social Proof */}
          <SocialProof />

          {/* FAQ */}
          <div id="faq" className="w-full">
            <ScrollReveal className="w-full" variant="fade-up" threshold={0.06}>
              <FAQ />
            </ScrollReveal>
          </div>

        </div>
      </div>{/* end panel 3 */}

      {/* ─── Panel 4: CTA + Footer ─── */}
      <div className="w-full relative overflow-hidden" style={{ background: "#0f0d0a" }}>
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(201,123,58,0.15) 0%, transparent 70%)" }} />
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-24 text-center relative z-10">
          <ScrollReveal staggerChildren variant="scale-up" staggerBase={120} className="w-full flex flex-col items-center">
            <div
              className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-5"
              style={{ background: "rgba(201,123,58,0.12)", color: "#e8944a", border: "1px solid rgba(201,123,58,0.3)" }}
            >
              Get started
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "#f0ece6" }}>
              Ready to grow your business?
            </h2>
            <p className="text-base mb-8 max-w-lg" style={{ color: "rgba(240,236,230,0.65)" }}>
              Join hundreds of business owners already on the waitlist. Sign up today and get your <span style={{ fontWeight: 700, color: "#e8944a" }}>first month completely free</span> — no credit card required.
            </p>
            <div className="w-full max-w-xl">
              <WaitlistForm large />
            </div>
          </ScrollReveal>

          {/* Footer */}
          <footer className="w-full pt-16 mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "rgba(240,236,230,0.1)" }}>
            <div className="flex items-center gap-2">
              <Image src="/favicon.png" alt="clientIn logo" width={24} height={24} className="rounded-md" />
              <span className="text-sm font-bold" style={{ color: "#f0ece6" }}>clientIn</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/terms" className="text-xs hover:underline py-2 px-1" aria-label="Terms of Service" style={{ color: "rgba(240,236,230,0.5)" }}>Terms of Service</a>
              <a href="/privacy" className="text-xs hover:underline py-2 px-1" aria-label="Privacy Policy" style={{ color: "rgba(240,236,230,0.5)" }}>Privacy Policy</a>
            </div>
            <span className="text-xs" style={{ color: "rgba(240,236,230,0.4)" }}>
              &copy; {new Date().getFullYear()} clientIn. All rights reserved.
            </span>
          </footer>
        </div>
      </div>{/* end panel 5 */}
    </div>
  );
}

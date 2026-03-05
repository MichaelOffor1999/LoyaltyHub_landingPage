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
import { AdaptivePillNav } from "./components/ui/3d-adaptive-navigation-bar";

export default function Home() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "transparent" }}>

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
        style={{ background: "#c97b3a", color: "#fff" }}
      >
        Skip to main content
      </a>

      {/* Adaptive pill navigation — fixed, centred, always on top */}
      <AdaptivePillNav />

      {/* Top Banner */}
      <div
        className="w-full py-2.5 px-4 flex items-center justify-center text-sm font-semibold gap-2"
        style={{ background: "rgba(201,123,58,0.12)", borderBottom: "1px solid rgba(201,123,58,0.2)", color: "#e8944a" }}
      >
        <span>🎁</span>
        <span className="text-center text-xs sm:text-sm">Limited offer: Sign up for early access and get your <strong>first month completely free</strong></span>
      </div>

      {/* Spacer that holds scroll space for the animation */}
      <div className="w-full h-screen" aria-hidden="true" />

      {/* Scroll Morph Hero Animation - Fixed overlay, fades based on scroll */}
      <IntroAnimation />

      <main id="main-content" className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 relative z-10">

        {/* Hero */}
        <section id="top" className="w-full pt-20 pb-10">
          <ScrollReveal staggerChildren className="w-full flex flex-col items-center text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-8"
              style={{ background: "rgba(201,123,58,0.12)", border: "1px solid rgba(201,123,58,0.3)", color: "#e8944a" }}
            >
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#e8944a" }} />
              Now accepting early access applications
            </div>

            <h1
              className="text-3xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6"
              style={{ color: "var(--foreground)" }}
            >
              Turn Every Customer<br />
              Into a{" "}
              <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a, #f5b97a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Loyal Fan
              </span>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl leading-snug mb-8" style={{ color: "var(--text-sub)", fontWeight: 500 }}>
              Stop guessing. See who&apos;s coming back,{" "}
              who&apos;s drifting, and what to do about it.
            </p>

            <div className="w-full max-w-xl" id="waitlist">
              <WaitlistForm large />
            </div>

            {/* Trusted-by strip below CTA */}
            <div className="mt-6 flex flex-col items-center gap-3 w-full">
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Trusted by</p>
              <div className="overflow-hidden w-full max-w-lg">
                <div style={{ display: "flex", flexWrap: "nowrap", width: "max-content", animation: "marquee-scroll 20s linear infinite" }}>
                  {[0, 1, 2, 3].map((copy) => (
                    <div key={copy} style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", flexShrink: 0, gap: "3.5rem", padding: "0 1.75rem" }} aria-hidden={copy > 0}>
                      <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--surface-border)", flexShrink: 0 }}>
                          <Image src="/logo-mtb.jpg" alt="MTB Barbershop" width={36} height={36} style={{ objectFit: "contain", padding: 2 }} />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>MTB Barbershop</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: "50%", border: "1px solid var(--surface-border)", flexShrink: 0 }}>
                          <Image src="/logo-relief.jpg" alt="Relief" width={36} height={36} style={{ objectFit: "cover", objectPosition: "center" }} />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Relief</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: "50%", border: "1px solid var(--surface-border)", flexShrink: 0 }}>
                          <Image src="/logo-10cuts.jpg" alt="10 Cuts" width={72} height={72} style={{ objectFit: "cover", objectPosition: "center" }} />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>10 Cuts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Industry Grid */}
        <ScrollReveal className="w-full">
          <IndustryGrid />
        </ScrollReveal>

        {/* How it works */}
        <section
          id="how-it-works"
          className="w-full mt-16 rounded-3xl py-14 sm:py-16 px-6 sm:px-10 relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--surface-border)", boxShadow: "0 0 60px rgba(201,123,58,0.06)" }}
        >
          <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "350px", background: "radial-gradient(ellipse, rgba(201,123,58,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
          <ScrollReveal delay={0} className="text-center mb-10 relative">
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

          {/* Mobile: clean timeline */}
          <ScrollReveal className="sm:hidden">
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
          <ScrollReveal className="hidden sm:flex items-center justify-center gap-16 lg:gap-24">
            {/* Left: stacked cards */}
            <div className="shrink-0 py-10 pl-6">
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

        {/* Feature List */}
        <section id="features" className="w-full">
          <FeatureList />
        </section>

        {/* Analytics Spotlight */}
        <ScrollReveal className="w-full">
          <AnalyticsSpotlight />
        </ScrollReveal>

        {/* Social Proof */}
        <SocialProof />

        {/* FAQ */}
        <div id="faq" className="w-full">
          <ScrollReveal className="w-full">
            <FAQ />
          </ScrollReveal>
        </div>

        {/* Bottom CTA */}
        <section className="w-full mt-24 mb-16 flex flex-col items-center text-center rounded-3xl py-14 px-5 sm:px-8" style={{ background: "linear-gradient(135deg, #c97b3a, #e8944a)", boxShadow: "0 8px 60px rgba(201,123,58,0.35)" }}>
          <ScrollReveal staggerChildren className="w-full flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "#fff" }}>
              Ready to grow your business?
            </h2>
            <p className="text-base mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
              Join hundreds of business owners already on the waitlist. Sign up today and get your <span style={{ fontWeight: 700, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.5)" }}>first month completely free</span> — no credit card required.
            </p>
            <div className="w-full max-w-xl">
              <WaitlistForm large light />
            </div>
          </ScrollReveal>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "var(--footer-border)" }}>
          <div className="flex items-center gap-2">
            <Image src="/favicon.png" alt="Clienty logo" width={24} height={24} className="rounded-md" />
            <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Clienty</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-xs hover:underline py-2 px-1" aria-label="Terms of Service" style={{ color: "var(--text-muted)" }}>Terms of Service</a>
            <a href="/privacy" className="text-xs hover:underline py-2 px-1" aria-label="Privacy Policy" style={{ color: "var(--text-muted)" }}>Privacy Policy</a>
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} Clienty. All rights reserved.
          </span>
        </footer>
      </main>
    </div>
  );
}

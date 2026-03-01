import Image from "next/image";
import FeatureList from "./components/FeatureList";
import IndustryGrid from "./components/IndustryGrid";
import SocialProof from "./components/SocialProof";
import AnalyticsSpotlight from "./components/AnalyticsSpotlight";
import FAQ from "./components/FAQ";
import WaitlistForm from "./components/WaitlistForm";
import ScrollReveal from "./components/ScrollReveal";
import StepCard from "./components/StepCard";

export default function Home() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#f7f4ef" }}>

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
        style={{ background: "#c97b3a", color: "#fff" }}
      >
        Skip to main content
      </a>

      {/* Sticky Nav */}
      <nav
        className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4"
        aria-label="Main navigation"
        style={{
          background: "rgba(247,244,239,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <a href="#top" className="flex items-center gap-2" aria-label="Clienty — back to top">
          <Image
            src="/favicon.png"
            alt="Clienty logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-extrabold text-lg tracking-tight" style={{ color: "#111827" }}>Clienty</span>
        </a>
        <a
          href="#waitlist"
          aria-label="Join the waitlist"
          className="rounded-lg px-4 py-2.5 text-sm font-bold transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #c97b3a, #e8944a)", color: "#fff" }}
        >
          Join Waitlist
        </a>
      </nav>

      {/* Top Banner */}
      <div
        className="w-full py-2.5 px-4 flex items-center justify-center text-sm font-semibold gap-2"
        style={{ background: "rgba(201,123,58,0.1)", borderBottom: "1px solid rgba(201,123,58,0.18)", color: "#c97b3a" }}
      >
        <span>🎁</span>
        <span className="text-center text-xs sm:text-sm">Limited offer: Sign up for early access and get your <strong>first month completely free</strong></span>
      </div>

      <main id="main-content" className="w-full max-w-5xl mx-auto flex flex-col items-center px-6">

        {/* Hero */}
        <section id="top" className="w-full pt-20 pb-10">
          <ScrollReveal staggerChildren className="w-full flex flex-col items-center text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-8"
            style={{
              background: "rgba(201,123,58,0.1)",
              border: "1px solid rgba(201,123,58,0.25)",
              color: "#c97b3a",
            }}
          >
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#c97b3a" }} />
            Now accepting early access applications
          </div>

          <h1
            className="text-3xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6"
            style={{ color: "#111827" }}
          >
            Turn Every Customer<br />
            Into a{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #c97b3a, #e8944a, #f5b97a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Loyal Fan
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl leading-snug mb-8"
            style={{ color: "#374151", fontWeight: 600 }}
          >
            Stop guessing. See who&apos;s coming back,{" "}
            who&apos;s drifting, and what to do about it.
          </p>

          <div className="w-full max-w-xl" id="waitlist">
            <WaitlistForm large />
          </div>

          {/* Trusted-by strip below CTA — infinite marquee */}
          <div className="mt-6 flex flex-col items-center gap-3 w-full">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#9ca3af" }}>Trusted by</p>
            <div className="overflow-hidden w-full max-w-lg">
              <div style={{ display: "flex", flexWrap: "nowrap", width: "max-content", animation: "marquee-scroll 20s linear infinite" }}>
                {[0, 1, 2, 3].map((copy) => (
                  <div key={copy} style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", flexShrink: 0, gap: "2rem", padding: "0 1rem" }} aria-hidden={copy > 0}>
                    <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: 8, background: "#f5f0ea", border: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }}>
                        <Image src="/logo-mtb.jpg" alt="MTB Barbershop" width={36} height={36} style={{ objectFit: "contain", padding: 2 }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: "#6b7280" }}>MTB Barbershop</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}>
                        <Image src="/logo-relief.jpg" alt="Relief" width={36} height={36} style={{ objectFit: "cover", objectPosition: "center" }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: "#6b7280" }}>Relief</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 whitespace-nowrap" style={{ flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}>
                        <Image src="/logo-10cuts.jpg" alt="10 Cuts" width={72} height={72} style={{ objectFit: "cover", objectPosition: "center" }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: "#6b7280" }}>10 Cuts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* How it works */}
        <section className="w-full mt-16">
            <ScrollReveal delay={0} className="text-center mb-10">
              <div
                className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
                style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
              >
                How it works
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#111827" }}>
                Up and running in 3 steps
              </h2>
            </ScrollReveal>
            {/* Mobile: clean timeline — no card */}
            <ScrollReveal className="sm:hidden">
              <div className="flex flex-col gap-0 px-2">
                {[
                  { step: "01", title: "Create your program", desc: "Set your rewards, tiers, and branding in minutes.", highlight: "in minutes" },
                  { step: "02", title: "Invite your customers", desc: "Customers download the free app and get their own QR code — you scan it at the till to stamp their card.", highlight: "scan it at the till" },
                  { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards — you watch revenue grow.", highlight: "revenue grow" },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Timeline rail */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black shrink-0"
                        style={{
                          background: i === 1 ? "linear-gradient(135deg, #c97b3a, #e8944a)" : "rgba(201,123,58,0.1)",
                          color: i === 1 ? "#fff" : "#c97b3a",
                          boxShadow: i === 1 ? "0 4px 12px rgba(201,123,58,0.25)" : "none",
                        }}
                      >
                        {s.step}
                      </div>
                      {i < 2 && <div className="w-px flex-1 my-1" style={{ background: "rgba(201,123,58,0.2)" }} />}
                    </div>
                    {/* Content */}
                    <div className={`pb-${i < 2 ? "6" : "0"} pt-1`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "#c97b3a" }}>{`Step ${s.step}`}</span>
                      </div>
                      <h3 className="text-base font-bold mt-0.5" style={{ color: "#111827" }}>{s.title}</h3>
                      <p className="text-sm font-medium mt-1 leading-relaxed" style={{ color: "#374151" }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Desktop: 3-column cards */}
            <ScrollReveal staggerChildren staggerBase={130} className="hidden sm:grid sm:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Create your program", desc: "Set your rewards, tiers, and branding in minutes." },
                { step: "02", title: "Invite your customers", desc: "Customers download the free app and get their own QR code — you scan it at the till to stamp their card." },
                { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards — you watch revenue grow." },
              ].map((s, i) => (
                <StepCard key={i} step={s.step} title={s.title} desc={s.desc} featured={i === 1} />
              ))}
            </ScrollReveal>

        </section>

        {/* Industry Grid */}
        <ScrollReveal className="w-full">
          <IndustryGrid />
        </ScrollReveal>

        {/* Feature List */}
        <FeatureList />

        {/* Analytics Spotlight */}
        <ScrollReveal className="w-full">
          <AnalyticsSpotlight />
        </ScrollReveal>

        {/* Social Proof */}
        <SocialProof />

        {/* FAQ */}
        <ScrollReveal className="w-full">
          <FAQ />
        </ScrollReveal>

        {/* Bottom CTA */}
        <section className="w-full mt-24 mb-16 flex flex-col items-center text-center rounded-3xl py-14 px-5 sm:px-8" style={{ background: "linear-gradient(135deg, #c97b3a, #e8944a)", boxShadow: "0 8px 40px rgba(201,123,58,0.3)" }}>
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
        <footer className="w-full py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.png"
              alt="Clienty logo"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm font-bold" style={{ color: "#111827" }}>Clienty</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-xs hover:underline py-2 px-1" aria-label="Terms of Service" style={{ color: "#6b7280" }}>Terms of Service</a>
            <a href="/privacy" className="text-xs hover:underline py-2 px-1" aria-label="Privacy Policy" style={{ color: "#6b7280" }}>Privacy Policy</a>
          </div>
          <span className="text-xs" style={{ color: "#6b7280" }}>
            &copy; {new Date().getFullYear()} Clienty. All rights reserved.
          </span>
        </footer>
      </main>
    </div>
  );
}

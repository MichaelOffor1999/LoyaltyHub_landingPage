import Image from "next/image";
import FeatureList from "./components/FeatureList";
import IndustryGrid from "./components/IndustryGrid";
import SocialProof from "./components/SocialProof";
import AnalyticsSpotlight from "./components/AnalyticsSpotlight";
import FAQ from "./components/FAQ";
import ScrollReveal from "./components/ScrollReveal";
import StepCard from "./components/StepCard";
import HowItWorksCards from "./components/ui/how-it-works-cards";
import { HeroSplineCard } from "./components/ui/hero-spline-card";
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
          <span className="font-black text-sm sm:text-base tracking-[0.15em] uppercase" style={{ color: "#1a1410" }}>
            clientIn
          </span>
        </a>
        <a
          href="/subscribe"
          className="pointer-events-auto px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all hover:opacity-90"
          style={{ border: "1px solid rgba(0,0,0,0.18)", color: "#1a1410", backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.05)" }}
        >
          Manage Plan
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
            background: "linear-gradient(160deg, #f5f0e8 0%, #ede7db 30%, #e8dfd0 60%, #ede7db 80%, #f5f0e8 100%)",
        }}
      >
        {/* Dark gradient overlay — keeps text crisp, darkens bottom for panel transition */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(245,240,232,0.6) 100%)", zIndex: 1 }} />
        {/* Hero — full width, nav-inset padding */}
        <div className="w-full px-5 sm:px-14 relative flex flex-col pt-[72px]" style={{ zIndex: 3 }}>

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
                <span className="block text-lg sm:text-xl md:text-2xl font-bold" style={{ color: "rgba(26,20,16,0.85)" }}>Stop guessing.</span>
                <span className="block text-lg sm:text-xl md:text-2xl font-bold" style={{ color: "rgba(26,20,16,0.85)" }}>Know who&apos;s loyal and who&apos;s leaving.</span>
              </p>
            </ScrollReveal>

            {/* CTA buttons — closer to subtitle */}
            <ScrollReveal variant="fade-up" delay={900} className="flex flex-col items-center w-full text-center mt-8">
              <div className="flex flex-col sm:flex-row items-center gap-3" id="waitlist">
                <a
                  href="#how-it-works"
                  className="px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all hover:opacity-80 whitespace-nowrap"
                  style={{ background: "rgba(0,0,0,0.06)", color: "#1a1410", border: "1px solid rgba(0,0,0,0.15)" }}
                >
                  See How It Works
                </a>
              </div>
              <p className="text-xs mt-4" style={{ color: "rgba(26,20,16,0.45)", letterSpacing: "0.02em" }}>
                30-day free trial · Cancel anytime
              </p>
            </ScrollReveal>

            {/* Bottom spacer — fills remaining space */}
            <div style={{ flex: "1" }} />

          </section>


        </div>{/* end hero constrained */}
      </div>{/* end dark hero */}

      {/* ─── Panel 2: Industry + How it Works — scrolls over dark hero ─── */}
      <div className="w-full relative" style={{ position: "relative", zIndex: 10, background: "#f5f0e8", borderRadius: "28px 28px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.08)", marginTop: "-2px" }}>
      <main id="main-content" className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 pt-12">

        {/* Industry Grid */}
        <ScrollReveal className="w-full" variant="scale-up" threshold={0.08}>
          <IndustryGrid />
        </ScrollReveal>

        {/* How it works */}
        <section
          id="how-it-works"
          className="w-full mt-16 py-14 sm:py-16 relative"
        >
          <ScrollReveal delay={0} className="text-center mb-10" variant="blur-in">
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
      <div className="w-full relative" style={{ background: "#ede8df" }}>
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-16">

          {/* Feature List */}
          <section id="features" className="w-full">
            <FeatureList />
          </section>

          {/* Collab Loyalty Programs */}
          <ScrollReveal className="w-full mt-16" variant="fade-up" threshold={0.08}>
            <section className="w-full py-16 sm:py-20">
              <div className="flex flex-col lg:flex-row gap-16 items-start">

                {/* Left — copy */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
                    New customers.<br />No ad spend.
                  </h2>
                  <p className="text-base mb-3 max-w-md" style={{ color: "var(--text-sub)" }}>
                    Flyers cost money. Instagram ads cost more. A referral from a trusted local business? Free — and it converts at 5x the rate.
                  </p>
                  <p className="text-base mb-8 max-w-md font-semibold" style={{ color: "var(--foreground)" }}>
                    ClientIn Collabs lets you team up with a nearby business and instantly tap into their loyal customer base.
                  </p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {[
                      "Partner with a complementary business — a gym & a smoothie bar, a salon & a nail studio",
                      "Their customers earn stamps with you. Your customers earn stamps with them",
                      "One shared reward keeps both customer bases engaged",
                      "Your data, your branding — the collab is opt-in, not a merger",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-sub)" }}>
                        <span className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black" style={{ background: "rgba(201,123,58,0.15)", color: "#e8944a" }}>✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right — stat column */}
                <div className="w-full lg:w-[240px] shrink-0 flex flex-col">
                  {[
                    { stat: "5×", label: "higher conversion than paid ads", sub: "Word-of-mouth from a trusted neighbour just hits different." },
                    { stat: "£0", label: "customer acquisition cost", sub: "No budget needed. Your partner's loyalty does the heavy lifting." },
                    { stat: "2×", label: "loyalty card engagement", sub: "A shared reward gives customers twice the reason to keep coming back." },
                  ].map((item, i) => (
                    <div key={i} className={`py-7 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                      <p className="text-5xl font-black mb-2 leading-none" style={{ color: "#c97b3a" }}>{item.stat}</p>
                      <p className="text-sm font-bold mb-1" style={{ color: "var(--foreground)" }}>{item.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.sub}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>
          </ScrollReveal>

          {/* Analytics Spotlight */}
          <ScrollReveal className="w-full" variant="flip-up" threshold={0.08}>
            <AnalyticsSpotlight />
          </ScrollReveal>

          {/* WhatsApp AI Agent */}
          <ScrollReveal className="w-full mt-16" variant="fade-up" threshold={0.08}>
            <section className="w-full py-16 sm:py-20">
              <div className="flex flex-col lg:flex-row gap-16 items-start">

                {/* Left — copy */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
                    Tomorrow looks quiet.<br />Let&apos;s fix that.
                  </h2>
                  <p className="text-base mb-6 max-w-md" style={{ color: "var(--text-sub)" }}>
                    ClientIn&apos;s WhatsApp agent watches your business while you&apos;re on the floor — then tells you exactly what to do about it. No dashboards. No apps. Just a message.
                  </p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {[
                      "Proactively warns you before a slow day hits",
                      "Suggests and sends campaigns — with your approval",
                      "Answers questions like a business partner who knows your data",
                      "Works 24/7. Zero learning curve.",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-sub)" }}>
                        <span className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black" style={{ background: "rgba(37,211,102,0.15)", color: "#25d366" }}>✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right — WhatsApp chat mock */}
                <div className="w-full lg:w-[340px] shrink-0">
                  {/* Phone chrome */}
                  <div className="rounded-[28px] overflow-hidden shadow-2xl" style={{ background: "#111b21", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* WhatsApp header */}
                    <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#1f2c34" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: "linear-gradient(135deg, #c97b3a, #e8944a)", color: "#fff" }}>CI</div>
                      <div>
                        <p className="text-sm font-semibold leading-none" style={{ color: "#e9edef" }}>ClientIn AI</p>
                        <p className="text-xs mt-0.5" style={{ color: "#8696a0" }}>Your business manager</p>
                      </div>
                    </div>
                    {/* Chat area */}
                    <div className="flex flex-col gap-2 px-3 py-4" style={{ background: "#0b141a", minHeight: "340px" }}>
                      {/* Incoming */}
                      <div className="flex flex-col items-start gap-2">
                        <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm text-sm leading-relaxed" style={{ background: "#1f2c34", color: "#e9edef" }}>
                          Hey, heads up — Mondays tend to be your quietest day. You also have 11 customers who haven&apos;t visited in over 3 weeks.
                          <span className="block text-right text-[10px] mt-1" style={{ color: "#8696a0" }}>Sun 8:14 am</span>
                        </div>
                        <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm text-sm leading-relaxed" style={{ background: "#1f2c34", color: "#e9edef" }}>
                          Want me to send them a &ldquo;Come in today — 20% off, today only&rdquo; message? I&apos;ll wait for your go-ahead before sending anything.
                          <span className="block text-right text-[10px] mt-1" style={{ color: "#8696a0" }}>Sun 8:14 am</span>
                        </div>
                      </div>
                      {/* Outgoing */}
                      <div className="flex justify-end">
                        <div className="max-w-[75%] px-3 py-2 rounded-2xl rounded-tr-sm text-sm" style={{ background: "#005c4b", color: "#e9edef" }}>
                          Yeah go for it
                          <span className="block text-right text-[10px] mt-1" style={{ color: "rgba(233,237,239,0.6)" }}>8:16 am ✓✓</span>
                        </div>
                      </div>
                      {/* Incoming */}
                      <div className="flex flex-col items-start">
                        <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm text-sm leading-relaxed" style={{ background: "#1f2c34", color: "#e9edef" }}>
                          Done. Sent to 11 customers. Offer expires tonight at midnight.
                          <span className="block text-right text-[10px] mt-1" style={{ color: "#8696a0" }}>Sun 8:16 am</span>
                        </div>
                      </div>
                      {/* Date divider */}
                      <div className="flex justify-center my-1">
                        <span className="text-[10px] px-3 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#8696a0" }}>Monday</span>
                      </div>
                      {/* Incoming next morning */}
                      <div className="flex flex-col items-start">
                        <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm text-sm leading-relaxed" style={{ background: "#1f2c34", color: "#e9edef" }}>
                          Morning! 6 of those 11 came in yesterday. Looks like a good Monday after all.
                          <span className="block text-right text-[10px] mt-1" style={{ color: "#8696a0" }}>9:05 am</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
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
      <div className="w-full relative overflow-hidden" style={{ background: "#e8e2d6" }}>
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(201,123,58,0.15) 0%, transparent 70%)" }} />
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-24 text-center relative z-10">
          <ScrollReveal staggerChildren variant="scale-up" staggerBase={120} className="w-full flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "#1a1410" }}>
              Already a customer?
            </h2>
            <p className="text-base mb-8 max-w-lg" style={{ color: "rgba(26,20,16,0.6)" }}>
              Manage your subscription, view invoices, and change your plan — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="/subscribe"
                className="px-10 py-4 rounded-xl text-base font-black tracking-wider uppercase transition-all hover:opacity-90 whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #c97b3a, #e8944a)",
                  color: "#fff",
                  boxShadow: "0 0 30px 2px rgba(201,123,58,0.35)",
                }}
              >
                Manage My Plan →
              </a>
            </div>
          </ScrollReveal>

          {/* Footer */}
          <footer className="w-full pt-16 mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "rgba(26,20,16,0.12)" }}>
            <div className="flex items-center gap-2">
              <Image src="/favicon.png" alt="clientIn logo" width={24} height={24} className="rounded-md" />
              <span className="text-sm font-bold" style={{ color: "#1a1410" }}>clientIn</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/terms" className="text-xs hover:underline py-2 px-1" aria-label="Terms of Service" style={{ color: "rgba(26,20,16,0.5)" }}>Terms of Service</a>
              <a href="/privacy" className="text-xs hover:underline py-2 px-1" aria-label="Privacy Policy" style={{ color: "rgba(26,20,16,0.5)" }}>Privacy Policy</a>
            </div>
            <span className="text-xs" style={{ color: "rgba(26,20,16,0.4)" }}>
              &copy; {new Date().getFullYear()} clientIn. All rights reserved.
            </span>
          </footer>
        </div>
      </div>{/* end panel 5 */}
    </div>
  );
}

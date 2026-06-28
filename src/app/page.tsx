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
                { step: "02", title: "Customers tap to check in", desc: "Customers tap their phone on your NFC tag at the counter, loyalty card stamped instantly. QR code is always available as a backup." },
                { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards. You watch revenue grow." },
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
                { step: "02", title: "Customers tap to check in", desc: "Customers tap their phone on your NFC tag at the counter, loyalty card stamped instantly. QR code is always available as a backup." },
                { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards. You watch revenue grow." },
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

        {/* Video Marketplace */}
        <ScrollReveal className="w-full mt-4" variant="fade-up" threshold={0.08}>
          <section className="w-full py-16 sm:py-20">
            <div className="flex flex-col lg:flex-row gap-16 items-start">

              {/* Left — copy */}
              <div className="flex-1 min-w-0">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold mb-4"
                  style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
                >
                  Video Marketplace
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
                  Your video.<br />Their first impression.
                </h2>
                <p className="text-base mb-3 max-w-md" style={{ color: "var(--text-sub)" }}>
                  Customers browsing the clientIn Discover page aren&apos;t just reading names and addresses. They&apos;re watching short promo videos and choosing who to visit based on what they see.
                </p>
                <p className="text-base mb-8 max-w-md font-semibold" style={{ color: "var(--foreground)" }}>
                  Upload a short video to your clientIn profile and appear in the local video marketplace instantly. Your best work, in front of customers already looking for what you offer.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    "Upload once. Your video lives on your clientIn profile permanently",
                    "Customers discover you through the in-app video marketplace before they even visit",
                    "Stand out from text-only listings with video that shows what you actually do",
                    "Customers who watch your video arrive already sold on what you offer",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-sub)" }}>
                      <span className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black" style={{ background: "rgba(201,123,58,0.15)", color: "#e8944a" }}>✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — video in phone frame */}
              <div className="flex items-center justify-center w-full lg:w-auto shrink-0">
                <div
                  className="relative w-full max-w-[280px] mx-auto p-[10px]"
                  style={{
                    borderRadius: 44,
                    background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
                    boxShadow: "0 0 0 1.5px #3a3a3a, 0 0 0 3px #111, 0 20px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Side buttons */}
                  <div className="absolute -left-[3px] top-[80px] w-[3px] h-8 rounded-l-sm" style={{ background: "#2a2a2a" }} />
                  <div className="absolute -left-[3px] top-[124px] w-[3px] h-10 rounded-l-sm" style={{ background: "#2a2a2a" }} />
                  <div className="absolute -left-[3px] top-[172px] w-[3px] h-10 rounded-l-sm" style={{ background: "#2a2a2a" }} />
                  <div className="absolute -right-[3px] top-[120px] w-[3px] h-14 rounded-r-sm" style={{ background: "#2a2a2a" }} />

                  {/* Screen */}
                  <div style={{ borderRadius: 36, overflow: "hidden", background: "#000" }}>
                    <video
                      src="/promo-demo.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>
        </ScrollReveal>

      </main>
      </div>{/* end panel 2 */}

      {/* ─── Panel 3: Features + Analytics + Social Proof + FAQ ─── */}
      <div className="w-full relative" style={{ background: "#ede8df" }}>
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-16">

          {/* Feature List */}
          <section id="features" className="w-full">
            <FeatureList />
          </section>

          {/* Customer App */}
          <ScrollReveal className="w-full mt-8" variant="fade-up" threshold={0.08}>
            <section className="w-full py-16 sm:py-20">
              <div className="flex flex-col lg:flex-row gap-16 items-start">

                {/* Left — copy */}
                <div className="flex-1 min-w-0">
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold mb-4"
                    style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
                  >
                    One app
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
                    One app.<br />Two experiences.
                  </h2>
                  <p className="text-base mb-3 max-w-md" style={{ color: "var(--text-sub)" }}>
                    clientIn is a single app. You just choose how you sign in. Business owners log in to manage their loyalty program. Customers log in to collect stamps and discover local spots.
                  </p>
                  <p className="text-base mb-8 max-w-md font-semibold" style={{ color: "var(--foreground)" }}>
                    Same app, same download. The experience adapts to who you are the moment you sign in.
                  </p>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Sign in as a business to manage your program, view insights and send notifications",
                      "Sign in as a customer to browse Discover, collect loyalty cards and redeem rewards",
                      "Digital loyalty wallet with all their cards in one place, updated in real time",
                      "Customers watch your promo video on Discover before they even visit",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-sub)" }}>
                        <span className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black" style={{ background: "rgba(201,123,58,0.15)", color: "#e8944a" }}>✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right — two-sided stat cards */}
                <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-4">
                  {/* Business mode */}
                  <div className="rounded-2xl p-5" style={{ background: "rgba(201,123,58,0.06)", border: "1px solid rgba(201,123,58,0.18)" }}>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#c97b3a" }}>Business sign-in</p>
                    {["Manage your loyalty program", "View customer insights", "Send push notifications", "Run Collabs with nearby businesses"].map((f, i) => (
                      <div key={i} className={`flex items-center gap-2 py-2 text-xs font-medium ${i < 3 ? "border-b" : ""}`} style={{ borderColor: "rgba(201,123,58,0.12)", color: "rgba(26,20,16,0.7)" }}>
                        <span className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black" style={{ background: "rgba(201,123,58,0.15)", color: "#e8944a" }}>✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                  {/* Customer mode */}
                  <div className="rounded-2xl p-5" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.09)" }}>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(26,20,16,0.45)" }}>Customer sign-in</p>
                    {["Discover nearby businesses", "Collect digital loyalty cards", "Track stamps in real time", "Redeem rewards with one tap"].map((f, i) => (
                      <div key={i} className={`flex items-center gap-2 py-2 text-xs font-medium ${i < 3 ? "border-b" : ""}`} style={{ borderColor: "rgba(0,0,0,0.06)", color: "rgba(26,20,16,0.6)" }}>
                        <span className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black" style={{ background: "rgba(0,0,0,0.06)", color: "rgba(26,20,16,0.5)" }}>✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>
          </ScrollReveal>

          {/* Engagement Tools: Vouchers, Push Notifications, Video */}
          <ScrollReveal className="w-full" variant="fade-up" threshold={0.08}>
            <section className="w-full pb-16 sm:pb-20">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--foreground)" }}>
                  More ways to fill your diary
                </h2>
                <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: "var(--text-sub)" }}>
                  Beyond stamps and rewards, clientIn gives you powerful tools to reach customers and drive visits.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: (
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#c97b3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#c97b3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    title: "Push Notifications",
                    desc: "Send targeted messages to exactly the right customers: at-risk customers who need a nudge, VIPs deserving a thank-you, or everyone at once.",
                  },
                  {
                    icon: (
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" stroke="#c97b3a" strokeWidth="1.8"/>
                        <path d="M7.5 7.5a6.5 6.5 0 0 0 0 9" stroke="#e8944a" strokeWidth="1.6" strokeLinecap="round"/>
                        <path d="M16.5 7.5a6.5 6.5 0 0 1 0 9" stroke="#e8944a" strokeWidth="1.6" strokeLinecap="round"/>
                        <path d="M4.5 4.5a10.5 10.5 0 0 0 0 15" stroke="#c97b3a" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.45"/>
                        <path d="M19.5 4.5a10.5 10.5 0 0 1 0 15" stroke="#c97b3a" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.45"/>
                      </svg>
                    ),
                    title: "Tap or scan. Stamped instantly.",
                    desc: "Two ways to check in: customers tap your NFC tag for a hands-free stamp, or you scan their QR code from the app on your business device. Your call, every time.",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 flex flex-col gap-4"
                    style={{
                      background: "rgba(201,123,58,0.04)",
                      border: "1px solid rgba(201,123,58,0.14)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(201,123,58,0.1)", border: "1px solid rgba(201,123,58,0.2)" }}
                    >
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-1.5" style={{ color: "var(--foreground)" }}>{card.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

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
                    Flyers cost money. Instagram ads cost more. A referral from a trusted local business? Free, and it converts at 5x the rate.
                  </p>
                  <p className="text-base mb-8 max-w-md font-semibold" style={{ color: "var(--foreground)" }}>
                    ClientIn Collabs lets you team up with a nearby business and instantly tap into their loyal customer base.
                  </p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {[
                      "Partner with a complementary business like a gym & a smoothie bar, or a salon & a nail studio",
                      "Their customers earn stamps with you. Your customers earn stamps with them",
                      "One shared reward keeps both customer bases engaged",
                      "Your data, your branding. The collab is opt-in, not a merger",
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
              Manage your subscription, view invoices, and change your plan. All in one place.
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
              <a href="mailto:hello@clientin.co" className="text-xs hover:underline py-2 px-1" aria-label="Contact us" style={{ color: "rgba(26,20,16,0.5)" }}>hello@clientin.co</a>
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

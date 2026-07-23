import Image from "next/image";
import Navbar from "./components/Navbar";
import FeatureList from "./components/FeatureList";
import IndustryGrid from "./components/IndustryGrid";
import SocialProof from "./components/SocialProof";
import AnalyticsSpotlight from "./components/AnalyticsSpotlight";
import FAQ from "./components/FAQ";
import ScrollReveal from "./components/ScrollReveal";
import HowItWorksCards from "./components/ui/how-it-works-cards";
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

      <Navbar />

      {/* ─── Hero ─── */}
      <div
        className="w-full"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 0,
          minHeight: "100dvh",
          overflow: "hidden",
          background: "#f5f0e8",
        }}
      >
        {/* Bottom fade for panel scroll-over */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", background: "linear-gradient(to bottom, transparent, #f5f0e8)", zIndex: 1, pointerEvents: "none" }} />

        <div className="w-full h-full px-6 sm:px-10 lg:px-16 pt-[60px] relative" style={{ zIndex: 2 }}>
          <section
            id="top"
            className="w-full flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16"
            style={{ minHeight: "calc(100dvh - 60px)" }}
          >

            {/* ── Left: text ── */}
            <div className="flex-1 flex flex-col justify-center pt-10 lg:pt-0 pb-6 lg:pb-0">

              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-7" style={{ color: "rgba(26,20,16,0.38)" }}>
                Loyalty for self-care businesses
              </p>

              <div style={{ fontSize: "clamp(2rem, 4.8vw, 4.4rem)" }}>
                <AnimatedHeroHeadline />
              </div>

              <p className="text-base max-w-[400px] mt-6" style={{ color: "rgba(26,20,16,0.52)", lineHeight: 1.72 }}>
                clientIn gives every client a digital stamp card and shows you exactly who&apos;s loyal, who&apos;s drifting, and who just hit VIP.
              </p>

              <div className="flex items-center gap-3 mt-9 flex-wrap" id="waitlist">
                <a
                  href="/download"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[0.84rem] font-bold tracking-wide transition-opacity hover:opacity-80 whitespace-nowrap"
                  style={{ background: "#1a1410", color: "#fff" }}
                >
                  Start free trial →
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl text-[0.84rem] font-semibold transition-opacity hover:opacity-60 whitespace-nowrap"
                  style={{ color: "#1a1410", border: "1px solid rgba(26,20,16,0.2)" }}
                >
                  See how it works
                </a>
              </div>

              <p className="text-[11px] mt-3.5" style={{ color: "rgba(26,20,16,0.32)", letterSpacing: "0.025em" }}>
                30-day free trial · No credit card required
              </p>

              {/* Logo row */}
              <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(26,20,16,0.1)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-5" style={{ color: "rgba(26,20,16,0.28)" }}>
                  Trusted by
                </p>
                <div className="flex items-center gap-7 sm:gap-10 flex-wrap">
                  <Image src="/logo-relief.jpg" alt="Relief" width={90} height={36} className="h-7 w-auto object-contain" style={{ opacity: 0.32, filter: "grayscale(1)" }} />
                  <Image src="/logo-district4.jpg" alt="District4 Padel" width={36} height={36} className="h-7 w-auto object-contain rounded-full" style={{ opacity: 0.32, filter: "grayscale(1)" }} />
                </div>
              </div>

            </div>

            {/* ── Right: photo ── */}
            <div
              className="hidden lg:block flex-shrink-0"
              style={{ width: "46%", height: "78vh", maxHeight: 660, borderRadius: 20, overflow: "hidden", position: "relative" }}
            >
              <Image
                src="/hero-salon.jpg"
                alt="Self-care business"
                fill
                className="object-cover object-center"
                priority
              />
            </div>

          </section>
        </div>
      </div>{/* end hero */}

      {/* ─── Panel 2: Industry + How it Works ─── */}
      <div className="w-full relative" style={{ position: "relative", zIndex: 10, background: "#f5f0e8", borderRadius: "28px 28px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.06)", marginTop: "-2px" }}>
      <main id="main-content" className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 pt-12">

        {/* Industry Grid */}
        <IndustryGrid />

        {/* How it works */}
        <section id="how-it-works" className="w-full mt-20 pb-16">
          <ScrollReveal variant="fade-up">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-12" style={{ color: "var(--foreground)" }}>
              Up and running in 3 steps.
            </h2>
          </ScrollReveal>

          {/* Mobile */}
          <ScrollReveal className="sm:hidden" variant="fade-up">
            <div className="flex flex-col gap-0">
              {[
                { step: "01", title: "Create your program", desc: "Set your rewards, tiers, and branding in minutes." },
                { step: "02", title: "Customers tap to check in", desc: "Customers tap their phone on your NFC tag at the counter. Loyalty card stamped instantly. QR code is always available as a backup." },
                { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards. You watch revenue grow." },
              ].map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: "rgba(26,20,16,0.08)", color: "rgba(26,20,16,0.5)" }}
                    >
                      {s.step}
                    </div>
                    {i < 2 && <div className="w-px flex-1 my-1" style={{ background: "rgba(26,20,16,0.1)" }} />}
                  </div>
                  <div className={i < 2 ? "pb-6 pt-1" : "pt-1"}>
                    <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>{s.title}</h3>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--text-sub)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Desktop */}
          <ScrollReveal className="hidden sm:flex items-center gap-10 lg:gap-16" variant="fade-up">
            <div className="shrink-0 py-10 pl-4 max-w-[380px]">
              <HowItWorksCards />
            </div>
            <div className="flex flex-col gap-8 max-w-xs">
              {[
                { step: "01", title: "Create your program", desc: "Set your rewards, tiers, and branding in minutes." },
                { step: "02", title: "Customers tap to check in", desc: "Customers tap their phone on your NFC tag. Loyalty card stamped instantly. QR code always available as a backup." },
                { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards. You watch revenue grow." },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold" style={{ background: "rgba(26,20,16,0.07)", color: "rgba(26,20,16,0.45)" }}>
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--text-sub)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Video Marketplace */}
        <ScrollReveal className="w-full" variant="fade-up" threshold={0.08}>
          <section className="w-full py-16 sm:py-20" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
                  Video Marketplace
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "var(--foreground)" }}>
                  Your video.<br />Their first impression.
                </h2>
                <p className="text-base max-w-md mb-6" style={{ color: "var(--text-sub)", lineHeight: 1.7 }}>
                  Customers browsing the clientIn Discover page aren&apos;t just reading names. They&apos;re watching short promo videos and choosing who to visit based on what they see. Upload once and appear in the local video marketplace instantly.
                </p>
                <ul className="flex flex-col gap-4">
                  {[
                    "Your video lives on your clientIn profile permanently",
                    "Customers discover you through the in-app marketplace before they visit",
                    "Stand out from text-only listings with video that shows your work",
                    "Customers who watch your video arrive already sold",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-sub)" }}>
                      <span className="mt-[3px] shrink-0 text-xs font-bold" style={{ color: "#c97b3a" }}>·</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center w-full lg:w-auto shrink-0">
                <div className="relative w-full max-w-[260px] mx-auto p-[9px]" style={{ borderRadius: 44, background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)", boxShadow: "0 0 0 1.5px #3a3a3a, 0 0 0 3px #111, 0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
                  <div className="absolute -left-[3px] top-[80px] w-[3px] h-8 rounded-l-sm" style={{ background: "#2a2a2a" }} />
                  <div className="absolute -left-[3px] top-[124px] w-[3px] h-10 rounded-l-sm" style={{ background: "#2a2a2a" }} />
                  <div className="absolute -left-[3px] top-[172px] w-[3px] h-10 rounded-l-sm" style={{ background: "#2a2a2a" }} />
                  <div className="absolute -right-[3px] top-[120px] w-[3px] h-14 rounded-r-sm" style={{ background: "#2a2a2a" }} />
                  <div style={{ borderRadius: 36, overflow: "hidden", background: "#000" }}>
                    <video src="/promo-demo.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block" }} />
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
          <ScrollReveal className="w-full mt-4" variant="fade-up" threshold={0.08}>
            <section className="w-full py-16 sm:py-20" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
              <div className="flex flex-col lg:flex-row gap-16 items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
                    The app
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "var(--foreground)" }}>
                    One app.<br />Two experiences.
                  </h2>
                  <p className="text-base max-w-md mb-6" style={{ color: "var(--text-sub)", lineHeight: 1.7 }}>
                    clientIn is a single app. Business owners sign in to manage their loyalty program. Customers sign in to collect stamps and discover local spots. Same app, same download.
                  </p>
                  <ul className="flex flex-col gap-4">
                    {[
                      "Sign in as a business to manage your program, view insights, and send notifications",
                      "Sign in as a customer to browse Discover, collect loyalty cards, and redeem rewards",
                      "Digital loyalty wallet with all cards in one place, updated in real time",
                      "Customers watch your promo video on Discover before they even visit",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-sub)" }}>
                        <span className="mt-[3px] shrink-0 text-xs font-bold" style={{ color: "#c97b3a" }}>·</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full lg:w-[260px] shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l pt-8 lg:pt-0 lg:pl-8" style={{ borderColor: "rgba(26,20,16,0.09)" }}>
                  <div className="pb-6 mb-6" style={{ borderBottom: "1px solid rgba(26,20,16,0.09)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: "rgba(26,20,16,0.35)" }}>Business sign-in</p>
                    {["Manage your loyalty program", "View customer insights", "Send push notifications", "Run Collabs with nearby businesses"].map((f) => (
                      <p key={f} className="text-sm py-1.5" style={{ color: "rgba(26,20,16,0.65)" }}>{f}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-4" style={{ color: "rgba(26,20,16,0.35)" }}>Customer sign-in</p>
                    {["Discover nearby businesses", "Collect digital loyalty cards", "Track stamps in real time", "Redeem rewards with one tap"].map((f) => (
                      <p key={f} className="text-sm py-1.5" style={{ color: "rgba(26,20,16,0.65)" }}>{f}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Engagement Tools */}
          <ScrollReveal className="w-full" variant="fade-up" threshold={0.08}>
            <section className="w-full pb-16 sm:pb-20" style={{ borderTop: "1px solid rgba(26,20,16,0.08)", paddingTop: "4rem" }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
                Features
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--foreground)" }}>
                More ways to fill your diary.
              </h2>
              <p className="text-base max-w-lg mb-10" style={{ color: "var(--text-sub)" }}>
                Beyond stamps and rewards, clientIn gives you the tools to reach customers and drive visits.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "rgba(26,20,16,0.09)", border: "1px solid rgba(26,20,16,0.09)", borderRadius: 16, overflow: "hidden" }}>
                {[
                  {
                    title: "Push Notifications",
                    desc: "Send targeted messages to exactly the right customers: at-risk customers who need a nudge, VIPs deserving a thank-you, or everyone at once.",
                  },
                  {
                    title: "Tap or scan. Stamped instantly.",
                    desc: "Two ways to check in: customers tap your NFC tag for a hands-free stamp, or you scan their QR code from your device. Your call, every time.",
                  },
                ].map((card, i) => (
                  <div key={i} className="p-7 flex flex-col gap-3" style={{ background: "#ede8df" }}>
                    <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>{card.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Collab Loyalty Programs */}
          <ScrollReveal className="w-full" variant="fade-up" threshold={0.08}>
            <section className="w-full py-16 sm:py-20" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
              <div className="flex flex-col lg:flex-row gap-16 items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
                    Collabs
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "var(--foreground)" }}>
                    New customers.<br />No ad spend.
                  </h2>
                  <p className="text-base max-w-md mb-6" style={{ color: "var(--text-sub)", lineHeight: 1.7 }}>
                    Flyers cost money. Instagram ads cost more. A referral from a trusted local business? Free, and it converts at 5× the rate. clientIn Collabs lets you team up with a nearby business and tap into their loyal customer base.
                  </p>
                  <ul className="flex flex-col gap-4">
                    {[
                      "Partner with a complementary business, like a gym and smoothie bar, or a salon and nail studio",
                      "Their customers earn stamps with you. Your customers earn stamps with them",
                      "One shared reward keeps both customer bases engaged",
                      "Your data, your branding. The collab is opt-in, not a merger",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-sub)" }}>
                        <span className="mt-[3px] shrink-0 text-xs font-bold" style={{ color: "#c97b3a" }}>·</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full lg:w-[220px] shrink-0 border-t lg:border-t-0 pt-8 lg:pt-0" style={{ borderColor: "rgba(26,20,16,0.1)" }}>
                  <div className="flex flex-row lg:flex-col divide-x lg:divide-x-0 lg:divide-y" style={{ "--tw-divide-opacity": 1, borderColor: "rgba(26,20,16,0.1)" } as React.CSSProperties}>
                    {[
                      { stat: "5×", label: "higher conversion than paid ads" },
                      { stat: "£0", label: "customer acquisition cost" },
                      { stat: "2×", label: "loyalty card engagement" },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 py-5 lg:py-7 px-4 lg:px-0" style={{ borderColor: "rgba(26,20,16,0.1)" }}>
                        <p className="text-3xl lg:text-5xl font-black mb-1 leading-none" style={{ color: "#1a1410" }}>{item.stat}</p>
                        <p className="text-xs lg:text-sm" style={{ color: "rgba(26,20,16,0.55)" }}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Analytics Spotlight */}
          <ScrollReveal className="w-full" variant="fade-up" threshold={0.08}>
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
      <div className="w-full relative" style={{ background: "#e8e2d6" }}>
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-6 py-24 text-center">
          <ScrollReveal className="w-full flex flex-col items-center" variant="fade-up">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-6" style={{ color: "rgba(26,20,16,0.38)" }}>
              Get started
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 max-w-lg" style={{ color: "#1a1410" }}>
              Ready to fill your diary?
            </h2>
            <p className="text-base mb-10 max-w-md" style={{ color: "rgba(26,20,16,0.55)", lineHeight: 1.7 }}>
              Join hundreds of self-care businesses using clientIn to keep clients coming back.
            </p>
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <a
                href="/download"
                className="w-full text-center px-8 py-4 rounded-xl text-sm font-bold tracking-wide transition-opacity hover:opacity-80"
                style={{ background: "#1a1410", color: "#fff" }}
              >
                Download the app →
              </a>
              <a
                href="/subscribe"
                className="text-sm font-semibold transition-opacity hover:opacity-60"
                style={{ color: "rgba(26,20,16,0.55)" }}
              >
                Manage your plan →
              </a>
            </div>
            <p className="text-[11px] mt-4" style={{ color: "rgba(26,20,16,0.35)" }}>
              30-day free trial · No credit card required
            </p>
          </ScrollReveal>

          {/* Footer */}
          <footer className="w-full mt-16 pt-14" style={{ borderTop: "1px solid rgba(26,20,16,0.11)" }}>

            {/* Main grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12" style={{ borderBottom: "1px solid rgba(26,20,16,0.09)" }}>

              {/* Brand column */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <Image src="/logo.png" alt="clientIn" width={26} height={26} className="rounded-full" />
                  <span className="text-sm font-black tracking-tight" style={{ color: "#1a1410" }}>clientIn</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,20,16,0.48)", maxWidth: 210 }}>
                  Digital loyalty for self-care businesses. Turn first-time clients into loyal regulars.
                </p>
                <a href="mailto:hello@clientin.co" className="text-sm font-medium hover:opacity-70 transition-opacity mt-1" style={{ color: "rgba(26,20,16,0.55)" }}>
                  hello@clientin.co
                </a>
              </div>

              {/* Product column */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2" style={{ color: "rgba(26,20,16,0.32)" }}>Product</p>
                {[
                  { label: "How it works", href: "#how-it-works" },
                  { label: "Collabs", href: "/collabs" },
                  { label: "Pricing", href: "/subscribe" },
                  { label: "Analytics", href: "#features" },
                  { label: "NFC & QR stamps", href: "#how-it-works" },
                  { label: "Video marketplace", href: "#main-content" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="text-sm hover:opacity-60 transition-opacity" style={{ color: "rgba(26,20,16,0.65)" }}>{l.label}</a>
                ))}
              </div>

              {/* Industries column */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2" style={{ color: "rgba(26,20,16,0.32)" }}>Industries</p>
                {["Barbers", "Hair Salons", "Nail Techs", "Spas & Wellness", "Lash & Brow", "Skincare & Facials"].map((l) => (
                  <span key={l} className="text-sm" style={{ color: "rgba(26,20,16,0.65)" }}>{l}</span>
                ))}
              </div>

              {/* Support column */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2" style={{ color: "rgba(26,20,16,0.32)" }}>Support</p>
                {[
                  { label: "Manage my plan", href: "/subscribe" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="text-sm hover:opacity-60 transition-opacity" style={{ color: "rgba(26,20,16,0.65)" }}>{l.label}</a>
                ))}
              </div>

            </div>

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-5 pb-6">
              <span className="text-[11px]" style={{ color: "rgba(26,20,16,0.36)" }}>
                &copy; {new Date().getFullYear()} clientIn &nbsp;·&nbsp;
                <a href="/terms" className="hover:opacity-70 transition-opacity">Terms</a>
                &nbsp;·&nbsp;
                <a href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</a>
              </span>
              <span className="text-[11px]" style={{ color: "rgba(26,20,16,0.3)" }}>
                Ireland
              </span>
            </div>

          </footer>
        </div>
      </div>{/* end panel 5 */}
    </div>
  );
}

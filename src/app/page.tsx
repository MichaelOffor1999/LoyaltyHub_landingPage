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

      {/* Sticky Nav */}
      <nav
        className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(247,244,239,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c97b3a, #e8944a)" }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
              <path d="M5 9h8M9 5v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight" style={{ color: "#111827" }}>LoyaltyHub</span>
        </div>
        <a
          href="#waitlist"
          className="rounded-lg px-4 py-2 text-sm font-bold transition hover:opacity-90"
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
        <span>Limited offer: Sign up for early access and get your <strong>first month completely free</strong></span>
      </div>

      <main className="w-full max-w-5xl mx-auto flex flex-col items-center px-6">

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
            className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6"
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

          {/* Trusted-by strip below CTA */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(0,0,0,0.28)" }}>Trusted by</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: 8, background: "#f5f0ea", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <img src="/logo-mtb.jpg" alt="MTB Barbershop" style={{ width: 36, height: 36, objectFit: "contain", padding: 2, display: "block" }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>MTB Barbershop</span>
              </div>
              <div style={{ width: 1, height: 28, background: "rgba(0,0,0,0.1)" }} />
              <div className="flex items-center gap-2">
                <div style={{ width: 36, height: 36, overflow: "hidden", borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)" }}>
                  <img src="/logo-relief.jpg" alt="Relief Barbershop" style={{ width: 36, height: 36, objectFit: "cover", objectPosition: "center", display: "block" }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>Relief Barbershop</span>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* How it works */}
        <section className="w-full mt-16">
          <div className="w-full rounded-3xl p-8 sm:p-10" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
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
            <ScrollReveal staggerChildren staggerBase={130} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Create your program", desc: "Set your rewards, tiers, and branding in minutes." },
                { step: "02", title: "Invite your customers", desc: "Customers download the free app and get their own QR code — you scan it at the till to stamp their card." },
                { step: "03", title: "Watch them return", desc: "Customers earn points and redeem rewards — you watch revenue grow." },
              ].map((s, i) => (
                <StepCard key={i} step={s.step} title={s.title} desc={s.desc} featured={i === 1} />
              ))}
            </ScrollReveal>
          </div>
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
        <section className="w-full mt-24 mb-16 flex flex-col items-center text-center rounded-3xl py-14 px-8" style={{ background: "linear-gradient(135deg, #c97b3a, #e8944a)", boxShadow: "0 8px 40px rgba(201,123,58,0.3)" }}>
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
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #c97b3a, #e8944a)" }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                <path d="M3 6h6M6 3v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold" style={{ color: "#111827" }}>LoyaltyHub</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-xs hover:underline" style={{ color: "#9ca3af" }}>Terms of Service</a>
            <a href="/privacy" className="text-xs hover:underline" style={{ color: "#9ca3af" }}>Privacy Policy</a>
          </div>
          <span className="text-xs" style={{ color: "#9ca3af" }}>
            &copy; {new Date().getFullYear()} LoyaltyHub. All rights reserved.
          </span>
        </footer>
      </main>
    </div>
  );
}

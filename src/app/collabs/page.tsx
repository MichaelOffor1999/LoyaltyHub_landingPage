import type { Metadata } from "next";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Collabs | clientIn",
  description: "Two businesses, one shared loyalty program. Build a local community and grow your customer base without spending on ads.",
};

const steps = [
  {
    n: "01",
    title: "Find a partner",
    desc: "Team up with a complementary local business: a barber and a coffee shop, a hair salon and a nail tech, a gym and a smoothie bar. Any two businesses that share the same kind of customer.",
  },
  {
    n: "02",
    title: "Set your stamp targets",
    desc: "Each business sets its own visit target. For example, 5 visits at the barber and 5 visits at the coffee shop. The customer sees one shared card with two sides, each tracking their progress independently.",
  },
  {
    n: "03",
    title: "Both sides must be completed",
    desc: "The reward only unlocks once the customer has hit the target at both businesses. This means they're actively motivated to keep coming back to you and your partner until both sides of the card are complete.",
  },
  {
    n: "04",
    title: "Everyone wins",
    desc: "You get a customer that your partner's loyalty programme built for you. Your partner gets a customer you built for them. The customer gets a reward they genuinely had to earn, which makes it feel worth coming back for.",
  },
];

const examples = [
  { a: "Barber", aTarget: 5, b: "Coffee Shop", bTarget: 5, reward: "Free haircut + free coffee", idea: "5 cuts at the barber and 5 coffees at the café. Once both sides are complete, the customer unlocks a free round of each." },
  { a: "Hair Salon", aTarget: 4, b: "Nail Tech", bTarget: 4, reward: "Free treatment or free set", idea: "4 colour appointments and 4 nail sets. Clients are nudged to visit both to complete the card, growing both books in the process." },
  { a: "Gym", aTarget: 8, b: "Smoothie Bar", bTarget: 8, reward: "Free session + free smoothie", idea: "8 gym sessions and 8 post-workout smoothies. The card becomes part of their routine and the reward feels earned." },
  { a: "Spa", aTarget: 3, b: "Skincare Clinic", bTarget: 3, reward: "Free facial or free treatment", idea: "3 spa visits and 3 skin treatments. Completing both sides brings a premium reward, keeping clients inside your shared wellness ecosystem." },
];

const benefits = [
  { stat: "5×", label: "higher conversion", sub: "A warm referral from a trusted local business converts at 5× the rate of a paid ad." },
  { stat: "£0", label: "acquisition cost", sub: "No budget required. Your partner's loyalty programme does the heavy lifting for you." },
  { stat: "2×", label: "visit incentive", sub: "Because both sides must be completed before the reward unlocks, customers are twice as motivated to keep visiting." },
];

export default function CollabsPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#faf7f2", fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
      <Navbar />

      {/* Hero */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-32 pb-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
          Collabs
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-[1.05]" style={{ color: "#1a1410", letterSpacing: "-0.025em" }}>
          Build a loyalty<br />community, together.
        </h1>
        <p className="text-lg max-w-xl mb-10" style={{ color: "rgba(26,20,16,0.55)", lineHeight: 1.7 }}>
          Two businesses. One shared stamp card with two sides. Customers earn stamps at your place and at your partner's. Only once they've hit the target at both do they unlock the reward. That's what keeps them coming back to you both.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/download"
            className="inline-flex items-center justify-center px-7 py-4 rounded-xl text-sm font-bold tracking-wide transition-opacity hover:opacity-80"
            style={{ background: "#1a1410", color: "#fff" }}
          >
            Start a Collab →
          </a>
          <a
            href="/#how-it-works"
            className="inline-flex items-center justify-center px-7 py-4 rounded-xl text-sm font-semibold transition-opacity hover:opacity-60"
            style={{ color: "#1a1410", border: "1px solid rgba(26,20,16,0.18)" }}
          >
            See how clientIn works
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16 sm:py-20" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-12" style={{ color: "#1a1410" }}>
          Simple to set up.<br />Powerful once running.
        </h2>
        <div className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black"
                  style={{ background: "rgba(26,20,16,0.07)", color: "rgba(26,20,16,0.4)" }}
                >
                  {s.n}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 my-2" style={{ background: "rgba(26,20,16,0.1)", minHeight: 40 }} />
                )}
              </div>
              <div className="pb-10">
                <h3 className="text-lg font-bold mb-2" style={{ color: "#1a1410" }}>{s.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: "rgba(26,20,16,0.55)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="w-full" style={{ background: "#1a1410" }}>
        <div className="w-full max-w-4xl mx-auto px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.08)" }}>
            {benefits.map((b, i) => (
              <div key={i} className="px-8 py-10" style={{ background: "#1a1410" }}>
                <p className="text-5xl font-black mb-2 leading-none" style={{ color: "#c97b3a" }}>{b.stat}</p>
                <p className="text-base font-bold mb-2 text-white">{b.label}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example pairings */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16 sm:py-20" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
          Example collabs
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-10" style={{ color: "#1a1410" }}>
          Any two businesses that share a customer.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: "rgba(26,20,16,0.04)", border: "1px solid rgba(26,20,16,0.08)" }}
            >
              {/* Dual stamp card */}
              <div className="flex flex-col gap-2">
                {/* Side A */}
                <div className="rounded-xl p-3" style={{ background: "rgba(201,123,58,0.08)", border: "1px solid rgba(201,123,58,0.18)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: "#c97b3a" }}>{ex.a}</span>
                    <span className="text-[10px] font-semibold" style={{ color: "rgba(201,123,58,0.7)" }}>{ex.aTarget} visits</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: ex.aTarget }).map((_, j) => (
                      <div
                        key={j}
                        className="flex-1 rounded-full"
                        style={{
                          height: 6,
                          background: j < Math.ceil(ex.aTarget * 0.6)
                            ? "linear-gradient(90deg,#c97b3a,#e8944a)"
                            : "rgba(201,123,58,0.15)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* Side B */}
                <div className="rounded-xl p-3" style={{ background: "rgba(26,20,16,0.05)", border: "1px solid rgba(26,20,16,0.1)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: "rgba(26,20,16,0.65)" }}>{ex.b}</span>
                    <span className="text-[10px] font-semibold" style={{ color: "rgba(26,20,16,0.38)" }}>{ex.bTarget} visits</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: ex.bTarget }).map((_, j) => (
                      <div
                        key={j}
                        className="flex-1 rounded-full"
                        style={{
                          height: 6,
                          background: j < Math.ceil(ex.bTarget * 0.3)
                            ? "rgba(26,20,16,0.45)"
                            : "rgba(26,20,16,0.1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* Reward unlock */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(201,123,58,0.15)" }}>
                    <span style={{ fontSize: 9, color: "#c97b3a" }}>★</span>
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: "rgba(26,20,16,0.5)" }}>
                    Complete both → <span style={{ color: "#c97b3a" }}>{ex.reward}</span>
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(26,20,16,0.55)" }}>{ex.idea}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why it works */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16 sm:py-20" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "rgba(26,20,16,0.38)" }}>
          Why it works
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8" style={{ color: "#1a1410" }}>
          A referral from a trusted neighbour always converts.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "rgba(26,20,16,0.08)", border: "1px solid rgba(26,20,16,0.08)", borderRadius: 16, overflow: "hidden" }}>
          {[
            { title: "Warm introductions", desc: "Customers don't discover you through an ad. They discover you because a business they already trust is telling them to visit you." },
            { title: "Zero ad spend", desc: "Every customer your Collab partner sends your way costs you nothing. No CPM, no CPC, no budget. Just a shared loyalty card." },
            { title: "Your brand stays yours", desc: "The Collab is opt-in and non-exclusive. Your loyalty programme stays yours. You keep full control of your customers, your data, your branding." },
            { title: "Community, not competition", desc: "Collabs aren't mergers. They're partnerships between local businesses that complement each other. Both shops grow. Nobody loses." },
          ].map((item, i) => (
            <div key={i} className="p-7" style={{ background: "#faf7f2" }}>
              <h3 className="text-base font-bold mb-2" style={{ color: "#1a1410" }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(26,20,16,0.55)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full" style={{ background: "#1a1410" }}>
        <div className="w-full max-w-4xl mx-auto px-6 py-20 sm:py-24 flex flex-col items-center text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
            Get started
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 max-w-lg text-white">
            Ready to find your Collab partner?
          </h2>
          <p className="text-base mb-10 max-w-sm" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Download clientIn, set up your loyalty programme, and start a Collab with a business near you.
          </p>
          <a
            href="/download"
            className="px-8 py-4 rounded-xl text-sm font-bold tracking-wide transition-opacity hover:opacity-80"
            style={{ background: "#c97b3a", color: "#fff" }}
          >
            Download the app →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-5 max-w-4xl mx-auto" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
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

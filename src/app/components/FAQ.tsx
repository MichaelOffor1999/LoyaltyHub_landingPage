"use client";
import { useState } from "react";

const faqs = [
  {
    q: "How does LoyaltyHub work?",
    a: "Customers scan a QR code or check in at your business to earn points automatically. They can then redeem those points for rewards you define — discounts, free items, VIP perks.",
  },
  {
    q: "Do my customers need to download an app?",
    a: "Yes, customers use the LoyaltyHub app to track their points and rewards. It is free for them and available on iOS and Android.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses are fully set up in under 10 minutes. We guide you through every step.",
  },
  {
    q: "When will I get access?",
    a: "We are rolling out invites to our waitlist. Sign up above and you will be first in line for early access with exclusive launch pricing.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Waitlist members get extended early access with full features — no credit card required.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="w-full mt-8 mb-8">
      <div className="w-full rounded-3xl p-8 sm:p-10" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
        <div className="text-center mb-10">
          <div
            className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
          >
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#111827" }}>
            Questions? Answered.
          </h2>
        </div>
        <div className="flex flex-col max-w-2xl mx-auto" style={{ border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, overflow: "hidden" }}>
          {faqs.map((f, i) => (
            <div
              key={i}
              className="cursor-pointer"
              style={{ borderBottom: i < faqs.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between px-6 py-4">
                <span className="font-semibold text-sm sm:text-base" style={{ color: "#111827" }}>{f.q}</span>
                <span className="ml-4 text-lg" style={{ color: "#e8944a" }}>{open === i ? "−" : "+"}</span>
              </div>
              {open === i && (
                <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";

const faqs = [
  {
    q: "How does Clienty work?",
    a: "Each customer gets their own QR code in the Clienty app. You scan it at the till to stamp their card. They can then redeem points for rewards you define — discounts, free items, VIP perks.",
  },
  {
    q: "Do my customers need to download an app?",
    a: "Yes, customers use the Clienty app to track their points and rewards. It is free for them and available on iOS and Android.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses are fully set up in under 5 minutes. We guide you through every step.",
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
    <section className="w-full mt-8 mb-8" aria-labelledby="faq-heading">
        <div className="text-center mb-10">
          <div
            className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
          >
            FAQ
          </div>
          <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#111827" }}>
            Questions? Answered.
          </h2>
        </div>
        <div className="flex flex-col max-w-2xl mx-auto" role="list" style={{ border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, overflow: "hidden" }}>
          {faqs.map((f, i) => (
            <div
              key={i}
              role="listitem"
              style={{ borderBottom: i < faqs.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(open === i ? null : i);
                  }
                }}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer card-hover bg-transparent border-none"
              >
                <span className="font-semibold text-sm sm:text-base" style={{ color: "#111827" }}>{f.q}</span>
                <span className="ml-4 text-lg" aria-hidden="true" style={{ color: "#e8944a" }}>{open === i ? "−" : "+"}</span>
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                hidden={open !== i}
              >
                {open === i && (
                  <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                    {f.a}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}

"use client";

export default function StepCard({ step, title, desc, featured }: { step: string; title: string; desc: string; featured?: boolean }) {
  return (
    <div
      className={`${featured ? 'card-featured' : 'card'} card-hover rounded-2xl p-4 sm:p-6 flex flex-col gap-2 sm:gap-3 h-full`}
    >
      <span
        className="text-3xl sm:text-4xl font-black"
        style={{ color: featured ? "#c97b3a" : "rgba(201,123,58,0.35)", lineHeight: 1 }}
      >
        {step}
      </span>
      <h3 className="text-lg font-bold" style={{ color: "#111827" }}>{title}</h3>
      <p className="text-sm" style={{ color: "#6b7280" }}>{desc}</p>
    </div>
  );
}

"use client";

export default function StepCard({ step, title, desc, featured }: { step: string; title: string; desc: string; featured?: boolean }) {
  return (
    <div
      className={`${featured ? 'card-featured' : 'card'} card-hover rounded-2xl p-5 sm:p-6 flex flex-col gap-3 h-full relative overflow-hidden`}
    >
      {/* Step badge */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black"
          style={{
            background: featured ? "linear-gradient(135deg, #c97b3a, #e8944a)" : "rgba(201,123,58,0.1)",
            color: featured ? "#fff" : "#c97b3a",
            boxShadow: featured ? "0 4px 12px rgba(201,123,58,0.25)" : "none",
          }}
        >
          {step}
        </div>
        <span
          className="text-[11px] font-bold tracking-wider uppercase"
          style={{ color: "#c97b3a" }}
        >
          Step {step}
        </span>
      </div>
      <h3 className="text-lg font-bold" style={{ color: "#111827" }}>{title}</h3>
      <p className="text-sm font-medium leading-relaxed" style={{ color: "#374151" }}>{desc}</p>
    </div>
  );
}

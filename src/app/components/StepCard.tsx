"use client";

export default function StepCard({ step, title, desc, featured }: { step: string; title: string; desc: string; featured?: boolean }) {
  return (
    <div
      className="card card-hover rounded-2xl p-6 flex flex-col gap-3 h-full"
    >
      {/* Step badge */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black"
          style={{
            background: featured ? "linear-gradient(135deg, #c97b3a, #e8944a)" : "rgba(201,123,58,0.08)",
            color: featured ? "#fff" : "#c97b3a",
            boxShadow: featured ? "0 4px 16px rgba(201,123,58,0.3)" : "none",
          }}
        >
          {step}
        </div>
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
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

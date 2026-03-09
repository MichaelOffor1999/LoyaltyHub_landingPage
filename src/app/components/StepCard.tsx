"use client";

import { cn } from "@/lib/utils";

export default function StepCard({ step, title, desc, featured }: { step: string; title: string; desc: string; featured?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex h-full select-none flex-col gap-3 rounded-2xl border p-6",
        "bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.2)]",
        "transition-all duration-500 hover:shadow-[0_18px_70px_rgba(201,123,58,0.16)]",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500",
        "before:bg-[radial-gradient(120%_120%_at_10%_0%,rgba(232,148,74,0.18)_0%,transparent_60%)]",
        "hover:before:opacity-100",
        featured
          ? "border-[rgba(201,123,58,0.35)]"
          : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(201,123,58,0.25)]",
      )}
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
      <h3 className="text-lg font-bold" style={{ color: "#111827" }}>
        {title}
      </h3>
      <p className="text-sm font-medium leading-relaxed" style={{ color: "#374151" }}>
        {desc}
      </p>
    </div>
  );
}

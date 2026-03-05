"use client";

import { SplineScene } from "./splite";

// The interactive robot from Spline — drop-in for the hero right panel
// Scene: https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode
const ROBOT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export function HeroSplineCard() {
  return (
    <div
      className="relative w-full h-[420px] lg:h-[520px] rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1208 100%)",
        border: "1px solid rgba(201,123,58,0.25)",
        boxShadow: "0 0 60px rgba(201,123,58,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Orange spotlight glow — top-left */}
      <div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(201,123,58,0.22) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Loyalty badge — top right */}
      <div
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest"
        style={{
          background: "rgba(201,123,58,0.15)",
          border: "1px solid rgba(201,123,58,0.35)",
          color: "#e8944a",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Stamp icon */}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Loyalty AI
      </div>

      {/* Stamp dots row — bottom */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: i < 4 ? "linear-gradient(135deg,#c97b3a,#e8944a)" : "rgba(201,123,58,0.2)",
              boxShadow: i < 4 ? "0 0 8px rgba(201,123,58,0.6)" : "none",
              border: "1.5px solid rgba(201,123,58,0.4)",
            }}
          >
            {i < 4 && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        ))}
        <span className="text-[10px] font-bold ml-1" style={{ color: "rgba(201,123,58,0.7)" }}>4/5 stamps</span>
      </div>

      {/* The 3D robot scene */}
      <SplineScene scene={ROBOT_SCENE} className="absolute inset-0 w-full h-full z-10" />
    </div>
  );
}

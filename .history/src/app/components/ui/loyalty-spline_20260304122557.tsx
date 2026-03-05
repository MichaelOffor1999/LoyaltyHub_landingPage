"use client";

import { Suspense, lazy } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));

// Loyalty-themed stamp card fallback shown while Spline loads
function StampCardFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex flex-col items-center justify-center gap-3 animate-pulse">
        {/* Glowing orb */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, #c97b3a, #e8944a)",
            boxShadow: "0 0 40px rgba(201,123,58,0.45)",
          }}
        >
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#e8944a" }}>
          Loading…
        </p>
      </div>
    </div>
  );
}

interface LoyaltySplineProps {
  className?: string;
  // Loyalty/stamp themed Spline scene
  scene?: string;
}

// A loyalty-themed Spline scene — stamp/reward visual
const DEFAULT_SCENE = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export function LoyaltySpline({ className, scene = DEFAULT_SCENE }: LoyaltySplineProps) {
  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      {/* Subtle orange glow behind the 3D scene */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(201,123,58,0.13) 0%, transparent 75%)",
        }}
      />

      <Suspense fallback={<StampCardFallback />}>
        <Spline scene={scene} className="w-full h-full" />
      </Suspense>
    </div>
  );
}

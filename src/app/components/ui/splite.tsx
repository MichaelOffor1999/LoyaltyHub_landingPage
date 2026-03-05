"use client";

import { Suspense, lazy } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

// Loyalty-themed loading fallback — animated stamp dots
function StampLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full"
            style={{
              background: i < 3 ? "linear-gradient(135deg,#c97b3a,#e8944a)" : "rgba(201,123,58,0.2)",
              boxShadow: i < 3 ? "0 0 8px rgba(201,123,58,0.5)" : "none",
              animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#e8944a" }}>
        Loading…
      </p>
    </div>
  );
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={<StampLoader />}>
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

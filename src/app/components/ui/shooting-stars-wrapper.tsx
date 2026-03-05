"use client";
import { ShootingStars } from "./shooting-stars";

// Always render — CSS hides the stars in light mode via [data-theme="light"] .stars-layer { opacity: 0 }
export function ShootingStarsWrapper() {
  return (
    <div className="stars-layer w-full h-full">
      <ShootingStars starColor="#e8944a" trailColor="#c97b3a" minSpeed={12} maxSpeed={28} minDelay={1000}  maxDelay={3000} />
      <ShootingStars starColor="#ffffff" trailColor="#c97b3a" minSpeed={8}  maxSpeed={20} minDelay={2000}  maxDelay={5000} />
      <ShootingStars starColor="#f5b97a" trailColor="#ffffff" minSpeed={15} maxSpeed={35} minDelay={1500}  maxDelay={4000} />
    </div>
  );
}

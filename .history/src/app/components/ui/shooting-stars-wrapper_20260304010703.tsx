"use client";
import { ShootingStars } from "./shooting-stars";
import { useTheme } from "./theme-provider";

export function ShootingStarsWrapper() {
  const { theme } = useTheme();
  if (theme !== "dark") return null;
  return (
    <>
      <ShootingStars starColor="#e8944a" trailColor="#c97b3a" minSpeed={12} maxSpeed={28} minDelay={1000} maxDelay={3000} />
      <ShootingStars starColor="#ffffff" trailColor="#c97b3a" minSpeed={8}  maxSpeed={20} minDelay={2000} maxDelay={5000} />
      <ShootingStars starColor="#f5b97a" trailColor="#ffffff" minSpeed={15} maxSpeed={35} minDelay={1500} maxDelay={4000} />
    </>
  );
}

"use client";

import {
  Coffee,
  Dumbbell,
  Scissors,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
  Car,
  Leaf,
  PawPrint,
  Flower2,
} from "lucide-react";
import RadialOrbitalTimeline from "@/app/components/ui/radial-orbital-timeline";

const HINTS = [
  "coffee shops", "gyms", "salons", "restaurants", "barbershops",
  "nail bars", "bakeries", "spas", "pet groomers", "yoga studios",
  "boutiques", "car washes",
];

const timelineData = [
  {
    id: 1,
    title: "Coffee Shops",
    date: "Most Popular",
    content: "Stamp cards that fill up fast. Customers earn a free coffee every 5 visits — your morning regulars will never stray.",
    category: "Food & Drink",
    icon: Coffee,
    relatedIds: [4, 7],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 2,
    title: "Gyms & Fitness",
    date: "High Retention",
    content: "Reward attendance streaks, class bookings, and milestones. Keep members motivated and reduce churn by 40%.",
    category: "Health",
    icon: Dumbbell,
    relatedIds: [9, 3],
    status: "completed" as const,
    energy: 88,
  },
  {
    id: 3,
    title: "Salons & Barbers",
    date: "Repeat Bookings",
    content: "Every 6th cut is on you. Customers book ahead to claim their reward — filling your calendar automatically.",
    category: "Beauty",
    icon: Scissors,
    relatedIds: [5, 2],
    status: "completed" as const,
    energy: 82,
  },
  {
    id: 4,
    title: "Restaurants",
    date: "High Volume",
    content: "Turn one-time diners into weekly regulars. Birthday perks, visit rewards, and combo unlocks drive repeat covers.",
    category: "Food & Drink",
    icon: UtensilsCrossed,
    relatedIds: [1, 7],
    status: "in-progress" as const,
    energy: 90,
  },
  {
    id: 5,
    title: "Nail & Beauty",
    date: "Loyalty Champions",
    content: "Clients who earn rewards come back 3× more. Offer a free treatment after 5 appointments and watch bookings soar.",
    category: "Beauty",
    icon: Sparkles,
    relatedIds: [3, 6],
    status: "completed" as const,
    energy: 78,
  },
  {
    id: 6,
    title: "Boutiques",
    date: "Growing Fast",
    content: "Spend-based loyalty unlocks exclusive perks. Shoppers who earn points spend 27% more per visit on average.",
    category: "Retail",
    icon: ShoppingBag,
    relatedIds: [5, 8],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 7,
    title: "Bakeries",
    date: "Morning Ritual",
    content: "Daily bread buyers become brand ambassadors. A free loaf on the 10th visit creates a habit that sticks.",
    category: "Food & Drink",
    icon: Leaf,
    relatedIds: [1, 4],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 8,
    title: "Car Washes",
    date: "Quick Wins",
    content: "Predictable repeat visits make loyalty easy. A monthly wash pass or stamp card drives consistent revenue.",
    category: "Automotive",
    icon: Car,
    relatedIds: [6],
    status: "in-progress" as const,
    energy: 65,
  },
  {
    id: 9,
    title: "Spas & Wellness",
    date: "Premium Clients",
    content: "High-value clients deserve high-value rewards. Tier-based loyalty keeps your VIPs feeling seen and returning.",
    category: "Wellness",
    icon: Flower2,
    relatedIds: [2, 10],
    status: "completed" as const,
    energy: 80,
  },
  {
    id: 10,
    title: "Pet Groomers",
    date: "Loyal Owners",
    content: "Pet parents are fiercely loyal. A free groom after 6 visits is all it takes to make you their only choice.",
    category: "Pets",
    icon: PawPrint,
    relatedIds: [9],
    status: "pending" as const,
    energy: 60,
  },
];

export default function IndustryGrid() {
  return (
    <section className="w-full mt-16 fade-up-delay">
      <div className="flex flex-col gap-10">

        {/* Copy block */}
        <div className="flex flex-col gap-6 text-center items-center">
          <div
            className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold w-fit"
            style={{ background: "rgba(201,123,58,0.1)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.22)" }}
          >
            Works for any business
          </div>

          <h2 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: "var(--foreground)" }}>
            You don&apos;t have a{" "}
            <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              coffee shop problem
            </span>{" "}
            or a{" "}
            <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              gym problem.
            </span>
          </h2>

          <h2 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: "var(--foreground)" }}>
            You have a{" "}
            <span style={{ background: "linear-gradient(90deg, #c97b3a, #e8944a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              repeat customer problem.
            </span>
          </h2>

          <div className="flex flex-wrap gap-2 justify-center">
            {HINTS.map((name, i) => (
              <span
                key={i}
                className="rounded-full px-3 py-1 text-sm font-medium"
                style={{ background: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--text-sub)" }}
              >
                {name}
              </span>
            ))}
            <span
              className="rounded-full px-3 py-1 text-sm font-semibold"
              style={{ background: "rgba(201,123,58,0.08)", border: "1px solid rgba(201,123,58,0.2)", color: "#c97b3a" }}
            >
              + many more
            </span>
          </div>
        </div>

        {/* Orbital timeline */}
        <div className="w-full flex flex-col items-center gap-3">
          <RadialOrbitalTimeline timelineData={timelineData} />
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Click any industry to explore — it works for all of them
          </p>
        </div>

      </div>
    </section>
  );
}

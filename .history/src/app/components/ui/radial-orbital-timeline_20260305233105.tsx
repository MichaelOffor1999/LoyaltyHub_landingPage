"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Coffee, Dumbbell, Scissors, UtensilsCrossed, Sparkles, ShoppingBag, Car, Leaf, PawPrint, Flower2 } from "lucide-react";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

const RADIUS = 200;
const SPEED = 0.018; // degrees per ms ≈ smooth ~1 rpm

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

  // rAF-driven angle stored in a ref — no React re-renders during spin
  const angleRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(true);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // One ref per node so we can update their transforms directly
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // ── rAF loop ──────────────────────────────────────────────────────────────
  const tick = useCallback((ts: number) => {
    if (autoRotateRef.current) {
      const delta = lastTimeRef.current == null ? 0 : ts - lastTimeRef.current;
      lastTimeRef.current = ts;
      angleRef.current = (angleRef.current + SPEED * delta) % 360;
    } else {
      lastTimeRef.current = null;
    }

    // Write positions directly to DOM — no setState, no re-render
    const total = timelineData.length;
    timelineData.forEach((item, index) => {
      const el = nodeRefs.current[item.id];
      if (!el) return;
      const angle = ((index / total) * 360 + angleRef.current) % 360;
      const radian = (angle * Math.PI) / 180;
      const x = RADIUS * Math.cos(radian);
      const y = RADIUS * Math.sin(radian);
      // Keep all nodes clearly visible — only a subtle depth fade (0.75 → 1)
      const opacity = Math.max(0.75, Math.min(1, 0.75 + 0.25 * ((1 + Math.sin(radian)) / 2)));
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = String(opacity);
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [timelineData]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  // ── helpers ───────────────────────────────────────────────────────────────
  const getRelatedItems = (itemId: number): number[] =>
    timelineData.find((item) => item.id === itemId)?.relatedIds ?? [];

  const isRelatedToActive = (itemId: number): boolean =>
    activeNodeId != null && getRelatedItems(activeNodeId).includes(itemId);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    angleRef.current = (270 - targetAngle + 360) % 360;
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      autoRotateRef.current = true;
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const isOpening = !prev[id];
      const newState: Record<number, boolean> = {};
      Object.keys(prev).forEach((k) => { newState[parseInt(k)] = false; });
      newState[id] = isOpening;

      if (isOpening) {
        setActiveNodeId(id);
        autoRotateRef.current = false;
        const newPulse: Record<number, boolean> = {};
        getRelatedItems(id).forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        autoRotateRef.current = true;
        setPulseEffect({});
      }

      return newState;
    });
  };

  const getStatusConfig = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":   return { label: "Active",      bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.4)",   text: "#4ade80" };
      case "in-progress": return { label: "Growing",     bg: "rgba(201,123,58,0.15)", border: "rgba(201,123,58,0.5)",  text: "#e8944a" };
      case "pending":     return { label: "Coming Soon", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)", text: "#94a3b8" };
      default:            return { label: "Coming Soon", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)", text: "#94a3b8" };
    }
  };

  return (
    <div
      className="w-full h-[500px] flex flex-col items-center justify-center overflow-visible"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
        >
          {/* ── Central orb ── */}
          <div className="absolute z-10 flex items-center justify-center" style={{ width: 72, height: 72 }}>
            <div className="absolute rounded-full animate-ping" style={{ width: 100, height: 100, border: "1px solid rgba(201,123,58,0.25)", animationDuration: "2.4s" }} />
            <div className="absolute rounded-full animate-ping" style={{ width: 130, height: 130, border: "1px solid rgba(201,123,58,0.12)", animationDuration: "3.2s", animationDelay: "0.8s" }} />
            <div
              className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #c97b3a 0%, #e8944a 50%, #f5b97a 100%)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.15) inset, 0 0 32px rgba(201,123,58,0.55), 0 0 60px rgba(201,123,58,0.2)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute top-2 left-3 w-5 h-2 rounded-full bg-white/30 blur-[2px]" />
            </div>
          </div>

          {/* ── Orbit rings ── */}
          <div className="absolute rounded-full pointer-events-none" style={{ width: 420, height: 420, border: "1px solid rgba(255,255,255,0.06)" }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 412, height: 412, border: "1px dashed rgba(201,123,58,0.12)" }} />

          {timelineData.map((item) => {
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;
            const statusCfg = getStatusConfig(item.status);

            const nodeStyle: React.CSSProperties = {
              transform: `translate(0px, 0px)`,
              zIndex: isExpanded ? 200 : 100,
              opacity: isExpanded ? 1 : 0.85,
              willChange: "transform, opacity",
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute cursor-pointer"
                style={nodeStyle}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Energy halo */}
                <div
                  className={`absolute rounded-full pointer-events-none ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: isExpanded
                      ? "radial-gradient(circle, rgba(201,123,58,0.45) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(201,123,58,0.18) 0%, transparent 70%)",
                    width: `${item.energy * 0.5 + 48}px`,
                    height: `${item.energy * 0.5 + 48}px`,
                    left: `-${(item.energy * 0.5 + 8) / 2}px`,
                    top:  `-${(item.energy * 0.5 + 8) / 2}px`,
                    transition: "background 0.3s ease",
                  }}
                />

                {/* Node bubble */}
                <div
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                    background: isExpanded
                      ? "linear-gradient(135deg,#c97b3a,#f5b97a)"
                      : isRelated ? "rgba(201,123,58,0.22)" : "rgba(255,255,255,0.05)",
                    border: isExpanded ? "none"
                      : isRelated ? "1.5px solid rgba(201,123,58,0.7)" : "1.5px solid rgba(255,255,255,0.15)",
                    boxShadow: isExpanded
                      ? "0 0 0 3px rgba(201,123,58,0.35), 0 8px 24px rgba(201,123,58,0.45)"
                      : isRelated ? "0 0 16px rgba(201,123,58,0.4)" : "0 2px 8px rgba(0,0,0,0.4)",
                    transform: isExpanded ? "scale(1.35)" : isRelated ? "scale(1.08)" : "scale(1)",
                    backdropFilter: "blur(8px)",
                    color: isExpanded ? "white" : isRelated ? "#e8944a" : "rgba(255,255,255,0.75)",
                  }}
                >
                  <Icon size={20} />
                </div>

                {/* Label pill */}
                <div
                  style={{
                    position: "absolute", top: 58, left: "50%",
                    transform: `translateX(-50%) ${isExpanded ? "scale(1.1)" : "scale(1)"}`,
                    whiteSpace: "nowrap", transition: "all 0.3s ease",
                    background: isExpanded ? "rgba(201,123,58,0.2)" : "transparent",
                    border: isExpanded ? "1px solid rgba(201,123,58,0.4)" : "1px solid transparent",
                    borderRadius: 999,
                    padding: isExpanded ? "2px 8px" : "2px 0",
                  }}
                >
                  <span className="text-[10px] font-bold tracking-wide" style={{ color: isExpanded ? "#f5b97a" : "rgba(255,255,255,0.6)" }}>
                    {item.title}
                  </span>
                </div>

                {/* Expanded info card */}
                {isExpanded && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-[220px]"
                    style={{
                      top: 84,
                      background: "rgba(10,10,15,0.92)",
                      border: "1px solid rgba(201,123,58,0.25)",
                      borderRadius: 16,
                      boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
                      backdropFilter: "blur(20px)",
                      overflow: "hidden",
                    }}
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2" style={{ width: 1, height: 16, background: "linear-gradient(to bottom, transparent, rgba(201,123,58,0.6))" }} />
                    <div style={{ height: 3, background: "linear-gradient(90deg,#c97b3a,#f5b97a,#c97b3a)" }} />
                    <div style={{ padding: "10px 14px 12px" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5"
                          style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.text }}
                        >
                          {statusCfg.label}
                        </span>
                        <span className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>{item.date}</span>
                      </div>
                      <p className="text-sm font-black text-white mb-1.5 leading-tight">{item.title}</p>
                      <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{item.content}</p>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                          <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Also works for</p>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <button
                                  key={relatedId}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                  className="flex items-center gap-1 text-[10px] font-semibold rounded-full px-2.5 py-1 transition-all"
                                  style={{ background: "rgba(201,123,58,0.1)", border: "1px solid rgba(201,123,58,0.25)", color: "#e8944a" }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Hero preset — icons defined here (client component, no server serialization) ───

const HERO_ORBIT_DATA: TimelineItem[] = [
  { id: 1,  title: "Coffee Shops",  date: "Most Popular",    content: "Stamp cards that fill up fast — earn a free coffee every 5 visits.", category: "Food",     icon: Coffee,          relatedIds: [4, 7],  status: "completed",   energy: 95 },
  { id: 2,  title: "Gyms",          date: "High Retention",  content: "Reward attendance streaks and reduce churn by 40%.",                 category: "Health",   icon: Dumbbell,        relatedIds: [9, 3],  status: "completed",   energy: 88 },
  { id: 3,  title: "Salons",        date: "Repeat Bookings", content: "Every 6th cut is on you — fills your calendar automatically.",       category: "Beauty",   icon: Scissors,        relatedIds: [5, 2],  status: "completed",   energy: 82 },
  { id: 4,  title: "Restaurants",   date: "High Volume",     content: "Turn one-time diners into weekly regulars with birthday perks.",     category: "Food",     icon: UtensilsCrossed, relatedIds: [1, 7],  status: "in-progress", energy: 90 },
  { id: 5,  title: "Nail & Beauty", date: "Loyal Champions", content: "Clients who earn rewards come back 3× more.",                       category: "Beauty",   icon: Sparkles,        relatedIds: [3, 6],  status: "completed",   energy: 78 },
  { id: 6,  title: "Boutiques",     date: "Growing Fast",    content: "Spend-based loyalty — shoppers with points spend 27% more.",        category: "Retail",   icon: ShoppingBag,     relatedIds: [5, 8],  status: "in-progress", energy: 70 },
  { id: 7,  title: "Bakeries",      date: "Morning Ritual",  content: "A free loaf on the 10th visit creates a habit that sticks.",        category: "Food",     icon: Leaf,            relatedIds: [1, 4],  status: "completed",   energy: 85 },
  { id: 8,  title: "Car Washes",    date: "Quick Wins",      content: "Stamp cards drive consistent monthly revenue.",                     category: "Auto",     icon: Car,             relatedIds: [6],     status: "in-progress", energy: 65 },
  { id: 9,  title: "Spas",          date: "Premium Clients", content: "Tier-based loyalty keeps your VIPs feeling seen.",                  category: "Wellness", icon: Flower2,         relatedIds: [2, 10], status: "completed",   energy: 80 },
  { id: 10, title: "Pet Groomers",  date: "Loyal Owners",    content: "A free groom after 6 visits makes you their only choice.",          category: "Pets",     icon: PawPrint,        relatedIds: [9],     status: "pending",     energy: 60 },
];

export function HeroOrbitalTimeline() {
  return <RadialOrbitalTimeline timelineData={HERO_ORBIT_DATA} />;
}

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

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

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":   return "text-white bg-black border-white";
      case "in-progress": return "text-black bg-white border-black";
      case "pending":     return "text-white bg-black/40 border-white/50";
      default:            return "text-white bg-black/40 border-white/50";
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
          {/* Central glowing orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#c97b3a] via-[#e8944a] to-[#f5b97a] animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-[#c97b3a]/40 animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-[#c97b3a]/20 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md"></div>
          </div>

          {/* Orbit ring */}
          <div className="absolute w-[420px] h-[420px] rounded-full border border-white/10"></div>

          {timelineData.map((item) => {
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            // Initial position set inline; rAF loop overwrites transform/opacity each frame
            const nodeStyle: React.CSSProperties = {
              transform: `translate(0px, 0px)`,
              zIndex: isExpanded ? 200 : 100,
              opacity: isExpanded ? 1 : 0.4,
              willChange: "transform, opacity",
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Energy glow ring */}
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: `radial-gradient(circle, rgba(201,123,58,0.25) 0%, rgba(201,123,58,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                {/* Node icon bubble */}
                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isExpanded
                      ? "bg-[#c97b3a] text-white border-[#c97b3a] shadow-lg shadow-[#c97b3a]/40 scale-150"
                      : isRelated
                      ? "bg-[#c97b3a]/30 text-white border-[#c97b3a] animate-pulse"
                      : "bg-black text-white border-white/40",
                  ].join(" ")}
                >
                  <Icon size={16} />
                </div>

                {/* Node label */}
                <div
                  className={[
                    "absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300",
                    isExpanded ? "text-[#e8944a] scale-125" : "text-white/70",
                  ].join(" ")}
                >
                  {item.title}
                </div>

                {/* Expanded info card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-black/90 backdrop-blur-lg border-white/20 shadow-xl shadow-black/50 overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#c97b3a]/60"></div>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-[10px] ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "ACTIVE" : item.status === "in-progress" ? "GROWING" : "COMING SOON"}
                        </Badge>
                        <span className="text-[10px] font-mono text-white/50">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2 text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/80 px-4 pb-4">
                      <p>{item.content}</p>

                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="flex items-center gap-1 text-white/60">
                            <Zap size={9} />
                            Loyalty Potential
                          </span>
                          <span className="font-mono text-[#e8944a]">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.energy}%`,
                              background: "linear-gradient(90deg, #c97b3a, #e8944a)",
                            }}
                          />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2 gap-1 text-white/60">
                            <Link size={9} />
                            <span className="text-[10px] uppercase tracking-wider font-medium">Related Industries</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-[10px] rounded-full border-white/20 bg-transparent hover:bg-[#c97b3a]/20 hover:border-[#c97b3a]/50 text-white/70 hover:text-white transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={7} className="ml-1 text-white/50" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

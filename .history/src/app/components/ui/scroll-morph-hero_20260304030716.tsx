"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

// --- Card Component ---
const IMG_WIDTH = 64;
const IMG_HEIGHT = 90;

/**
 * Utility: choose translate overrides for cards near the focused one.
 * Matches the idea from `twitter-testimonial-cards`: when one card is focused,
 * push a few cards adjacent in the stack away so the separation is obvious.
 */
function getFanClass(index: number, focusedIndex: number | null, total: number) {
    if (focusedIndex === null) return "";

    // Wrap distance on ring so edges also behave like neighbours
    let d = index - focusedIndex;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;

    // The ring uses absolute positioning; we use translate overrides to fan.
    // Strong, obvious offsets so the user can see the effect.
    if (d === 0) return "";
    if (d === 1) return "!translate-x-10 !translate-y-6";
    if (d === -1) return "!-translate-x-10 !translate-y-6";
    if (d === 2) return "!translate-x-16 !translate-y-10";
    if (d === -2) return "!-translate-x-16 !translate-y-10";
    if (d === 3) return "!translate-x-22 !translate-y-14";
    if (d === -3) return "!-translate-x-22 !translate-y-14";

    return "";
}

function getFanOffset(index: number, focusedIndex: number | null, total: number) {
    if (focusedIndex === null) return { dx: 0, dy: 0 };
    let d = index - focusedIndex;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;

    if (d === 0) return { dx: 0, dy: 0 };
    if (d === 1) return { dx: 40, dy: 26 };
    if (d === -1) return { dx: -40, dy: 26 };
    if (d === 2) return { dx: 64, dy: 40 };
    if (d === -2) return { dx: -64, dy: 40 };
    if (d === 3) return { dx: 88, dy: 56 };
    if (d === -3) return { dx: -88, dy: 56 };
    return { dx: 0, dy: 0 };
}

interface HeroCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
    focusedIndex: number | null;
    onHover: (i: number) => void;
    onLeave: () => void;
}

function HeroCard({
    src,
    index,
    total,
    phase,
    target,
    focusedIndex,
    onHover,
    onLeave,
}: HeroCardProps) {
    const isFocused = focusedIndex === index;

    const { dx, dy } = phase === "circle" ? getFanOffset(index, focusedIndex, total) : { dx: 0, dy: 0 };

    // We apply the “testimonial” style logic as pure class overrides.
    // To make Tailwind translates work, keep a base translate at 0.
    const fanClass = getFanClass(index, focusedIndex, total);

    return (
        <motion.div
            animate={{
                x: target.x + dx,
                y: target.y + dy,
                rotate: target.rotation,
                scale: isFocused ? 1.18 : target.scale,
                opacity: target.opacity,
                zIndex: isFocused ? 60 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: isFocused ? 320 : 90,
                damping: isFocused ? 22 : 20,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transform: "translate3d(0,0,0)",
            }}
            className={cn(
                // base translate tokens so `!translate-*` overrides apply visibly
                "cursor-pointer will-change-transform",
            )}
            onHoverStart={() => onHover(index)}
            onHoverEnd={onLeave}
        >
            <motion.div
                className={cn(
                    "relative h-full w-full rounded-xl overflow-hidden shadow-lg transition-all duration-500",
                )}
                animate={{
                    filter: isFocused ? "grayscale(0%)" : "grayscale(30%)",
                    boxShadow: isFocused
                        ? "0 0 0 2.5px #e8944a, 0 12px 40px rgba(201,123,58,0.55)"
                        : "0 4px 14px rgba(0,0,0,0.22)",
                }}
                transition={{ duration: 0.22 }}
            >
                <img
                    src={src}
                    alt={`loyalty-${index}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />

                <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{ opacity: isFocused ? 0 : 0.28 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: "var(--background)" }}
                />

                <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: isFocused ? 1 : 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(232,148,74,0.22) 0%, rgba(201,123,58,0.08) 100%)",
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;

// Loyalty & Business Related Images — all verified working Unsplash URLs
const IMAGES = [
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80",
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&q=80",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&q=80",
    "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=300&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80",
    "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=300&q=80",
    "https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=300&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&q=80",
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=300&q=80",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80",
    "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=300&q=80",
];

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Scroll-driven fade ---
    const scrollY = useMotionValue(0);
    const fadeOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const fadeScale = useTransform(scrollY, [0, 300], [1, 0.96]);
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            scrollY.set(y);
            setIsPast(y > 300);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        scrollY.set(window.scrollY);
        return () => window.removeEventListener("scroll", onScroll);
    }, [scrollY]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useRef(
        IMAGES.map(() => ({
            x: 0,
            y: 0,
            rotation: 0,
            scale: 0.6,
            opacity: 0,
        })),
    );

    useEffect(() => {
        scatterPositions.current = IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-screen overflow-hidden z-40"
            style={{
                background: "transparent",
                opacity: fadeOpacity,
                scale: fadeScale,
                pointerEvents: isPast ? "none" : "auto",
            }}
        >
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">
                {/* Centre Text — offset down to match navbar clearance */}
                <div
                    className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none"
                    style={{ top: "calc(50% + 36px)", transform: "translateY(-50%)" }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={
                            introPhase === "circle"
                                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                                : { opacity: 0, y: 20, filter: "blur(10px)" }
                        }
                        transition={{ duration: 1 }}
                        className="text-2xl font-medium tracking-tight md:text-4xl"
                        style={{ color: "var(--foreground)" }}
                    >
                        Transform Customer Loyalty
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" ? { opacity: 0.6 } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="mt-4 text-xs font-bold tracking-[0.2em]"
                        style={{ color: "#c97b3a" }}
                    >
                        SCROLL TO CONTINUE
                    </motion.p>
                </div>

                {/* Main Container — nudged down to clear the fixed navbar */}
                <div className="relative flex items-center justify-center w-full h-full" style={{ paddingTop: "72px" }}>
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        if (introPhase === "scatter") {
                            target = scatterPositions.current[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            const minDimension = Math.min(containerSize.width, containerSize.height);
                            const circleRadius = Math.min(minDimension * 0.35, 350);
                            const circleAngleDeg = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngleDeg * Math.PI) / 180;

                            target = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngleDeg + 90,
                                scale: 1,
                                opacity: 1,
                            };
                        }

                        return (
                            <HeroCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase}
                                target={target}
                                focusedIndex={focusedIndex}
                                onHover={(idx) => setFocusedIndex(idx)}
                                onLeave={() => setFocusedIndex(null)}
                            />
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

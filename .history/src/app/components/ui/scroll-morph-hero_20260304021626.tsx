"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    totalCards: number;
    /** Base circle position — used to compute the radial fan direction */
    circleAngleDeg: number;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
    /** index of the currently hovered card (-1 = none) */
    hoveredIndex: number;
    onHover: (i: number) => void;
    onLeave: () => void;
    phase: AnimationPhase;
}

// --- Card Component ---
const IMG_WIDTH = 64;
const IMG_HEIGHT = 90;

/**
 * Returns the additional x/y offset for a card at `index` given the hovered card.
 * When in circle mode we push neighbours *radially outward* so the effect
 * is clearly visible regardless of where on the circle the card sits.
 *
 * @param index         - card being rendered
 * @param hoveredIndex  - card being hovered (-1 = none)
 * @param totalCards    - total number of cards in the ring
 * @param angleDeg      - the card's own angle on the circle (degrees)
 */
function getFanOffset(
    index: number,
    hoveredIndex: number,
    totalCards: number,
    angleDeg: number,
    phase: AnimationPhase,
): { dx: number; dy: number; extraScale: number; extraZ: number } {
    if (hoveredIndex < 0 || phase !== "circle")
        return { dx: 0, dy: 0, extraScale: 1, extraZ: 0 };

    // Wrap-aware angular distance between hovered and this card
    let angularDist = index - hoveredIndex;
    // Wrap so it's always in the range [-half, +half]
    if (angularDist > totalCards / 2)  angularDist -= totalCards;
    if (angularDist < -totalCards / 2) angularDist += totalCards;

    const absD = Math.abs(angularDist);

    // Hovered card pops forward — callers handle scale via isHovered
    if (absD === 0) return { dx: 0, dy: 0, extraScale: 1.22, extraZ: 50 };

    // Radial unit vector pointing away from origin for this card
    const rad = (angleDeg * Math.PI) / 180;
    const ux = Math.cos(rad);
    const uy = Math.sin(rad);

    // Push magnitude drops with distance
    let push = 0;
    if (absD === 1) push = 52;
    else if (absD === 2) push = 30;
    else if (absD === 3) push = 14;
    else return { dx: 0, dy: 0, extraScale: 1, extraZ: 0 };

    return {
        dx: ux * push,
        dy: uy * push,
        extraScale: 1,
        extraZ: 0,
    };
}

function FlipCard({
    src,
    index,
    totalCards,
    circleAngleDeg,
    target,
    hoveredIndex,
    onHover,
    onLeave,
    phase,
}: FlipCardProps) {
    const { dx, dy, extraScale, extraZ } = getFanOffset(
        index,
        hoveredIndex,
        totalCards,
        circleAngleDeg,
        phase,
    );
    const isHovered = hoveredIndex === index;
    const scale = (target.scale || 1) * extraScale;

    return (
        <motion.div
            animate={{
                x: target.x + dx,
                y: target.y + dy,
                rotate: target.rotation,
                scale,
                opacity: target.opacity,
                zIndex: isHovered ? 60 : extraZ > 0 ? extraZ : 1,
            }}
            transition={{
                type: "spring",
                stiffness: isHovered ? 320 : 80,
                damping: isHovered ? 22 : 20,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
            }}
            className="cursor-pointer"
            onHoverStart={() => onHover(index)}
            onHoverEnd={onLeave}
        >
            {/* Card shell */}
            <motion.div
                className="relative h-full w-full rounded-xl overflow-hidden shadow-lg"
                animate={{
                    filter: isHovered ? "grayscale(0%)" : "grayscale(30%)",
                    boxShadow: isHovered
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

                {/* Dim overlay */}
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{ opacity: isHovered ? 0 : 0.28 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: "var(--background)" }}
                />

                {/* Orange shimmer on hover */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: isHovered ? 1 : 0 }}
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
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&q=80", // Hand tapping phone to pay
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80", // Cashier / POS terminal
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&q=80", // Shopping bags closeup
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80", // Gift card / present
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&q=80", // Stack of credit/loyalty cards
    "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=300&q=80", // QR code scan on phone
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80", // Coffee cup on counter
    "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=300&q=80", // Barista making coffee
    "https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=300&q=80", // Hairdresser / salon chair
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&q=80", // Barber shop
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80", // Clothing boutique
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&q=80", // Busy shopping street
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80", // Woman with shopping bags
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80", // Analytics dashboard
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&q=80", // Team reviewing data
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=300&q=80", // Happy customer smiling
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80", // Loyalty app on phone
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80", // Restaurant table experience
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80", // Healthy food / café
    "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=300&q=80", // Retail store interior
];

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
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
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useRef(
        IMAGES.map(() => ({
            x: 0,
            y: 0,
            rotation: 0,
            scale: 0.6,
            opacity: 0,
        }))
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
                background: "var(--background)",
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
                        animate={introPhase === "circle"
                            ? { opacity: 1, y: 0, filter: "blur(0px)" }
                            : { opacity: 0, y: 20, filter: "blur(10px)" }}
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
                <div
                    className="relative flex items-center justify-center w-full h-full"
                    style={{ paddingTop: "72px" }}
                >
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        // Always pre-compute the circle angle so FlipCard can use it
                        // for radial fan-out even when phase hasn't reached "circle" yet.
                        const circleAngleDeg = (i / TOTAL_IMAGES) * 360;
                        const circleRad = (circleAngleDeg * Math.PI) / 180;

                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        if (introPhase === "scatter") {
                            target = scatterPositions.current[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // Circle phase
                            const minDimension = Math.min(containerSize.width, containerSize.height);
                            const circleRadius = Math.min(minDimension * 0.35, 350);

                            target = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngleDeg + 90,
                                scale: 1,
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                totalCards={TOTAL_IMAGES}
                                circleAngleDeg={circleAngleDeg}
                                phase={introPhase}
                                target={target}
                                hoveredIndex={hoveredIndex}
                                onHover={(idx) => setHoveredIndex(idx)}
                                onLeave={() => setHoveredIndex(-1)}
                            />
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

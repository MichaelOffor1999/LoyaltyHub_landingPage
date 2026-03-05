"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- Card Component ---
const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({
    src,
    index,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}
            whileHover={{
                scale: (target.scale || 1) * 1.18,
                zIndex: 50,
                transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
            }}
            className="cursor-pointer group"
        >
            {/* Card shell */}
            <motion.div
                className="relative h-full w-full rounded-xl overflow-hidden shadow-lg"
                whileHover={{
                    boxShadow: "0 0 0 2px #e8944a, 0 8px 32px rgba(201,123,58,0.45)",
                }}
                transition={{ duration: 0.2 }}
            >
                <img
                    src={src}
                    alt={`loyalty-${index}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
                {/* Hover shimmer overlay */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(232,148,74,0.18) 0%, rgba(201,123,58,0.06) 100%)",
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
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80", // Coffee shop
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&q=80", // Shopping street
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&q=80", // Business meeting
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80", // Customer service
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80", // Mobile app
    "https://images.unsplash.com/photo-1604719312566-8912e9667d9f?w=300&q=80", // Retail store
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&q=80", // Credit cards
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80", // Restaurant dining
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80", // Clothing store
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&q=80", // Team collaboration
    "https://images.unsplash.com/photo-1560066984-138daaa4e4e9?w=300&q=80", // Salon/spa
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", // Business person
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80", // Analytics/data
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80", // Shopping bags
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&q=80", // Barber shop
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80", // Office workspace
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&q=80", // QR code scanning
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80", // Gift cards
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=300&q=80", // Customer happy
    "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=300&q=80", // Mobile payment
];

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
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

        // Initial set
        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Scroll-driven fade ---
    // Reads actual window scroll to drive opacity: fully visible at scroll=0,
    // fades out between 0px and 300px of scroll, hidden beyond that.
    const scrollY = useMotionValue(0);
    const fadeOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const fadeScale = useTransform(scrollY, [0, 300], [1, 0.96]);
    // Disable pointer events once scrolled past
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            scrollY.set(y);
            setIsPast(y > 300);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        // sync on mount
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
    // Use a ref so values are stable across renders and never computed on the server
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
        // Generate random positions client-side only to avoid hydration mismatch
        scatterPositions.current = IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Fade Out Effect ---
    // When user scrolls past animation, hide entire component

    return (
        <motion.div 
            ref={containerRef} 
            className="fixed top-0 left-0 w-full h-screen overflow-hidden z-40"
            style={{ 
                background: "var(--background)",
                opacity: fadeOpacity,
                scale: fadeScale,
                pointerEvents: isPast ? 'none' : 'auto',
            }}
        >
            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Centre Text */}
                <div className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(10px)" }}
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

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line -> Circle, then stay)
                        if (introPhase === "scatter") {
                            target = scatterPositions.current[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase - Stay perfectly still, no parallax
                            const minDimension = Math.min(containerSize.width, containerSize.height);
                            const circleRadius = Math.min(minDimension * 0.35, 350);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            
                            target = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                                scale: 1,
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                target={target}
                            />
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

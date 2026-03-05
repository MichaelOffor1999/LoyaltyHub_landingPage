"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;  // Reduced from 100
const IMG_HEIGHT = 85; // Reduced from 140

function FlipCard({
    src,
    index,
    total,
    phase,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            // Smoothly animate to the coordinates defined by the parent
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

            // Initial style
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d", // Essential for the 3D hover effect
                perspective: "1000px",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`hero-${index}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-900 flex flex-col items-center justify-center p-4 border border-gray-700"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-1">View</p>
                        <p className="text-xs font-medium text-white">Details</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000; // Virtual scroll range

// Loyalty & Business Related Images
const IMAGES = [
    "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=300&q=80", // Coffee shop loyalty
    "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=300&q=80", // Shopping rewards
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&q=80", // Business meeting
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=300&q=80", // Customer service
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&q=80", // Mobile app
    "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=300&q=80", // Retail store
    "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=300&q=80", // Credit cards
    "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=300&q=80", // Restaurant dining
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80", // Clothing store
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&q=80", // Team collaboration
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&q=80", // Salon/spa
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&q=80", // Business person
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80", // Analytics/data
    "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=300&q=80", // Shopping bags
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80", // Barber shop
    "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=300&q=80", // Office workspace
    "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=300&q=80", // QR code scanning
    "https://images.unsplash.com/photo-1556742521-9713bf272865?w=300&q=80", // Gift cards
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=300&q=80", // Customer happy
    "https://images.unsplash.com/photo-1556742407-5ab6e0e67212?w=300&q=80", // Mobile payment
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

    // --- Animation Complete State ---
    const [isScrollPastAnimation, setIsScrollPastAnimation] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const handleWheel = (e: WheelEvent) => {
            // If animation is done (circle formed) and user scrolls down, hide animation
            if (introPhase === "circle" && e.deltaY > 0 && !isScrollPastAnimation) {
                setIsScrollPastAnimation(true);
            }
        };

        const container = containerRef.current;
        container.addEventListener("wheel", handleWheel, { passive: true });

        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, [introPhase, isScrollPastAnimation]);

    // --- Mouse Parallax ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;

            // Normalize -1 to 1
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            // Move +/- 100px
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    // --- Render Loop (Manual Calculation for Parallax only) ---
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeParallax();
        };
    }, [smoothMouseX]);

    // --- Fade Out Effect ---
    // When user scrolls past animation, hide entire component
    const animationOpacity = isScrollPastAnimation ? 0 : 1;

    return (
        <motion.div 
            ref={containerRef} 
            className="relative w-full h-full bg-[#f7f4ef] overflow-hidden"
            style={{ 
                opacity: fadeOutOpacity,
                scale: fadeOutScale,
            }}
        >
            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text (Fades out) */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                        className="text-2xl font-medium tracking-tight text-gray-800 md:text-4xl"
                    >
                        Transform Customer Loyalty
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" ? { opacity: 0.5 } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-4 text-xs font-bold tracking-[0.2em]"
                        style={{ color: "#c97b3a" }}
                    >
                        SCROLL TO CONTINUE
                    </motion.p>
                </div>

                {/* Main Content - Always visible when circle forms */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={introPhase === "circle" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
                >
                    <h2 
                        className="text-3xl md:text-5xl font-semibold tracking-tight mb-4"
                        style={{ color: "#111827" }}
                    >
                        Discover Clienty
                    </h2>
                    <p 
                        className="text-sm md:text-base max-w-lg leading-relaxed"
                        style={{ color: "#374151", fontWeight: 600 }}
                    >
                        Innovative loyalty solutions that turn every customer<br className="hidden md:block" />
                        into a loyal fan who keeps coming back.
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line -> Circle, then stay)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase - Stay in circle (no morphing)
                            const minDimension = Math.min(containerSize.width, containerSize.height);
                            const circleRadius = Math.min(minDimension * 0.35, 350);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            
                            target = {
                                x: Math.cos(circleRad) * circleRadius + parallaxValue,
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
                                total={TOTAL_IMAGES}
                                phase={introPhase}
                                target={target}
                            />
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

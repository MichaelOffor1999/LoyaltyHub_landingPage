"use client";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

const word = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

// Single line headline
const lines: { text: string; orange?: boolean }[][] = [
  [{ text: "OWN YOUR " }, { text: "CUSTOMER BASE", orange: true }],
];

export default function AnimatedHeroHeadline() {
  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className="font-extrabold leading-tight tracking-tight mb-0 text-center uppercase whitespace-nowrap"
      style={{ perspective: 1000, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 auto" }}
    >
      {lines.map((parts, li) => (
        <motion.span key={li} variants={word} className="block">
          {parts.map((part, pi) => (
            <span
              key={pi}
              style={
                part.orange
                  ? {
                      background: "linear-gradient(135deg, #d4943c, #e8a54e, #f0c47d)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : { color: "#ffffff" }
              }
            >
              {part.text}
            </span>
          ))}
        </motion.span>
      ))}
    </motion.h1>
  );
}

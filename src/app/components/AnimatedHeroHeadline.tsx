"use client";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } },
};

const line = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const lines: { text: string; amber?: boolean }[][] = [
  [{ text: "Turn first-time clients" }],
  [{ text: "into loyal " }, { text: "regulars.", amber: true }],
];

export default function AnimatedHeroHeadline() {
  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className="font-extrabold leading-[1.08] tracking-tight"
      style={{ letterSpacing: "-0.025em" }}
    >
      {lines.map((parts, li) => (
        <motion.span key={li} variants={line} className="block">
          {parts.map((part, pi) => (
            <span
              key={pi}
              style={
                part.amber
                  ? { color: "#c97b3a" }
                  : { color: "#1a1410" }
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

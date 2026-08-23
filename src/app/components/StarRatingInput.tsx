"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarRatingInput({
  value,
  onChange,
  size = 40,
  disabled = false,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-60"
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            color={i <= display ? "var(--brand)" : "rgba(255,255,255,0.45)"}
            fill={i <= display ? "var(--brand)" : "transparent"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

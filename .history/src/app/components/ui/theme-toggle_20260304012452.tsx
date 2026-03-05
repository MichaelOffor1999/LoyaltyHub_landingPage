"use client";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
        color: isDark ? "#f5b97a" : "#c97b3a",
        boxShadow: isDark
          ? "0 0 0 0 transparent"
          : "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {isDark
        ? <Sun size={16} strokeWidth={2.2} />
        : <Moon size={16} strokeWidth={2.2} />
      }
    </button>
  );
}

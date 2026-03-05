"use client";

/**
 * StarsBackground — Demo Page
 *
 * Route: /stars-demo  (file: src/app/stars-demo/page.tsx)
 *
 * Shows four live examples side-by-side.  Remove this file once you're
 * satisfied with the component and have integrated it into your real pages.
 */

import React, { useState } from "react";
import { StarsBackground } from "@/app/components/ui/stars";

// ─── Small labelled preview card ─────────────────────────────────────────────

interface PreviewCardProps {
  label: string;
  description: string;
  children: React.ReactNode;
  code: string;
}

function PreviewCard({ label, description, children, code }: PreviewCardProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Preview area */}
      <div className="relative h-52 overflow-hidden" style={{ background: "#0a0a0f" }}>
        {children}
        <div
          className="absolute bottom-3 left-3 text-xs font-bold px-2 py-1 rounded-md"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            color: "#f5b97a",
            border: "1px solid rgba(201,123,58,0.3)",
          }}
        >
          {label}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          {description}
        </p>
        <button
          onClick={() => setShowCode((v) => !v)}
          className="self-start text-xs font-semibold px-3 py-1.5 rounded-lg transition hover:opacity-80"
          style={{
            background: "rgba(201,123,58,0.12)",
            border: "1px solid rgba(201,123,58,0.25)",
            color: "#e8944a",
          }}
        >
          {showCode ? "Hide code" : "Show code"}
        </button>

        {showCode && (
          <pre
            className="mt-1 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#c8d3f5",
            }}
          >
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

// ─── Demo page ───────────────────────────────────────────────────────────────

export default function StarsDemoPage() {
  return (
    <div
      className="min-h-screen px-6 py-16"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black tracking-tight">
            <span
              style={{
                background: "linear-gradient(90deg, #c97b3a, #e8944a, #f5b97a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              StarsBackground
            </span>{" "}
            Component
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-sub)" }}>
            A canvas-based animated star field with twinkle and mouse-parallax
            effects. Drop it inside any{" "}
            <code className="text-sm px-1.5 py-0.5 rounded bg-white/5">relative</code>{" "}
            container — it fills the parent automatically.
          </p>
        </div>

        {/* ── Full-width hero demo ── */}
        <div
          className="relative w-full h-64 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: "#0a0a0f" }}
        >
          <StarsBackground starCount={300} parallaxStrength={40} />
          <div className="relative z-10 text-center">
            <p className="text-2xl font-black text-white">Full-width hero</p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              Move your mouse over this area
            </p>
          </div>
        </div>

        {/* ── 2-column variants grid ── */}
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Default */}
          <PreviewCard
            label="Default"
            description="200 white stars with twinkle and mild parallax — the safest starting point for any dark section."
            code={`<div className="relative h-64 rounded-2xl overflow-hidden">
  <StarsBackground />
  <YourContent className="relative z-10" />
</div>`}
          >
            <StarsBackground />
          </PreviewCard>

          {/* Brand colours */}
          <PreviewCard
            label="Brand colours"
            description="Custom star colour matching the Clienty orange palette — great for hero sections."
            code={`<StarsBackground
  starCount={250}
  starColor="rgba(245,185,122,0.85)"
  parallaxStrength={30}
/>`}
          >
            <StarsBackground
              starCount={250}
              starColor="rgba(245,185,122,0.85)"
              parallaxStrength={30}
            />
          </PreviewCard>

          {/* Dense & fast twinkle */}
          <PreviewCard
            label="Dense + fast twinkle"
            description="400 stars with 2× twinkle speed — dramatic effect for full-page backgrounds."
            code={`<StarsBackground
  starCount={400}
  twinkleSpeed={2}
  minRadius={0.3}
  maxRadius={1.4}
/>`}
          >
            <StarsBackground starCount={400} twinkleSpeed={2} minRadius={0.3} maxRadius={1.4} />
          </PreviewCard>

          {/* Subtle / no parallax */}
          <PreviewCard
            label="Subtle / static"
            description="Few large stars, no parallax, slow twinkle — ideal for cards or testimonial sections."
            code={`<StarsBackground
  starCount={80}
  minRadius={1}
  maxRadius={2.5}
  twinkleSpeed={0.4}
  parallax={false}
/>`}
          >
            <StarsBackground
              starCount={80}
              minRadius={1}
              maxRadius={2.5}
              twinkleSpeed={0.4}
              parallax={false}
            />
          </PreviewCard>
        </div>

        {/* ── Props reference table ── */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Props</h2>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--card-border)" }}>
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid var(--card-border)" }}>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-sub)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["starCount", "number", "200", "Number of stars"],
                  ["minRadius", "number", "0.4", "Minimum star radius (px)"],
                  ["maxRadius", "number", "1.8", "Maximum star radius (px)"],
                  ["parallax", "boolean", "true", "Enable mouse-move parallax"],
                  ["parallaxStrength", "number", "25", "Parallax intensity (px)"],
                  ["twinkle", "boolean", "true", "Enable twinkle animation"],
                  ["twinkleSpeed", "number", "1", "Twinkle speed multiplier"],
                  ["starColor", "string", "undefined", "Custom CSS colour string"],
                  ["className", "string", "undefined", "Extra classes for the canvas"],
                  ["ariaHidden", "boolean", "true", "Hides canvas from screen readers"],
                ].map(([prop, type, def, desc]) => (
                  <tr
                    key={prop}
                    style={{ borderBottom: "1px solid var(--card-border)" }}
                  >
                    <td className="px-4 py-2.5 font-mono" style={{ color: "#f5b97a" }}>{prop}</td>
                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "#c8d3f5" }}>{type}</td>
                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{def}</td>
                    <td className="px-4 py-2.5" style={{ color: "var(--text-sub)" }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Integration guide ── */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Integration guide</h2>
          <ol className="flex flex-col gap-3 list-decimal list-inside text-sm" style={{ color: "var(--text-sub)" }}>
            <li>
              The component is already in{" "}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5">
                src/app/components/ui/stars.tsx
              </code>
              . No extra npm packages are needed — it uses only the browser Canvas API.
            </li>
            <li>
              Import it:{" "}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5">
                {`import { StarsBackground } from "@/app/components/ui/stars";`}
              </code>
            </li>
            <li>
              Wrap your section in a{" "}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5">relative overflow-hidden</code>{" "}
              container and place{" "}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5">{`<StarsBackground />`}</code>{" "}
              as the first child. All other children need{" "}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5">relative z-10</code>.
            </li>
            <li>
              The canvas carries the{" "}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5">stars-layer</code>{" "}
              CSS class, which is already defined in{" "}
              <code className="text-xs px-1.5 py-0.5 rounded bg-white/5">globals.css</code>{" "}
              to hide the stars automatically in light mode.
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
}

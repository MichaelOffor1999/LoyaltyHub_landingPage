/**
 * TopoBackground — generates a topographic contour-line SVG background,
 * similar to the Starlink website hero. Fully deterministic, no client state.
 */

const W = 1440;
const H = 940;
const LINE_COUNT = 42;
const SEGMENTS = 20; // cubic bezier segments per line

/** Deterministic "noise" using sine harmonics */
function waveY(x: number, baseY: number, seed: number): number {
  const t = x / W;
  return (
    baseY
    // Primary undulation — slow broad wave
    + 38 * Math.sin(t * Math.PI * 2.4 + seed * 1.13)
    // Secondary — medium frequency
    + 22 * Math.sin(t * Math.PI * 5.1 + seed * 0.74)
    // Tertiary — fine detail
    + 11 * Math.sin(t * Math.PI * 9.7 + seed * 1.62)
    + 6  * Math.sin(t * Math.PI * 14.3 + seed * 2.1)
    // Terrain bumps — two "peaks" that bend contours around them
    + 72 * Math.exp(-Math.pow((t - 0.72) * 2.6, 2)) * Math.sin(seed * 0.55 + 0.6)
    + 48 * Math.exp(-Math.pow((t - 0.18) * 3.1, 2)) * Math.cos(seed * 0.82 + 1.1)
    + 30 * Math.exp(-Math.pow((t - 0.45) * 4.0, 2)) * Math.sin(seed * 1.3 + 0.3)
  );
}

function buildPath(lineIndex: number): string {
  const baseY = (lineIndex / LINE_COUNT) * H;
  // Unique seed per line so each has different phase
  const seed = lineIndex * 0.41 + 0.17;

  const segW = (W + 60) / SEGMENTS;
  const xs: number[] = [];
  const ys: number[] = [];

  for (let j = 0; j <= SEGMENTS; j++) {
    const x = -30 + j * segW;
    xs.push(x);
    ys.push(waveY(x, baseY, seed));
  }

  let d = `M ${xs[0]} ${ys[0]}`;
  for (let j = 1; j <= SEGMENTS; j++) {
    const cp1x = xs[j - 1] + segW * 0.35;
    const cp2x = xs[j] - segW * 0.35;
    d += ` C ${cp1x.toFixed(1)} ${ys[j - 1].toFixed(1)} ${cp2x.toFixed(1)} ${ys[j].toFixed(1)} ${xs[j].toFixed(1)} ${ys[j].toFixed(1)}`;
  }

  return d;
}

export default function TopoBackground() {
  const paths = Array.from({ length: LINE_COUNT }, (_, i) => buildPath(i));

  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.035)"
          strokeWidth="0.9"
        />
      ))}
    </svg>
  );
}

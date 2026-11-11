/**
 * Original vector vehicle illustrations, generated from body type + paint
 * colour. Used instead of photography so the prototype contains no
 * third-party or Budget-owned imagery. Drawn facing the reading direction.
 */
import type { Body } from "@/data/vehicles";
import { useId } from "react";

interface Geometry {
  body: string;
  glass: string;
  wheels: [number, number];
  r: number;
  ground: number;
  pillar: number;
  doors: number[];
  roofLine: number;
}

const G: Record<Body, Geometry> = {
  sedan: {
    body: "M20,118 L20,96 Q22,82 42,78 L98,73 Q132,46 172,41 L246,41 Q276,43 306,69 L360,79 Q386,85 389,101 L390,118 Z",
    glass: "M112,73 Q140,51 173,47 L242,47 Q264,49 290,71 Z",
    wheels: [96, 312], r: 26, ground: 118, pillar: 204, doors: [150, 252], roofLine: 41,
  },
  coupe: {
    body: "M20,116 L20,98 Q24,86 46,82 L110,76 Q150,50 190,46 L240,46 Q280,50 312,72 L362,82 Q388,88 390,102 L390,116 Z",
    glass: "M126,76 Q156,55 192,52 L238,52 Q266,55 294,74 Z",
    wheels: [100, 314], r: 26, ground: 116, pillar: 214, doors: [214], roofLine: 46,
  },
  hatch: {
    body: "M24,120 L24,74 Q28,52 54,46 Q84,34 122,32 L222,32 Q254,35 286,66 L346,76 Q373,82 376,98 L377,120 Z",
    glass: "M52,66 Q60,44 95,40 L216,40 Q240,42 264,66 Z",
    wheels: [92, 302], r: 26, ground: 120, pillar: 156, doors: [156, 250], roofLine: 32,
  },
  suv: {
    body: "M18,122 L18,82 Q20,66 34,62 L60,58 Q72,30 102,28 L262,28 Q288,30 314,58 L364,66 Q389,72 391,92 L392,122 Z",
    glass: "M74,58 Q82,36 106,35 L256,35 Q277,37 299,58 Z",
    wheels: [94, 318], r: 29, ground: 122, pillar: 186, doors: [130, 248], roofLine: 28,
  },
  van: {
    body: "M18,124 L18,40 Q20,24 40,22 L272,22 Q302,24 332,56 L370,68 Q390,74 391,94 L392,124 Z",
    glass: "M34,58 L34,36 Q36,30 46,30 L264,30 Q287,32 311,58 Z",
    wheels: [90, 320], r: 27, ground: 124, pillar: 236, doors: [120, 236], roofLine: 22,
  },
  pickup: {
    body: "M18,124 L18,72 L172,72 L174,34 Q176,26 188,26 L264,26 Q287,28 312,62 L366,70 Q390,76 391,96 L392,124 Z",
    glass: "M184,62 L186,34 L260,34 Q278,36 298,62 Z",
    wheels: [92, 320], r: 28, ground: 124, pillar: 230, doors: [230], roofLine: 26,
  },
};

function Wheel({ cx, cy, r, spin }: { cx: number; cy: number; r: number; spin?: boolean }) {
  const spokes = [0, 72, 144, 216, 288];
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 4} fill="#05070b" />
      <circle cx={cx} cy={cy} r={r} fill="#14171d" />
      <circle cx={cx} cy={cy} r={r * 0.68} fill="#3a3f48" />
      <g className={spin ? "origin-center" : undefined} style={spin ? { transformBox: "fill-box", transformOrigin: "center", animation: "spin 0.5s linear infinite" } : undefined}>
        {spokes.map((a) => (
          <rect key={a} x={cx - 2.2} y={cy - r * 0.64} width={4.4} height={r * 0.62} rx={2} fill="#c9ced6" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={r * 0.68} fill="none" stroke="#9aa1ab" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r * 0.16} fill="#c9ced6" />
    </g>
  );
}

export function CarArt({
  body,
  color,
  className,
  spin = false,
  shadow = true,
  label,
}: {
  body: Body;
  color: string;
  className?: string;
  spin?: boolean;
  shadow?: boolean;
  label?: string;
}) {
  const g = G[body];
  const id = useId().replace(/:/g, "");
  const [w1, w2] = g.wheels;
  const front = Math.max(...g.body.match(/\d+(?=,)/g)!.map(Number));
  return (
    <svg viewBox="0 0 410 150" className={`rtl-flip ${className ?? ""}`} role={label ? "img" : "presentation"} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id={`paint-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.28" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="0.62" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fb3d9" />
          <stop offset="0.45" stopColor="#1b2a3f" />
          <stop offset="1" stopColor="#0a111c" />
        </linearGradient>
        <radialGradient id={`shadow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip-${id}`}>
          <path d={g.body} />
        </clipPath>
      </defs>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {shadow && <ellipse cx={205} cy={g.ground + 8} rx={200} ry={11} fill={`url(#shadow-${id})`} />}
      <path d={g.body} fill={color} />
      <g clipPath={`url(#clip-${id})`}>
        <path d={g.body} fill={`url(#paint-${id})`} />
        {/* character line */}
        <path d={`M24,${g.ground - 38} L${front - 6},${g.ground - 44}`} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
        <path d={`M24,${g.ground - 14} L${front},${g.ground - 16}`} stroke="#000" strokeOpacity="0.25" strokeWidth="6" />
        {g.doors.map((x) => (
          <line key={x} x1={x} y1={g.roofLine + 30} x2={x - 2} y2={g.ground - 8} stroke="#000" strokeOpacity="0.28" strokeWidth="1.2" />
        ))}
      </g>
      <path d={g.glass} fill={`url(#glass-${id})`} />
      <path d={g.glass} fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="1.5" />
      <line x1={g.pillar} y1={g.roofLine + 4} x2={g.pillar - 2} y2={g.roofLine + 34} stroke={color} strokeWidth="6" />
      <line x1={g.pillar} y1={g.roofLine + 4} x2={g.pillar - 2} y2={g.roofLine + 34} stroke="#000" strokeOpacity="0.35" strokeWidth="6" />
      {/* lights */}
      <path d={`M${front - 18},${g.ground - 34} l16,3 l1,8 l-18,-2 z`} fill="#fff7e0" />
      <path d={`M${front - 18},${g.ground - 34} l16,3 l1,8 l-18,-2 z`} fill="#ffd27a" opacity="0.5" />
      <rect x={20} y={g.ground - 40} width={7} height={11} rx={2} fill="#d0182a" />
      {/* mirror */}
      <path d={`M${g.wheels[1] - 22},${g.roofLine + 31} l12,-2 l2,8 l-12,1 z`} fill={color} stroke="#000" strokeOpacity="0.4" />
      <Wheel cx={w1} cy={g.ground} r={g.r} spin={spin} />
      <Wheel cx={w2} cy={g.ground} r={g.r} spin={spin} />
    </svg>
  );
}

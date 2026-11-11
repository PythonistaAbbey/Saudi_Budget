"use client";

/**
 * Cinematic hero, drawn entirely as original vector art (no photography):
 * three Saudi landscapes — a Riyadh-inspired night skyline, AlUla-inspired
 * sandstone at dusk, and a Red Sea coastal road at sunrise — cross-fading
 * with a featured vehicle that changes per scene.
 */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CarArt } from "./CarArt";
import type { Body } from "@/data/vehicles";
import { useI18n } from "@/i18n/client";

export interface Scene {
  id: string;
  label: { en: string; ar: string };
  car: { body: Body; color: string; name: string };
}

export const SCENES: Scene[] = [
  { id: "riyadh", label: { en: "Riyadh · after dark", ar: "الرياض · بعد الغروب" }, car: { body: "sedan", color: "#d9dde3", name: "Luxury sedan" } },
  { id: "alula", label: { en: "AlUla · golden hour", ar: "العلا · الساعة الذهبية" }, car: { body: "suv", color: "#e9e4da", name: "Full-size 4×4" } },
  { id: "redsea", label: { en: "Red Sea coast · sunrise", ar: "ساحل البحر الأحمر · الشروق" }, car: { body: "sedan", color: "#7cc7c9", name: "Electric saloon" } },
];

function Riyadh() {
  // Procedural skyline with a tower whose crown is an inverted arch, and a needle tower.
  const blocks = [
    [40, 210], [95, 160], [140, 250], [190, 190], [250, 300], [300, 230], [350, 180], [420, 260], [470, 200],
    [930, 230], [980, 280], [1040, 200], [1090, 320], [1150, 240], [1210, 190], [1270, 270], [1330, 210], [1390, 250],
  ];
  return (
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050913" />
          <stop offset="0.55" stopColor="#0e2240" />
          <stop offset="0.85" stopColor="#3b2a3e" />
          <stop offset="1" stopColor="#9a4a2a" />
        </linearGradient>
        <linearGradient id="r-tower" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0d1626" />
          <stop offset="0.5" stopColor="#1f3354" />
          <stop offset="1" stopColor="#0d1626" />
        </linearGradient>
        <radialGradient id="r-glow" cx="0.5" cy="1" r="0.8">
          <stop offset="0" stopColor="#f47b20" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f47b20" stopOpacity="0" />
        </radialGradient>
        <pattern id="r-win" width="14" height="18" patternUnits="userSpaceOnUse">
          <rect width="14" height="18" fill="transparent" />
          <rect x="3" y="4" width="4" height="6" fill="#ffd9a0" opacity="0.55" />
        </pattern>
      </defs>
      <rect width="1440" height="800" fill="url(#r-sky)" />
      {Array.from({ length: 70 }).map((_, i) => (
        <circle key={i} cx={(i * 197) % 1440} cy={(i * 83) % 360} r={i % 7 === 0 ? 1.4 : 0.8} fill="#fff" opacity={0.25 + ((i * 13) % 50) / 100} />
      ))}
      <circle cx="1180" cy="150" r="34" fill="#f6efe0" opacity="0.9" />
      <circle cx="1194" cy="142" r="32" fill="#0b1830" opacity="0.92" />
      <rect y="420" width="1440" height="380" fill="url(#r-glow)" />
      {blocks.map(([x, h], i) => (
        <g key={i}>
          <rect x={x} y={640 - h} width={46} height={h} fill={i % 2 ? "#0b1424" : "#0f1b30"} />
          <rect x={x} y={640 - h} width={46} height={h} fill="url(#r-win)" opacity={0.5 + (i % 3) * 0.2} />
        </g>
      ))}
      {/* Arch-crowned tower */}
      <path d="M640,640 L640,250 Q650,120 676,90 L700,90 Q690,170 720,230 Q750,170 740,90 L764,90 Q790,120 800,250 L800,640 Z" fill="url(#r-tower)" />
      <path d="M676,90 L700,90 Q690,170 720,230 Q750,170 740,90 L764,90" fill="none" stroke="#f9b26b" strokeWidth="2" opacity="0.9" />
      <rect x="652" y="300" width="136" height="340" fill="url(#r-win)" opacity="0.45" />
      {/* Needle tower */}
      <path d="M560,640 L566,220 L574,150 L578,60 L582,150 L590,220 L596,640 Z" fill="#14233d" />
      <circle cx="578" cy="60" r="3" fill="#ff5a3c">
        <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M860,640 L860,330 L900,300 L940,330 L940,640 Z" fill="#101c31" />
      <rect x="866" y="340" width="68" height="300" fill="url(#r-win)" opacity="0.6" />
      <rect y="636" width="1440" height="164" fill="#05080f" />
    </svg>
  );
}

function AlUla() {
  return (
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <linearGradient id="a-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b1f3a" />
          <stop offset="0.45" stopColor="#c0603a" />
          <stop offset="0.8" stopColor="#f2a65a" />
          <stop offset="1" stopColor="#f7d08a" />
        </linearGradient>
        <linearGradient id="a-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c5703f" />
          <stop offset="1" stopColor="#5c2c1d" />
        </linearGradient>
        <linearGradient id="a-rock2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e4a2c" />
          <stop offset="1" stopColor="#3a1c14" />
        </linearGradient>
        <linearGradient id="a-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d99a5b" />
          <stop offset="1" stopColor="#6e3a22" />
        </linearGradient>
      </defs>
      <rect width="1440" height="800" fill="url(#a-sky)" />
      <circle cx="380" cy="470" r="80" fill="#ffe2a8" opacity="0.85" />
      <path d="M0,560 Q200,520 360,540 T720,530 T1080,520 T1440,540 L1440,800 L0,800 Z" fill="#a85a35" opacity="0.6" />
      {/* Arch-shaped sandstone outcrop */}
      <path d="M820,640 L840,470 Q860,380 930,360 Q1010,350 1060,380 Q1110,420 1120,500 L1130,640 L1040,640 Q1036,560 1000,540 Q960,530 940,560 Q925,590 925,640 Z" fill="url(#a-rock)" />
      <path d="M940,560 Q960,530 1000,540 Q1036,560 1040,640 L925,640 Q925,590 940,560 Z" fill="#2a120b" opacity="0.55" />
      <path d="M1150,640 L1170,520 Q1200,470 1260,480 Q1320,500 1330,560 L1340,640 Z" fill="url(#a-rock2)" />
      <path d="M60,640 L90,520 Q120,470 190,470 Q240,480 260,540 L280,640 Z" fill="url(#a-rock2)" />
      <path d="M0,700 Q300,610 620,650 T1440,640 L1440,800 L0,800 Z" fill="url(#a-sand)" />
      <path d="M0,760 Q400,690 900,730 T1440,720 L1440,800 L0,800 Z" fill="#3c1d12" opacity="0.7" />
    </svg>
  );
}

function RedSea() {
  return (
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <linearGradient id="s-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f2a4a" />
          <stop offset="0.5" stopColor="#4f7fa6" />
          <stop offset="0.8" stopColor="#f3c58c" />
          <stop offset="1" stopColor="#ffe3b8" />
        </linearGradient>
        <linearGradient id="s-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a8f9a" />
          <stop offset="1" stopColor="#0a3a4f" />
        </linearGradient>
      </defs>
      <rect width="1440" height="800" fill="url(#s-sky)" />
      <circle cx="1040" cy="520" r="70" fill="#fff1d2" />
      <path d="M0,500 Q180,440 340,480 Q420,420 520,470 L520,520 L0,520 Z" fill="#3f4d63" opacity="0.6" />
      <rect y="518" width="1440" height="140" fill="url(#s-sea)" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={980 + ((i * 37) % 120) - 60} y={530 + i * 7} width={60 - i * 2.5} height="2" rx="1" fill="#fff4dc" opacity={0.7 - i * 0.04} />
      ))}
      {/* Palms */}
      {[180, 260, 1300].map((x, i) => (
        <g key={x} transform={`translate(${x} ${640 - i * 6})`} fill="#10202c">
          <path d="M0,0 Q6,-90 -4,-170 L4,-170 Q16,-90 8,0 Z" />
          {[-60, -25, 15, 50, 85, 130].map((a) => (
            <path key={a} d="M0,-170 Q40,-190 90,-160 Q40,-175 0,-166 Z" transform={`rotate(${a} 0 -170)`} />
          ))}
        </g>
      ))}
      <rect y="640" width="1440" height="160" fill="#c8a57a" />
      <rect y="640" width="1440" height="18" fill="#e7cfa6" />
    </svg>
  );
}

const ART: Record<string, () => React.ReactElement> = { riyadh: Riyadh, alula: AlUla, redsea: RedSea };

export function HeroScene({ onScene }: { onScene?: (i: number) => void }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const { locale } = useI18n();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % SCENES.length), 7000);
    return () => clearInterval(id);
  }, [reduce, paused]);
  useEffect(() => onScene?.(i), [i, onScene]);

  const s = SCENES[i];
  const Art = ART[s.id];

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence mode="sync">
        <motion.div key={s.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
          <div className="absolute inset-0 animate-drift">
            <Art />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Road */}
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[36%] w-full md:h-[30%]" aria-hidden>
        <rect width="1440" height="200" fill="#07090e" />
        <rect y="0" width="1440" height="4" fill="#2a2f39" />
        <line x1="0" y1="40" x2="1440" y2="40" stroke="#d8dbe0" strokeWidth="5" strokeDasharray="44 36" className={reduce ? "" : "animate-road"} style={{ animationDirection: locale === "ar" ? "reverse" : "normal" }} />
      </svg>

      {/* Car */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(36%-4.5rem)] flex justify-center md:bottom-[calc(30%-5.25rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ x: locale === "ar" ? 260 : -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: locale === "ar" ? -320 : 320, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(88vw,600px)] md:translate-x-[22%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
          >
            <CarArt body={s.car.body} color={s.car.color} spin={!reduce} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_11_20/0.75)_0%,rgb(7_11_20/0.15)_35%,rgb(7_11_20/0.05)_60%,rgb(7_11_20/0.65)_100%)]" />

      <div className="absolute bottom-5 end-5 z-10 flex items-center gap-3 text-xs font-medium text-white/80">
        <span aria-live="polite">{s.label[locale]}</span>
        <div className="flex gap-1.5" role="tablist" aria-label={locale === "ar" ? "المشاهد" : "Scenes"}>
          {SCENES.map((x, j) => (
            <button key={x.id} role="tab" aria-selected={i === j} aria-label={x.label[locale]} onClick={() => setI(j)} className={`h-1.5 rounded-full transition-all ${i === j ? "w-8 bg-ember" : "w-3 bg-white/40 hover:bg-white/70"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

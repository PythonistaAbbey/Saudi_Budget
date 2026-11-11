"use client";

import clsx from "clsx";
import { KSA_PATH, MAP_H, MAP_SCALE, MAP_TRANSLATE, MAP_W, NEIGHBOURS_PATH } from "@/data/ksa-map";
import { branches, cities, type City } from "@/data/branches";
import { useI18n } from "@/i18n/client";

export function project(lon: number, lat: number): [number, number] {
  const l = (lon * Math.PI) / 180;
  const p = (lat * Math.PI) / 180;
  const r = (n: number) => Math.round(n * 10) / 10;
  return [r(MAP_SCALE * l + MAP_TRANSLATE[0]), r(-MAP_SCALE * Math.log(Math.tan(Math.PI / 4 + p / 2)) + MAP_TRANSLATE[1])];
}

export function SaudiMap({
  selected,
  onSelect,
  highlight,
  className,
  dark = true,
}: {
  selected?: string;
  onSelect?: (id: string) => void;
  highlight?: (c: City) => boolean;
  className?: string;
  dark?: boolean;
}) {
  const { locale } = useI18n();
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className={clsx("h-auto w-full", className)} role="group" aria-label={locale === "ar" ? "خريطة المملكة العربية السعودية" : "Map of Saudi Arabia"}>
      <defs>
        <linearGradient id="ksa-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={dark ? "#16325c" : "#f2ece2"} />
          <stop offset="1" stopColor={dark ? "#0e2240" : "#e3d6c1"} />
        </linearGradient>
        <radialGradient id="pin-glow">
          <stop offset="0" stopColor="#f47b20" stopOpacity="0.6" />
          <stop offset="1" stopColor="#f47b20" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={NEIGHBOURS_PATH} fill={dark ? "#0b1424" : "#eef0f3"} stroke={dark ? "#1b2a44" : "#d5dae2"} strokeWidth="1" />
      <path d={KSA_PATH} fill="url(#ksa-fill)" stroke={dark ? "#3a5a8a" : "#c9a77b"} strokeWidth="1.6" />
      {cities.map((c) => {
        const [x, y] = project(c.lon, c.lat);
        const count = branches.filter((b) => b.city === c.id).length;
        const isSel = selected === c.id;
        const hi = highlight ? highlight(c) : true;
        const r = count ? 7 + Math.min(count, 13) * 0.6 : 5;
        const name = locale === "ar" ? c.nameAr : c.name;
        return (
          <g
            key={c.id}
            transform={`translate(${x} ${y})`}
            className={clsx(onSelect && "cursor-pointer", !hi && "opacity-25")}
            onClick={() => onSelect?.(c.id)}
            onKeyDown={(e) => {
              if (onSelect && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelect(c.id);
              }
            }}
            tabIndex={onSelect ? 0 : -1}
            role={onSelect ? "button" : undefined}
            aria-pressed={onSelect ? isSel : undefined}
            aria-label={onSelect ? name : undefined}
            data-testid={`map-pin-${c.id}`}
          >
            {(isSel || count > 0) && <circle r={r * 3} fill="url(#pin-glow)" />}
            <circle r={isSel ? r + 3 : r} fill={count ? "#f47b20" : dark ? "#9fb3cf" : "#5b6576"} stroke={dark ? "#070b14" : "#fff"} strokeWidth="2.5" />
            {(count > 0 || isSel) && (
              <text y={-r - 9} textAnchor="middle" className="select-none" fontSize="22" fontWeight="600" fill={dark ? "#fff" : "#070b14"} style={{ paintOrder: "stroke", stroke: dark ? "#070b14" : "#fff", strokeWidth: 5 }}>
                {name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

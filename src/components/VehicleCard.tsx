"use client";

import clsx from "clsx";
import { Users, Briefcase, Cog, Fuel as FuelIcon, Heart, GitCompareArrows, Star } from "lucide-react";
import { useI18n } from "@/i18n/client";
import type { Vehicle } from "@/data/vehicles";
import { useStore } from "@/lib/store";
import { CarArt } from "./CarArt";
import { L, btn } from "./ui";

const bg: Record<string, string> = {
  economy: "from-slate-100 to-slate-200",
  compact: "from-sky-50 to-slate-200",
  sedan: "from-stone to-mist",
  suv: "from-[#efe7da] to-[#dccdb4]",
  family: "from-[#eaf0f4] to-[#cfd9e2]",
  luxury: "from-[#1a2233] to-[#0b1020]",
  pickup: "from-[#efe9df] to-[#d7c9b0]",
  electric: "from-[#e4f4f3] to-[#c3e3e2]",
};

export function VehicleCard({ v, query, days }: { v: Vehicle; query?: string; days?: number }) {
  const { t, money, num } = useI18n();
  const { compare, toggleCompare, saved, toggleSaved } = useStore();
  const inCompare = compare.includes(v.id);
  const isSaved = saved.includes(v.id);
  const detailHref = `/vehicles/${v.id}${query ? `?${query}` : ""}`;
  const dark = v.category === "luxury";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift" data-testid="vehicle-card" data-vehicle={v.id}>
      <div className={clsx("relative bg-gradient-to-br px-5 pb-2 pt-10", bg[v.category])}>
        <span className={clsx("absolute start-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", dark ? "bg-white/10 text-white" : "bg-white/80 text-ink")}>{t.cat[v.category]}</span>
        <button type="button" onClick={() => toggleSaved(v.id)} aria-pressed={isSaved} aria-label={`${isSaved ? t.v.saved : t.v.save}: ${v.model}`} className={clsx("absolute end-3 top-3 rounded-full p-2 transition", dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-white")}>
          <Heart className={clsx("size-4", isSaved && "fill-ember text-ember")} />
        </button>
        <L href={detailHref} aria-label={`${t.v.details}: ${v.model}`}>
          <CarArt body={v.body} color={v.color} className="mx-auto w-full max-w-[300px] transition duration-500 group-hover:scale-[1.04]" label={v.model} />
        </L>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              <L href={detailHref} className="hover:text-ember-ink">
                {v.model}
              </L>
            </h3>
            <p className="text-xs text-slate">
              {t.v.orSimilar} · {num(v.year)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {num(v.rating)}
          </span>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-y-2 text-[13px] text-slate">
          <li className="flex items-center gap-1.5">
            <Users className="size-4" aria-hidden /> {num(v.seats)} {t.v.seats}
          </li>
          <li className="flex items-center gap-1.5">
            <Briefcase className="size-4" aria-hidden /> {num(v.bags)} {t.v.bags}
          </li>
          <li className="flex items-center gap-1.5">
            <Cog className="size-4" aria-hidden /> {t.trans[v.transmission]}
          </li>
          <li className="flex items-center gap-1.5">
            <FuelIcon className="size-4" aria-hidden /> {t.fuel[v.fuel]}
          </li>
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">{t.price.simulated}</div>
            <div className="text-2xl font-semibold tracking-tight" data-testid="vehicle-price">
              {money(v.dailyRate)}
              <span className="text-sm font-medium text-slate"> {t.v.perDay}</span>
            </div>
            {days ? <div className="text-xs text-slate">≈ {money(v.dailyRate * days)} · {num(days)} {t.search.days}</div> : null}
          </div>
          <button type="button" onClick={() => toggleCompare(v.id)} aria-pressed={inCompare} className={clsx("inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ring-1 transition", inCompare ? "bg-ink text-white ring-ink" : "ring-ink/15 hover:ring-ink/40")} data-testid="compare-toggle">
            <GitCompareArrows className="size-3.5" aria-hidden />
            {inCompare ? t.v.comparing : t.v.compare}
          </button>
        </div>
        <L href={query ? `/booking?${query}&vehicle=${v.id}` : detailHref} className={clsx(btn.dark, "mt-4 w-full")} data-testid="select-vehicle">
          {query ? t.v.select : t.v.details}
        </L>
      </div>
    </article>
  );
}

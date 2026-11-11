"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { MapPin, CalendarDays, Clock, Search, ArrowRightLeft, UserRound, Car } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { cities, branchesForCity } from "@/data/branches";
import { categories } from "@/data/vehicles";
import { combine, defaultTrip, TIMES, validateTrip, toDateInput } from "@/lib/dates";
import { rentalDays } from "@/lib/pricing";
import { btn } from "./ui";

export interface Trip {
  city: string;
  pb: string;
  rcity: string;
  rb: string;
  pd: string;
  pt: string;
  rd: string;
  rt: string;
  age: "25" | "21";
  cat: string;
}

export function tripFromParams(p: URLSearchParams | { get(k: string): string | null }): Trip {
  const d = defaultTrip();
  const city = p.get("city") || "riyadh";
  const pb = p.get("pb") || branchesForCity(city)[0].id;
  const rcity = p.get("rcity") || city;
  return {
    city,
    pb,
    rcity,
    rb: p.get("rb") || (rcity === city ? pb : branchesForCity(rcity)[0].id),
    pd: p.get("pd") || d.pd,
    pt: p.get("pt") || d.pt,
    rd: p.get("rd") || d.rd,
    rt: p.get("rt") || d.rt,
    age: (p.get("age") as Trip["age"]) || "25",
    cat: p.get("cat") || "",
  };
}

export function tripToQuery(t: Trip, extra: Record<string, string> = {}) {
  const q = new URLSearchParams({ city: t.city, pb: t.pb, rcity: t.rcity, rb: t.rb, pd: t.pd, pt: t.pt, rd: t.rd, rt: t.rt, age: t.age });
  if (t.cat) q.set("cat", t.cat);
  for (const [k, v] of Object.entries(extra)) q.set(k, v);
  return q.toString();
}

export function SearchWidget({ variant = "hero", onSearch }: { variant?: "hero" | "panel"; onSearch?: (t: Trip) => void }) {
  const { t, locale, href, tx, num } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const [trip, setTrip] = useState<Trip>(() => tripFromParams(params));
  const [same, setSame] = useState(trip.rcity === trip.city && trip.rb === trip.pb);
  const [touched, setTouched] = useState(false);
  const [minDate, setMinDate] = useState<string>("");

  useEffect(() => setMinDate(toDateInput(new Date())), []);

  const set = (patch: Partial<Trip>) => setTrip((x) => ({ ...x, ...patch }));

  const pickup = combine(trip.pd, trip.pt);
  const ret = combine(trip.rd, trip.rt);
  const err = validateTrip(pickup, ret);
  const days = err ? 0 : rentalDays(pickup, ret);

  const pBranches = useMemo(() => branchesForCity(trip.city), [trip.city]);
  const rBranches = useMemo(() => branchesForCity(trip.rcity), [trip.rcity]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (err) return;
    const final = same ? { ...trip, rcity: trip.city, rb: trip.pb } : trip;
    if (onSearch) onSearch(final);
    else router.push(href(`/find-a-car?${tripToQuery(final)}`));
  }

  const dark = variant === "hero";
  const fieldWrap = clsx("group relative rounded-2xl px-4 pb-2.5 pt-2 transition", dark ? "bg-white/95 text-ink hover:bg-white" : "bg-stone hover:bg-mist");
  const lbl = "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate";
  const ctl = "mt-0.5 min-w-0 appearance-none bg-transparent text-[15px] font-semibold text-ink outline-none";

  const cityName = (id: string) => {
    const c = cities.find((x) => x.id === id);
    return c ? (locale === "ar" ? c.nameAr : c.name) : id;
  };
  const branchName = (b: { name: string; nameAr?: string }) => (locale === "ar" ? b.nameAr ?? b.name : b.name);

  return (
    <form onSubmit={submit} aria-label={t.search.find} className={clsx("w-full", dark ? "glass rounded-[28px] p-3 shadow-lift" : "rounded-3xl border border-ink/8 bg-white p-3 shadow-soft")} data-testid="search-widget" noValidate>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.05fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_auto]">
        <div className={fieldWrap}>
          <label className={lbl} htmlFor={`${variant}-pcity`}>
            <MapPin className="size-3.5 text-ember" aria-hidden /> {t.search.pickup}
          </label>
          <div className="flex gap-2">
            <select id={`${variant}-pcity`} aria-label={`${t.search.pickup} – ${t.search.city}`} className={clsx(ctl, "w-[44%] shrink-0")} value={trip.city} onChange={(e) => {
              const c = e.target.value;
              const b = branchesForCity(c)[0].id;
              set({ city: c, pb: b, ...(same ? { rcity: c, rb: b } : {}) });
            }} data-testid="pickup-city">
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {cityName(c.id)}
                </option>
              ))}
            </select>
            <select aria-label={`${t.search.pickup} – ${t.search.branch}`} className={clsx(ctl, "flex-1 truncate text-sm font-medium text-slate")} value={trip.pb} onChange={(e) => set({ pb: e.target.value, ...(same ? { rb: e.target.value } : {}) })} data-testid="pickup-branch">
              {pBranches.map((b) => (
                <option key={b.id} value={b.id}>
                  {branchName(b)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={clsx(fieldWrap, same && "opacity-90")}>
          <div className="flex items-center justify-between">
            <label className={lbl} htmlFor={`${variant}-rcity`}>
              <ArrowRightLeft className="size-3.5 text-ember" aria-hidden /> {t.search.return}
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate">
              <input type="checkbox" className="accent-ember" checked={same} onChange={(e) => {
                setSame(e.target.checked);
                if (e.target.checked) set({ rcity: trip.city, rb: trip.pb });
              }} data-testid="same-return" />
              {t.search.sameReturn}
            </label>
          </div>
          <div className="flex gap-2">
            <select id={`${variant}-rcity`} disabled={same} aria-label={`${t.search.return} – ${t.search.city}`} className={clsx(ctl, "w-[44%] shrink-0 disabled:opacity-60")} value={same ? trip.city : trip.rcity} onChange={(e) => set({ rcity: e.target.value, rb: branchesForCity(e.target.value)[0].id })} data-testid="return-city">
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {cityName(c.id)}
                </option>
              ))}
            </select>
            <select disabled={same} aria-label={`${t.search.return} – ${t.search.branch}`} className={clsx(ctl, "flex-1 truncate text-sm font-medium text-slate disabled:opacity-60")} value={same ? trip.pb : trip.rb} onChange={(e) => set({ rb: e.target.value })}>
              {(same ? pBranches : rBranches).map((b) => (
                <option key={b.id} value={b.id}>
                  {branchName(b)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={fieldWrap}>
          <label className={lbl} htmlFor={`${variant}-pd`}>
            <CalendarDays className="size-3.5 text-ember" aria-hidden /> {t.search.pickupDate}
          </label>
          <div className="flex items-center gap-1">
            <input id={`${variant}-pd`} type="date" min={minDate || undefined} className={clsx(ctl, "min-w-0 flex-1")} value={trip.pd} onChange={(e) => {
              const pd = e.target.value;
              const patch: Partial<Trip> = { pd };
              if (pd && trip.rd <= pd) {
                const r = combine(pd, "10:00");
                r.setDate(r.getDate() + 3);
                patch.rd = toDateInput(r);
              }
              set(patch);
            }} data-testid="pickup-date" suppressHydrationWarning />
            <Clock className="size-3.5 shrink-0 text-slate" aria-hidden />
            <select aria-label={t.search.pickupTime} className={clsx(ctl, "w-[4.6rem] shrink-0")} value={trip.pt} onChange={(e) => set({ pt: e.target.value })} data-testid="pickup-time">
              {TIMES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={fieldWrap}>
          <label className={lbl} htmlFor={`${variant}-rd`}>
            <CalendarDays className="size-3.5 text-ember" aria-hidden /> {t.search.returnDate}
          </label>
          <div className="flex items-center gap-1">
            <input id={`${variant}-rd`} type="date" min={trip.pd} className={clsx(ctl, "min-w-0 flex-1")} value={trip.rd} onChange={(e) => set({ rd: e.target.value })} data-testid="return-date" aria-invalid={touched && !!err} aria-describedby={err ? `${variant}-err` : undefined} suppressHydrationWarning />
            <Clock className="size-3.5 shrink-0 text-slate" aria-hidden />
            <select aria-label={t.search.returnTime} className={clsx(ctl, "w-[4.6rem] shrink-0")} value={trip.rt} onChange={(e) => set({ rt: e.target.value })} data-testid="return-time">
              {TIMES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={clsx(btn.primary, "h-full min-h-14 rounded-2xl px-7 text-base md:col-span-2 lg:col-span-1")} data-testid="find-cars">
          <Search className="size-5" aria-hidden />
          {t.search.find}
        </button>
      </div>

      <div className={clsx("mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 px-2 pb-1 pt-1 text-sm", dark ? "text-white/85" : "text-slate")}>
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">{t.search.age}</legend>
          <UserRound className="size-4" aria-hidden />
          <span className="font-medium">{t.search.age}</span>
          {(["25", "21"] as const).map((a) => (
            <label key={a} className={clsx("cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ring-1 transition", trip.age === a ? "bg-ember text-white ring-ember" : dark ? "ring-white/30 hover:ring-white/60" : "ring-ink/15 hover:ring-ink/40")}>
              <input type="radio" name={`${variant}-age`} value={a} checked={trip.age === a} onChange={() => set({ age: a })} className="sr-only" />
              {a === "25" ? t.search.age25 : t.search.age21}
            </label>
          ))}
        </fieldset>
        <label className="flex items-center gap-2">
          <Car className="size-4" aria-hidden />
          <span className="font-medium">{t.search.category}</span>
          <select className={clsx("rounded-full px-3 py-1 text-xs font-semibold ring-1", dark ? "bg-white/10 text-white ring-white/30 [&>option]:text-ink" : "bg-white ring-ink/15")} value={trip.cat} onChange={(e) => set({ cat: e.target.value })} data-testid="category-select">
            <option value="">{t.search.any}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {t.cat[c]}
              </option>
            ))}
          </select>
        </label>
        <span className="ms-auto text-xs font-medium" aria-live="polite">
          {err && touched ? (
            <span id={`${variant}-err`} className={clsx("rounded-full px-3 py-1", dark ? "bg-bad/90 text-white" : "bg-rose-50 text-bad")} data-testid="trip-error">
              {t.search[err]}
            </span>
          ) : days ? (
            <span>
              {num(days)} {days === 1 ? t.search.day : t.search.days} · {tx({ en: "Free cancellation in this demo", ar: "إلغاء مجاني في هذا العرض" })}
            </span>
          ) : err ? (
            <span id={`${variant}-err`} className={clsx(dark ? "text-white" : "text-bad")} data-testid="trip-error">
              {t.search[err]}
            </span>
          ) : null}
        </span>
      </div>
    </form>
  );
}

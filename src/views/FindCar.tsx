"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { SlidersHorizontal, X, FlaskConical, MapPin, CalendarDays } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { SearchWidget, tripFromParams, tripToQuery } from "@/components/SearchWidget";
import { VehicleCard } from "@/components/VehicleCard";
import { allFeatures, categories, type Category, type Fuel } from "@/data/vehicles";
import { filtersFromParams, searchVehicles, type Sort } from "@/lib/search";
import { combine, validateTrip } from "@/lib/dates";
import { rentalDays } from "@/lib/pricing";
import { findBranch, findCity } from "@/data/branches";
import { btn } from "@/components/ui";

const FUELS: Fuel[] = ["petrol", "hybrid", "electric", "diesel"];
const PRICE_MAX = 1200;

export function FindCarView() {
  const { t, tx, num, money, locale, dateTime } = useI18n();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  const trip = tripFromParams(params);
  const f = filtersFromParams(params);
  // the hero's category picker passes `cat` — treat it as a filter
  const hasTrip = params.has("pd");
  const pickup = combine(trip.pd, trip.pt);
  const ret = combine(trip.rd, trip.rt);
  const tripErr = validateTrip(pickup, ret);
  const days = tripErr ? 0 : rentalDays(pickup, ret);

  const results = useMemo(() => searchVehicles({ ...f, city: hasTrip ? trip.city : undefined }), [params.toString()]); // eslint-disable-line react-hooks/exhaustive-deps

  function setParam(k: string, v: string | undefined) {
    const q = new URLSearchParams(params.toString());
    if (v === undefined || v === "" || v === "any") q.delete(k);
    else q.set(k, v);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  }
  const toggleList = (k: string, val: string) => {
    const cur = (params.get(k) ?? "").split(",").filter(Boolean);
    const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
    setParam(k, next.join(","));
  };
  const reset = () => {
    const keep = new URLSearchParams();
    for (const k of ["city", "pb", "rcity", "rb", "pd", "pt", "rd", "rt", "age"]) if (params.get(k)) keep.set(k, params.get(k)!);
    router.replace(`${pathname}?${keep.toString()}`, { scroll: false });
  };

  const query = hasTrip && !tripErr ? tripToQuery(trip) : "";
  const activeCount = (f.categories?.length ?? 0) + (f.fuels?.length ?? 0) + (f.features?.length ?? 0) + (f.minSeats ? 1 : 0) + (f.minBags ? 1 : 0) + (f.transmission && f.transmission !== "any" ? 1 : 0) + (f.maxPrice ? 1 : 0);

  const pb = findBranch(trip.pb);
  const city = findCity(trip.city);

  const Filters = (
    <div className="space-y-7" data-testid="filters">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t.search.category}</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const on = f.categories?.includes(c as Category);
            return (
              <button key={c} type="button" aria-pressed={!!on} onClick={() => toggleList("cat", c)} className={clsx("rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition", on ? "bg-ink text-white ring-ink" : "bg-white ring-ink/15 hover:ring-ink/40")} data-testid={`filter-cat-${c}`}>
                {t.cat[c]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="label">{tx({ en: "Passengers (min)", ar: "الركاب (حد أدنى)" })}</span>
          <select className="field" value={f.minSeats ?? ""} onChange={(e) => setParam("seats", e.target.value)} data-testid="filter-seats">
            <option value="">{t.search.any}</option>
            {[2, 4, 5, 7, 8, 9].map((n) => (
              <option key={n} value={n}>
                {num(n)}+
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">{tx({ en: "Large bags (min)", ar: "حقائب كبيرة (حد أدنى)" })}</span>
          <select className="field" value={f.minBags ?? ""} onChange={(e) => setParam("bags", e.target.value)} data-testid="filter-bags">
            <option value="">{t.search.any}</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {num(n)}+
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t.v.transmission}</legend>
        <div className="grid grid-cols-3 gap-1 rounded-full bg-mist p-1">
          {(["any", "automatic", "manual"] as const).map((x) => (
            <label key={x} className={clsx("cursor-pointer rounded-full py-1.5 text-center text-xs font-semibold transition", (f.transmission ?? "any") === x ? "bg-white shadow-soft" : "text-slate")}>
              <input type="radio" className="sr-only" name="trans" checked={(f.transmission ?? "any") === x} onChange={() => setParam("trans", x)} data-testid={`filter-trans-${x}`} />
              {t.trans[x]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t.v.fuel}</legend>
        <div className="grid grid-cols-2 gap-2">
          {FUELS.map((x) => (
            <label key={x} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" className="size-4 accent-ember" checked={!!f.fuels?.includes(x)} onChange={() => toggleList("fuel", x)} data-testid={`filter-fuel-${x}`} />
              {t.fuel[x]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="mb-2 flex items-center justify-between text-sm font-semibold" htmlFor="maxprice">
          {tx({ en: "Max daily price", ar: "أقصى سعر يومي" })}
          <span className="text-xs font-medium text-slate">{f.maxPrice ? money(f.maxPrice) : t.search.any}</span>
        </label>
        <input id="maxprice" type="range" min={100} max={PRICE_MAX} step={25} value={f.maxPrice ?? PRICE_MAX} onChange={(e) => setParam("max", Number(e.target.value) >= PRICE_MAX ? undefined : e.target.value)} className="w-full accent-ember" data-testid="filter-max-price" />
        <div className="flex justify-between text-[11px] text-slate">
          <span>{money(100)}</span>
          <span>{money(PRICE_MAX)}+</span>
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t.v.features}</legend>
        <div className="max-h-56 space-y-2 overflow-y-auto pe-1">
          {allFeatures.map((x) => (
            <label key={x} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" className="size-4 accent-ember" checked={!!f.features?.includes(x)} onChange={() => toggleList("feat", x)} />
              {x}
            </label>
          ))}
        </div>
      </fieldset>

      <button type="button" onClick={reset} className={clsx(btn.ghost, "w-full")} data-testid="reset-filters">
        {t.common.reset}
      </button>
    </div>
  );

  return (
    <div className="bg-stone">
      <div className="bg-ink px-4 pb-24 pt-10 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{tx({ en: "Find your car", ar: "اعثر على سيارتك" })}</h1>
          <p className="mt-2 text-white/60">{tx({ en: "Simulated availability across a realistic mock inventory.", ar: "توفر محاكى عبر مخزون تجريبي واقعي." })}</p>
        </div>
      </div>
      <div className="mx-auto -mt-16 max-w-7xl px-4 sm:px-6">
        <SearchWidget
          variant="panel"
          key={params.toString()}
          onSearch={(trp) => {
            const q = new URLSearchParams(params.toString());
            const tq = new URLSearchParams(tripToQuery(trp));
            tq.forEach((v, k) => q.set(k, v));
            if (!trp.cat) q.delete("cat");
            router.push(`${pathname}?${q.toString()}`, { scroll: false });
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold">
              <SlidersHorizontal className="size-4" aria-hidden /> {t.common.filters}
            </h2>
            {Filters}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="me-auto">
              <p className="text-lg font-semibold" aria-live="polite" data-testid="results-count">
                {num(results.length)} {t.common.results}
              </p>
              {hasTrip && !tripErr && (
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-slate">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden />
                    {locale === "ar" ? city?.nameAr : city?.name} · {locale === "ar" ? pb?.nameAr ?? pb?.name : pb?.name}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" aria-hidden />
                    {dateTime(pickup)} → {dateTime(ret)} · {num(days)} {days === 1 ? t.search.day : t.search.days}
                  </span>
                </p>
              )}
            </div>
            <button type="button" onClick={() => setDrawer(true)} className={clsx(btn.ghost, "lg:hidden")} data-testid="open-filters">
              <SlidersHorizontal className="size-4" aria-hidden /> {t.common.filters}
              {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-ember text-[10px] text-white">{activeCount}</span>}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-slate">{t.common.sort}</span>
              <select className="field !w-auto !py-2" value={f.sort ?? "recommended"} onChange={(e) => setParam("sort", e.target.value === "recommended" ? undefined : (e.target.value as Sort))} data-testid="sort">
                <option value="recommended">{tx({ en: "Recommended", ar: "الموصى بها" })}</option>
                <option value="priceAsc">{tx({ en: "Price: low to high", ar: "السعر: من الأقل" })}</option>
                <option value="priceDesc">{tx({ en: "Price: high to low", ar: "السعر: من الأعلى" })}</option>
                <option value="seats">{tx({ en: "Most seats", ar: "الأكثر مقاعد" })}</option>
                <option value="rating">{tx({ en: "Top rated", ar: "الأعلى تقييمًا" })}</option>
              </select>
            </label>
          </div>

          <div className="mb-6 flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950 ring-1 ring-amber-200">
            <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              {t.price.simulatedLong} {!hasTrip && tx({ en: "Choose dates above to see trip totals and book.", ar: "اختر التواريخ في الأعلى لعرض إجمالي الرحلة والحجز." })}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-soft" data-testid="no-results">
              <p className="text-lg font-semibold">{t.common.noResults}</p>
              <button onClick={reset} className={clsx(btn.dark, "mt-5")}>
                {t.common.reset}
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" data-testid="results">
              {results.map((v) => (
                <VehicleCard key={v.id} v={v} query={query} days={days || undefined} />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div role="dialog" aria-modal="true" aria-label={t.common.filters} className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <button className="flex-1 bg-ink/50" aria-label={t.close} onClick={() => setDrawer(false)} />
          <div className="h-full w-[min(380px,92vw)] overflow-y-auto bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t.common.filters}</h2>
              <button onClick={() => setDrawer(false)} className="rounded-full p-2 hover:bg-mist" aria-label={t.close} autoFocus>
                <X className="size-5" />
              </button>
            </div>
            {Filters}
            <button onClick={() => setDrawer(false)} className={clsx(btn.primary, "mt-4 w-full")}>
              {tx({ en: `Show ${results.length} results`, ar: `عرض ${num(results.length)} نتيجة` })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

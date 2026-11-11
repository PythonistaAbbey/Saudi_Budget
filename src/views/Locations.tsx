"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Building, Clock, List, Map as MapIcon, MapPin, Navigation, Phone, Plane, Search, TrainFront, Truck } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { branches, cities, type BranchKind } from "@/data/branches";
import { SaudiMap } from "@/components/SaudiMap";
import { Badge, L, SourceLink, btn } from "@/components/ui";
import { company, contact, SOURCES } from "@/content/verified";

const KIND_ICON: Record<BranchKind, typeof Plane> = { airport: Plane, city: Building, rail: TrainFront, delivery: Truck };

export function LocationsView() {
  const { tx, locale, num } = useI18n();
  const [city, setCity] = useState<string>("riyadh");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<BranchKind | "all">("all");
  const [view, setView] = useState<"map" | "list">("map");

  const kindLabel: Record<BranchKind | "all", string> = {
    all: tx({ en: "All", ar: "الكل" }),
    airport: tx({ en: "Airport", ar: "مطار" }),
    city: tx({ en: "City", ar: "مدينة" }),
    rail: tx({ en: "Rail station", ar: "محطة قطار" }),
    delivery: tx({ en: "At your door", ar: "توصيل للباب" }),
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return branches.filter((b) => {
      if (kind !== "all" && b.kind !== kind) return false;
      if (s) {
        const c = cities.find((x) => x.id === b.city);
        return [b.name, b.nameAr ?? "", b.address, c?.name ?? "", c?.nameAr ?? ""].some((x) => x.toLowerCase().includes(s));
      }
      return city === "all" || b.city === city;
    });
  }, [q, kind, city]);

  const selectedCity = cities.find((c) => c.id === city);
  const cityName = (id: string) => {
    const c = cities.find((x) => x.id === id);
    return c ? (locale === "ar" ? c.nameAr : c.name) : id;
  };

  return (
    <div className="bg-stone">
      <header className="bg-ink px-4 pb-10 pt-12 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{tx({ en: "Branch locator", ar: "محدد الفروع" })}</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            {tx({
              en: `Published network: ${company.rentalOffices.value} rental offices, ${company.airportOffices.value} airport offices. Branch-level details below come from the public Budget location directory.`,
              ar: `الشبكة المنشورة: أكثر من ١٢٠ مكتب تأجير وأكثر من ٢٠ مكتبًا في المطارات في ١٧ مدينة. التفاصيل على مستوى الفروع أدناه مأخوذة من دليل مواقع بدجت العام.`,
            })}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge kind="verified" className="!bg-white/10 !text-white !ring-white/20" />
            <SourceLink href={SOURCES.globalLocations} className="!text-white/60" />
            <SourceLink href={SOURCES.about} className="!text-white/60" />
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-20 border-b border-ink/8 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <label className="relative min-w-56 flex-1">
            <span className="sr-only">{tx({ en: "Search branches", ar: "ابحث في الفروع" })}</span>
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx({ en: "Search by name, district or city", ar: "ابحث بالاسم أو الحي أو المدينة" })} className="field !ps-9" data-testid="branch-search" />
          </label>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="field !w-auto" aria-label={tx({ en: "City", ar: "المدينة" })} data-testid="branch-city">
            <option value="all">{tx({ en: "All cities", ar: "كل المدن" })}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {locale === "ar" ? c.nameAr : c.name}
              </option>
            ))}
          </select>
          <div className="flex gap-1 rounded-full bg-mist p-1" role="group" aria-label={tx({ en: "Branch type", ar: "نوع الفرع" })}>
            {(["all", "airport", "city", "rail", "delivery"] as const).map((k) => (
              <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)} className={clsx("rounded-full px-3 py-1.5 text-xs font-semibold", kind === k ? "bg-white shadow-soft" : "text-slate")}>
                {kindLabel[k]}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-full bg-ink p-1 text-white" role="group" aria-label={tx({ en: "View", ar: "العرض" })}>
            <button aria-pressed={view === "map"} onClick={() => setView("map")} className={clsx("rounded-full p-2", view === "map" && "bg-white/20")} aria-label={tx({ en: "Map view", ar: "عرض الخريطة" })} data-testid="view-map">
              <MapIcon className="size-4" />
            </button>
            <button aria-pressed={view === "list"} onClick={() => setView("list")} className={clsx("rounded-full p-2", view === "list" && "bg-white/20")} aria-label={tx({ en: "List view", ar: "عرض القائمة" })} data-testid="view-list">
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={clsx("mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6", view === "map" && "lg:grid-cols-[1.2fr_1fr]")}>
        {view === "map" && (
          <div className="rounded-3xl bg-ink p-4 lg:sticky lg:top-36 lg:self-start">
            <SaudiMap selected={city} onSelect={(id) => { setCity(id); setQ(""); }} />
            <p className="px-2 pb-1 text-center text-xs text-white/50">{tx({ en: "Pins mark city locations, not exact branch addresses. Orange = branch details published; grey = city presence only.", ar: "الدبابيس تشير إلى المدن وليس إلى عناوين الفروع الدقيقة. البرتقالي = تفاصيل الفروع منشورة؛ الرمادي = وجود في المدينة فقط." })}</p>
          </div>
        )}
        <div>
          <p className="mb-3 text-sm font-semibold" aria-live="polite" data-testid="branch-count">
            {num(filtered.length)} {tx({ en: "branches", ar: "فرعًا" })}
            {!q && city !== "all" && selectedCity ? ` · ${cityName(city)}` : ""}
          </p>
          {filtered.length === 0 && selectedCity?.presenceOnly && !q ? (
            <div className="rounded-3xl bg-white p-6 shadow-soft" data-testid="presence-only">
              <h2 className="text-lg font-semibold">{cityName(city)}</h2>
              <p className="mt-2 text-sm text-slate">
                {tx({
                  en: "The public directory lists Budget presence in this city, but branch-level addresses and hours were not captured for this prototype. Rather than invent them, please call reservations.",
                  ar: "يذكر الدليل العام وجود بدجت في هذه المدينة، لكن لم تُجمع عناوين الفروع وساعات العمل لهذا النموذج. بدل اختلاقها، يرجى الاتصال بالحجوزات.",
                })}
              </p>
              <a href={`tel:${contact.reservations.value}`} className={clsx(btn.dark, "mt-4")}>
                <Phone className="size-4" aria-hidden /> <span dir="ltr">{contact.reservations.value}</span>
              </a>
            </div>
          ) : (
            <ul className={clsx("grid gap-3", view === "list" && "md:grid-cols-2 xl:grid-cols-3")} data-testid="branch-list">
              {filtered.map((b) => {
                const Icon = KIND_ICON[b.kind];
                return (
                  <li key={b.id} className="rounded-2xl bg-white p-5 shadow-soft" data-testid="branch-item">
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-stone">
                        <Icon className="size-5 text-ember" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{locale === "ar" ? b.nameAr ?? b.name : b.name}</h3>
                          <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-slate">{kindLabel[b.kind]}</span>
                        </div>
                        <p className="mt-1 flex gap-1.5 text-sm text-slate">
                          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                          <span dir="ltr" className="text-start">
                            {b.address}
                          </span>
                        </p>
                        <p className="mt-1 flex gap-1.5 text-xs text-slate">
                          <Clock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                          {b.hours ?? tx({ en: "Opening hours not published in source — call to confirm", ar: "ساعات العمل غير منشورة في المصدر — اتصل للتأكيد" })}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Budget Rent a Car ${b.address}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
                            <Navigation className="size-3.5" aria-hidden /> {tx({ en: "Directions", ar: "الاتجاهات" })}
                          </a>
                          <a href={`tel:${b.phone ?? contact.reservations.value}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-ink/15">
                            <Phone className="size-3.5" aria-hidden /> <span dir="ltr">{b.phone ?? contact.reservations.value}</span>
                          </a>
                          <L href={`/find-a-car?city=${b.city}&pb=${b.id}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ember-ink ring-1 ring-ember/40">
                            {tx({ en: "Rent here", ar: "استأجر من هنا" })}
                          </L>
                        </div>
                        <SourceLink href={b.source} className="mt-2" />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

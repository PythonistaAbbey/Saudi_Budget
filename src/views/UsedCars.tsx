"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { BadgeCheck, CheckCircle2, ExternalLink, GitCompareArrows, Gauge, X, Calendar, Fuel } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { preOwned } from "@/content/verified";
import { vehicles } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";
import { Badge, Field, PageHero, Section, SourceLink, btn } from "@/components/ui";

interface UsedCar {
  id: string;
  model: string;
  brand: string;
  year: number;
  km: number;
  price: number;
  body: (typeof vehicles)[number]["body"];
  color: string;
  fuel: (typeof vehicles)[number]["fuel"];
  city: string;
  inspection: number;
}

/** SYNTHETIC listings derived from the mock rental fleet. */
const CITIES = ["Riyadh", "Jeddah", "Dammam"];
export const usedCars: UsedCar[] = vehicles
  .filter((v) => v.category !== "electric")
  .flatMap((v, i) =>
    [0, 1].map((k) => {
      const year = v.year - 2 - k - (i % 2);
      const km = 38000 + ((i * 7919 + k * 3571) % 90000);
      const base = v.dailyRate * 210;
      const price = Math.round((base * (1 - (v.year - year) * 0.11) - km * 0.12) / 500) * 500;
      return { id: `${v.id}-${year}-${k}`, model: v.model, brand: v.model.split(" ")[0] === "Mercedes-Benz" ? "Mercedes-Benz" : v.model.split(" ")[0], year, km, price: Math.max(price, 21000), body: v.body, color: k ? "#e9e7e2" : v.color, fuel: v.fuel, city: CITIES[(i + k) % 3], inspection: 92 + ((i + k) % 7) };
    }),
  );

const inq = z.object({ name: z.string().trim().min(2), phone: z.string().trim().regex(/^(05\d{8}|\+9665\d{8})$/), message: z.string().max(500).optional() });

export function UsedCarsView() {
  const { tx, t, money, num } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [brand, setBrand] = useState("all");
  const [minYear, setMinYear] = useState(0);
  const [maxKm, setMaxKm] = useState(200000);
  const [sort, setSort] = useState<"price" | "year" | "km">("price");
  const [cmp, setCmp] = useState<string[]>([]);
  const [showCmp, setShowCmp] = useState(false);
  const [sent, setSent] = useState(false);
  const open = usedCars.find((c) => c.id === params.get("car"));
  const form = useForm<z.infer<typeof inq>>({ resolver: zodResolver(inq), mode: "onTouched" });

  const brands = Array.from(new Set(usedCars.map((c) => c.brand))).sort();
  const years = Array.from(new Set(usedCars.map((c) => c.year))).sort();
  const list = useMemo(
    () =>
      usedCars
        .filter((c) => (brand === "all" || c.brand === brand) && c.year >= minYear && c.km <= maxKm)
        .sort((a, b) => (sort === "price" ? a.price - b.price : sort === "year" ? b.year - a.year : a.km - b.km)),
    [brand, minYear, maxKm, sort],
  );
  const setOpen = (id?: string) => {
    const q = new URLSearchParams(params.toString());
    if (id) q.set("car", id);
    else q.delete("car");
    setSent(false);
    form.reset();
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };
  const toggleCmp = (id: string) => setCmp((x) => (x.includes(id) ? x.filter((y) => y !== id) : x.length < 3 ? [...x, id] : x));

  return (
    <>
      <PageHero
        eyebrow={t.nav.used}
        title={tx({ en: "Pre-owned, thoroughly inspected.", ar: "سيارات مستعملة، مفحوصة بعناية." })}
        lead={tx({ en: "A concept marketplace for ex-fleet vehicles. The listings are synthetic; the inspection and ownership-transfer promises below are from the public page.", ar: "تصوّر لسوق سيارات الأسطول المستعملة. القوائم اصطناعية؛ أما وعود الفحص ونقل الملكية أدناه فمن الصفحة العامة." })}
        art={<CarArt body="suv" color="#f4f3ef" className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />}
      >
        <a href={preOwned.marketplace.value} target="_blank" rel="noopener noreferrer" className={btn.glass}>
          {tx({ en: "Official used-car site", ar: "موقع السيارات المستعملة الرسمي" })} <ExternalLink className="size-4" aria-hidden />
        </a>
      </PageHero>

      <div className="border-b border-ink/8 bg-white px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 text-sm">
          <BadgeCheck className="size-5 text-ok" aria-hidden />
          <span className="flex-1">{preOwned.pitch.value}</span>
          <SourceLink href={preOwned.pitch.source} />
        </div>
      </div>

      <Section>
        <div className="flex flex-wrap items-end gap-3 rounded-3xl bg-white p-4 shadow-soft">
          <label className="min-w-36 flex-1">
            <span className="label">{tx({ en: "Brand", ar: "العلامة" })}</span>
            <select className="field" value={brand} onChange={(e) => setBrand(e.target.value)} data-testid="used-brand">
              <option value="all">{t.search.any}</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="min-w-36 flex-1">
            <span className="label">{tx({ en: "Year from", ar: "السنة من" })}</span>
            <select className="field" value={minYear} onChange={(e) => setMinYear(Number(e.target.value))} data-testid="used-year">
              <option value={0}>{t.search.any}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-48 flex-[2]">
            <span className="label">
              {tx({ en: "Max mileage", ar: "أقصى عدد كيلومترات" })}: {num(maxKm)} km
            </span>
            <input type="range" min={40000} max={200000} step={10000} value={maxKm} onChange={(e) => setMaxKm(Number(e.target.value))} className="w-full accent-ember" data-testid="used-km" />
          </label>
          <label className="min-w-36">
            <span className="label">{t.common.sort}</span>
            <select className="field" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="price">{tx({ en: "Lowest price", ar: "الأقل سعرًا" })}</option>
              <option value="year">{tx({ en: "Newest", ar: "الأحدث" })}</option>
              <option value="km">{tx({ en: "Lowest mileage", ar: "الأقل مسافة" })}</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-semibold" data-testid="used-count">
            {num(list.length)} {t.common.results}
          </p>
          <Badge kind="simulated" />
        </div>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((c) => (
            <article key={c.id} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft" data-testid="used-card">
              <button onClick={() => setOpen(c.id)} className="bg-gradient-to-br from-stone to-mist p-4" aria-label={`${c.model} ${c.year}`}>
                <CarArt body={c.body} color={c.color} />
              </button>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold">
                  {c.model} <span className="text-slate">· {c.year}</span>
                </h3>
                <p className="mt-1 flex items-center gap-3 text-xs text-slate">
                  <span className="inline-flex items-center gap-1">
                    <Gauge className="size-3.5" aria-hidden />
                    {num(c.km)} km
                  </span>
                  <span>{c.city}</span>
                </p>
                <div className="mt-auto flex items-end justify-between pt-4">
                  <div className="text-xl font-semibold">{money(c.price)}</div>
                  <button onClick={() => toggleCmp(c.id)} aria-pressed={cmp.includes(c.id)} disabled={!cmp.includes(c.id) && cmp.length >= 3} className={clsx("inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 disabled:opacity-40", cmp.includes(c.id) ? "bg-ink text-white ring-ink" : "ring-ink/15")} data-testid="used-compare">
                    <GitCompareArrows className="size-3.5" aria-hidden /> {cmp.includes(c.id) ? t.v.comparing : t.v.compare}
                  </button>
                </div>
                <button onClick={() => setOpen(c.id)} className={clsx(btn.dark, "mt-3 !py-2")} data-testid="used-details">
                  {t.v.details}
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {cmp.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-20 sm:pb-4">
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-ink p-3 text-white shadow-lift">
            <span className="flex-1 ps-2 text-sm">{tx({ en: `${cmp.length} of 3 selected`, ar: `${num(cmp.length)} من ٣ مختارة` })}</span>
            <button onClick={() => setCmp([])} className="text-xs text-white/60">
              {tx({ en: "Clear", ar: "مسح" })}
            </button>
            <button onClick={() => setShowCmp(true)} disabled={cmp.length < 2} className={clsx(btn.primary, "!py-2")} data-testid="used-open-compare">
              {t.v.compare}
            </button>
          </div>
        </div>
      )}

      {showCmp && (
        <div role="dialog" aria-modal="true" aria-label={t.v.compare} className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-4" data-testid="used-compare-dialog">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">{t.v.compare}</h2>
              <button onClick={() => setShowCmp(false)} className="rounded-full p-2 hover:bg-mist" aria-label={t.close} autoFocus>
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[540px] text-sm">
                <tbody>
                  {(
                    [
                      ["", (c: UsedCar) => <CarArt body={c.body} color={c.color} className="w-40" />],
                      [tx({ en: "Model", ar: "الطراز" }), (c: UsedCar) => <strong>{c.model}</strong>],
                      [t.v.year, (c: UsedCar) => c.year],
                      [tx({ en: "Mileage", ar: "المسافة" }), (c: UsedCar) => `${num(c.km)} km`],
                      [t.v.fuel, (c: UsedCar) => t.fuel[c.fuel]],
                      [tx({ en: "Inspection score", ar: "نتيجة الفحص" }), (c: UsedCar) => `${c.inspection}/100`],
                      [tx({ en: "Price", ar: "السعر" }), (c: UsedCar) => <strong>{money(c.price)}</strong>],
                    ] as [string, (c: UsedCar) => React.ReactNode][]
                  ).map(([k, f], i) => (
                    <tr key={i} className="border-b border-ink/5">
                      <th className="w-36 py-3 text-start font-medium text-slate">{k}</th>
                      {cmp.map((id) => {
                        const c = usedCars.find((x) => x.id === id)!;
                        return (
                          <td key={id} className="py-3">
                            {f(c)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div role="dialog" aria-modal="true" aria-label={open.model} className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-4" data-testid="used-detail">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white">
            <div className="relative bg-gradient-to-br from-stone to-mist p-8">
              <button onClick={() => setOpen()} className="absolute end-4 top-4 rounded-full bg-white p-2" aria-label={t.close} autoFocus>
                <X className="size-5" />
              </button>
              <CarArt body={open.body} color={open.color} className="mx-auto max-w-md" />
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold">
                  {open.model} · {open.year}
                </h2>
                <p className="mt-1 text-2xl font-semibold text-ember-ink">{money(open.price)}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {[
                    [Calendar, t.v.year, open.year],
                    [Gauge, tx({ en: "Mileage", ar: "المسافة" }), `${num(open.km)} km`],
                    [Fuel, t.v.fuel, t.fuel[open.fuel]],
                    [BadgeCheck, tx({ en: "Inspection", ar: "الفحص" }), `${open.inspection}/100`],
                  ].map(([I, k, v], i) => {
                    const Icon = I as typeof Gauge;
                    return (
                      <div key={i} className="rounded-xl bg-stone p-3">
                        <Icon className="size-4 text-ember" aria-hidden />
                        <dt className="mt-1 text-xs text-slate">{k as string}</dt>
                        <dd className="font-semibold">{v as string}</dd>
                      </div>
                    );
                  })}
                </dl>
                <p className="mt-4 text-xs text-slate">{tx({ en: "Synthetic listing for demonstration. Real stock is listed on the official used-car marketplace.", ar: "قائمة اصطناعية للعرض. المخزون الفعلي مدرج في سوق السيارات المستعملة الرسمي." })}</p>
              </div>
              <div>
                <h3 className="font-semibold">{tx({ en: "Send an inquiry", ar: "أرسل استفسارًا" })}</h3>
                {sent ? (
                  <p className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-950" role="status" data-testid="used-sent">
                    <CheckCircle2 className="size-5 text-ok" aria-hidden /> {t.form.sentDemo}
                  </p>
                ) : (
                  <form noValidate onSubmit={form.handleSubmit(() => setSent(true))} className="mt-3 space-y-3" data-testid="used-form">
                    <Field id="u-name" label={t.form.name} error={form.formState.errors.name && t.form.required}>
                      <input id="u-name" className="field" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
                    </Field>
                    <Field id="u-phone" label={t.form.phone} error={form.formState.errors.phone && t.form.invalidPhone}>
                      <input id="u-phone" dir="ltr" className="field" {...form.register("phone")} aria-invalid={!!form.formState.errors.phone} />
                    </Field>
                    <Field id="u-msg" label={t.form.message}>
                      <textarea id="u-msg" rows={2} className="field" {...form.register("message")} />
                    </Field>
                    <button className={clsx(btn.primary, "w-full")} data-testid="used-submit">
                      {t.form.submit}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

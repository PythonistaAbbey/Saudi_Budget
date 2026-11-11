"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Briefcase, CheckCircle2, Clock, Crown, MapPin, Plane, Route, Users } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { chauffeur } from "@/content/verified";
import { cities } from "@/data/branches";
import { chauffeurEstimate } from "@/lib/pricing";
import { defaultTrip, TIMES, combine, validateTrip } from "@/lib/dates";
import { CarArt } from "@/components/CarArt";
import { Badge, PageHero, Section, SourceLink, btn } from "@/components/ui";
import { makeRef } from "@/lib/store";

type Cls = "business" | "first" | "van";
type Svc = "hourly" | "airport" | "intercity";

function roadKm(a: string, b: string) {
  const A = cities.find((c) => c.id === a)!;
  const B = cities.find((c) => c.id === b)!;
  const R = 6371;
  const dLat = ((B.lat - A.lat) * Math.PI) / 180;
  const dLon = ((B.lon - A.lon) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((A.lat * Math.PI) / 180) * Math.cos((B.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 1.2); // straight line × 1.2 road factor (estimate)
}

export function ChauffeurView() {
  const { tx, t, money, num, locale, dateTime } = useI18n();
  const [cls, setCls] = useState<Cls>("business");
  const [svc, setSvc] = useState<Svc>("hourly");
  const [from, setFrom] = useState("riyadh");
  const [to, setTo] = useState("alula");
  const [address, setAddress] = useState("");
  // Static pages are pre-rendered at build time, so "tomorrow" is set after mount, not baked into the HTML.
  const [d, setD] = useState("");
  useEffect(() => {
    setD((cur) => cur || defaultTrip().pd);
  }, []);
  const [time, setTime] = useState("09:00");
  const [hours, setHours] = useState(4);
  const [pax, setPax] = useState(2);
  const [ref, setRef] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const km = svc === "intercity" && from !== to ? roadKm(from, to) : 0;
  const effHours = svc === "airport" ? 3 : svc === "intercity" ? Math.max(3, Math.ceil(km / 100) + 1) : hours;
  const est = chauffeurEstimate({ cls, hours: effHours, intercityKm: km });
  const at = combine(d, time);
  const dateErr = d ? validateTrip(at, new Date(at.getTime() + 3600000)) : "errPast";
  const addrErr = address.trim().length < 3;
  const maxPax = cls === "van" ? 8 : 3;

  const classes: { id: Cls; name: string; body: "sedan" | "suv" | "van"; color: string; pax: number; bags: number; note: string }[] = [
    { id: "business", name: tx({ en: "Business", ar: "رجال الأعمال" }), body: "sedan", color: "#1d2433", pax: 3, bags: 2, note: tx({ en: "Camry-class or similar", ar: "فئة كامري أو ما يماثلها" }) },
    { id: "first", name: tx({ en: "First", ar: "الأولى" }), body: "sedan", color: "#0e0f12", pax: 3, bags: 2, note: tx({ en: "E-Class-class or similar", ar: "فئة الفئة E أو ما يماثلها" }) },
    { id: "van", name: tx({ en: "Family van", ar: "فان عائلي" }), body: "van", color: "#d6d9de", pax: 8, bags: 6, note: tx({ en: "Staria-class or similar", ar: "فئة ستاريا أو ما يماثلها" }) },
  ];
  const cn = (id: string) => {
    const c = cities.find((x) => x.id === id);
    return c ? (locale === "ar" ? c.nameAr : c.name) : id;
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (dateErr || addrErr || (svc === "intercity" && from === to)) return;
    setRef(makeRef().replace("DEMO", "CHF"));
  }

  return (
    <>
      <PageHero
        eyebrow={t.nav.chauffeur}
        title={tx({ en: "Sit back. We'll drive.", ar: "استرخِ. نحن نقود." })}
        lead={chauffeur.value}
        art={<CarArt body="sedan" color="#0e0f12" className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />}
      >
        <Badge kind="verified" className="!bg-white/10 !text-white !ring-white/20" />
        <SourceLink href={chauffeur.source} className="!text-white/60" />
      </PageHero>

      <Section>
        <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_380px]" data-testid="chauffeur-form">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold">{tx({ en: "1. Choose a class", ar: "١. اختر الفئة" })}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup">
                {classes.map((c) => (
                  <label key={c.id} className={clsx("cursor-pointer rounded-2xl border-2 p-4 transition", cls === c.id ? "border-ember" : "border-ink/10 hover:border-ink/30")} data-testid={`class-${c.id}`}>
                    <input type="radio" className="sr-only" name="cls" checked={cls === c.id} onChange={() => { setCls(c.id); setPax((p) => Math.min(p, c.pax)); }} />
                    <CarArt body={c.body} color={c.color} />
                    <div className="mt-2 flex items-center gap-1.5 font-semibold">
                      {c.id === "first" && <Crown className="size-4 text-ember" aria-hidden />} {c.name}
                    </div>
                    <div className="text-xs text-slate">{c.note}</div>
                    <div className="mt-2 flex gap-3 text-xs text-slate">
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5" aria-hidden />
                        {num(c.pax)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="size-3.5" aria-hidden />
                        {num(c.bags)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold">{tx({ en: "2. Trip details", ar: "٢. تفاصيل الرحلة" })}</h2>
              <div className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-mist p-1">
                {(
                  [
                    ["hourly", Clock, tx({ en: "By the hour", ar: "بالساعة" })],
                    ["airport", Plane, tx({ en: "Airport transfer", ar: "توصيل المطار" })],
                    ["intercity", Route, tx({ en: "Intercity", ar: "بين المدن" })],
                  ] as const
                ).map(([k, Icon, label]) => (
                  <label key={k} className={clsx("flex cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold sm:text-sm", svc === k ? "bg-white shadow-soft" : "text-slate")}>
                    <input type="radio" name="svc" className="sr-only" checked={svc === k} onChange={() => setSvc(k)} data-testid={`svc-${k}`} />
                    <Icon className="size-4" aria-hidden /> {label}
                  </label>
                ))}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="label">{tx({ en: "Pick-up city", ar: "مدينة الانطلاق" })}</span>
                  <select className="field" value={from} onChange={(e) => setFrom(e.target.value)} data-testid="chf-from">
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {cn(c.id)}
                      </option>
                    ))}
                  </select>
                </label>
                {svc === "intercity" ? (
                  <label>
                    <span className="label">{tx({ en: "Destination city", ar: "مدينة الوصول" })}</span>
                    <select className="field" value={to} onChange={(e) => setTo(e.target.value)} aria-invalid={touched && from === to} data-testid="chf-to">
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {cn(c.id)}
                        </option>
                      ))}
                    </select>
                    {touched && from === to && <span className="mt-1 block text-xs text-bad">{tx({ en: "Choose a different city.", ar: "اختر مدينة مختلفة." })}</span>}
                  </label>
                ) : (
                  <label>
                    <span className="label">{tx({ en: "Passengers", ar: "الركاب" })}</span>
                    <select className="field" value={pax} onChange={(e) => setPax(Number(e.target.value))}>
                      {Array.from({ length: maxPax }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {num(n)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="sm:col-span-2">
                  <span className="label">{svc === "airport" ? tx({ en: "Flight number or pick-up address", ar: "رقم الرحلة أو عنوان الانطلاق" }) : tx({ en: "Pick-up address or landmark", ar: "عنوان الانطلاق أو معلم قريب" })}</span>
                  <span className="relative block">
                    <MapPin className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate" aria-hidden />
                    <input className="field !ps-9" value={address} onChange={(e) => setAddress(e.target.value)} aria-invalid={touched && addrErr} placeholder={tx({ en: "e.g. hotel lobby, office tower", ar: "مثال: بهو الفندق، برج المكاتب" })} data-testid="chf-address" />
                  </span>
                  {touched && addrErr && <span className="mt-1 block text-xs text-bad">{t.form.required}</span>}
                </label>
                <label>
                  <span className="label">{t.common.date}</span>
                  <input type="date" className="field" value={d} onChange={(e) => setD(e.target.value)} aria-invalid={touched && !!dateErr} suppressHydrationWarning />
                </label>
                <label>
                  <span className="label">{t.search.pickupTime}</span>
                  <select className="field" value={time} onChange={(e) => setTime(e.target.value)}>
                    {TIMES.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                {touched && dateErr && <p className="text-xs text-bad sm:col-span-2">{t.search[dateErr]}</p>}
                {svc === "hourly" && (
                  <label className="sm:col-span-2">
                    <span className="label">
                      {tx({ en: "Hours", ar: "الساعات" })}: {num(hours)}
                    </span>
                    <input type="range" min={3} max={12} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-ember" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {ref ? (
              <div className="rounded-3xl bg-white p-6 text-center shadow-soft" role="status" data-testid="chf-done">
                <CheckCircle2 className="mx-auto size-12 text-ok" aria-hidden />
                <h2 className="mt-3 text-xl font-semibold">{tx({ en: "Request received (demo)", ar: "تم استلام الطلب (تجريبي)" })}</h2>
                <p className="mt-2 font-mono text-lg font-bold text-ember-ink" dir="ltr">
                  {ref}
                </p>
                <p className="mt-2 text-sm text-slate">
                  {dateTime(at)} · {cn(from)}
                  {svc === "intercity" ? ` → ${cn(to)}` : ""}
                </p>
                <button type="button" onClick={() => { setRef(null); setTouched(false); }} className={clsx(btn.ghost, "mt-4")}>
                  {tx({ en: "New request", ar: "طلب جديد" })}
                </button>
              </div>
            ) : (
              <div className="rounded-3xl bg-ink p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{tx({ en: "Estimate", ar: "التقدير" })}</h2>
                  <Badge kind="simulated" className="!bg-white/10 !text-white !ring-white/20" />
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-white/60">{tx({ en: "Chauffeur time", ar: "وقت السائق" })}</dt>
                    <dd>
                      {num(est.hours)} × {money(est.hourly)}
                    </dd>
                  </div>
                  {km > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-white/60">{tx({ en: "Est. road distance", ar: "المسافة التقديرية" })}</dt>
                      <dd>≈ {num(km)} km</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-white/60">{t.price.vat}</dt>
                    <dd>{money(est.vat, { decimals: true })}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                    <dt className="font-semibold">{t.price.total}</dt>
                    <dd className="text-2xl font-semibold" data-testid="chf-total">
                      {money(est.total, { decimals: true })}
                    </dd>
                  </div>
                </dl>
                <button className={clsx(btn.primary, "mt-6 w-full")} data-testid="chf-submit">
                  {tx({ en: "Request chauffeur (demo)", ar: "اطلب سائقًا (تجريبي)" })}
                </button>
                <p className="mt-3 text-[11px] text-white/50">{tx({ en: "Minimum 3 hours. Rates and distances are illustrative.", ar: "الحد الأدنى ٣ ساعات. الأسعار والمسافات توضيحية." })}</p>
              </div>
            )}
          </aside>
        </form>
      </Section>
    </>
  );
}

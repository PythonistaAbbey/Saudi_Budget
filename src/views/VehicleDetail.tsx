"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Briefcase, Check, Cog, DoorOpen, Fuel, Gauge, GitCompareArrows, Heart, ShieldCheck, Users, Wallet } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "@/i18n/client";
import type { Vehicle } from "@/data/vehicles";
import { vehicles } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";
import { PriceSummary } from "@/components/PriceSummary";
import { tripFromParams, tripToQuery } from "@/components/SearchWidget";
import { combine, validateTrip, TIMES } from "@/lib/dates";
import { COVERS, EXTRAS, quote } from "@/lib/pricing";
import { findBranch } from "@/data/branches";
import { useStore } from "@/lib/store";
import { Badge, L, btn } from "@/components/ui";
import { VehicleCard } from "@/components/VehicleCard";

export function VehicleDetailView({ v }: { v: Vehicle }) {
  const { t, tx, money, num } = useI18n();
  const params = useSearchParams();
  const [trip, setTrip] = useState(() => tripFromParams(params));
  const { compare, toggleCompare, saved, toggleSaved } = useStore();
  const [view, setView] = useState<"side" | "night">("side");

  const pickup = combine(trip.pd, trip.pt);
  const ret = combine(trip.rd, trip.rt);
  const err = validateTrip(pickup, ret);
  const pb = findBranch(trip.pb);
  const rb = findBranch(trip.rb);
  const q = quote({ vehicle: v, pickupAt: pickup, returnAt: err ? new Date(pickup.getTime() + 86400000) : ret, youngDriver: trip.age === "21", airportPickup: pb?.kind === "airport", oneWay: !!pb && !!rb && pb.city !== rb.city });
  const similar = vehicles.filter((x) => x.category === v.category && x.id !== v.id).slice(0, 3);

  const specs = [
    { Icon: Users, k: t.v.seats, val: num(v.seats) },
    { Icon: Briefcase, k: t.v.bags, val: num(v.bags) },
    { Icon: DoorOpen, k: t.v.doors, val: num(v.doors) },
    { Icon: Cog, k: t.v.transmission, val: t.trans[v.transmission] },
    { Icon: Fuel, k: t.v.fuel, val: t.fuel[v.fuel] },
    { Icon: Gauge, k: t.v.economy, val: v.economy },
    { Icon: Wallet, k: t.v.deposit, val: money(v.deposit) },
    { Icon: ShieldCheck, k: t.v.kmDay, val: num(v.kmPerDay) },
  ];

  return (
    <div className="bg-stone">
      <section className="grain relative overflow-hidden bg-ink text-white">
        <div aria-hidden className={clsx("absolute inset-0 transition-colors duration-700", view === "side" ? "bg-[radial-gradient(70%_60%_at_50%_70%,#1f3354,transparent_70%)]" : "bg-[radial-gradient(70%_60%_at_50%_70%,#5a2a14,transparent_70%)]")} />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6">
          <L href={`/find-a-car${params.toString() ? `?${params.toString()}` : ""}`} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="rtl-flip size-4" aria-hidden /> {t.common.back}
          </L>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ember-2">{t.cat[v.category]}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">{v.model}</h1>
              <p className="mt-2 text-white/60">
                {t.v.orSimilar} · {v.year} · {v.engine}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleSaved(v.id)} aria-pressed={saved.includes(v.id)} className={btn.glass}>
                <Heart className={clsx("size-4", saved.includes(v.id) && "fill-ember text-ember")} aria-hidden /> {saved.includes(v.id) ? t.v.saved : t.v.save}
              </button>
              <button onClick={() => toggleCompare(v.id)} aria-pressed={compare.includes(v.id)} className={btn.glass}>
                <GitCompareArrows className="size-4" aria-hidden /> {compare.includes(v.id) ? t.v.comparing : t.v.compare}
              </button>
            </div>
          </div>
          <motion.div key={view} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mt-6 max-w-4xl">
            <CarArt body={v.body} color={v.color} className="w-full drop-shadow-[0_40px_40px_rgba(0,0,0,0.55)]" label={`${v.model} illustration`} />
          </motion.div>
          <div className="mt-2 flex justify-center gap-2" role="tablist" aria-label={tx({ en: "Lighting", ar: "الإضاءة" })}>
            {(["side", "night"] as const).map((x) => (
              <button key={x} role="tab" aria-selected={view === x} onClick={() => setView(x)} className={clsx("rounded-full px-4 py-1.5 text-xs font-semibold", view === x ? "bg-white text-ink" : "bg-white/10 text-white hover:bg-white/20")}>
                {x === "side" ? tx({ en: "Studio", ar: "استوديو" }) : tx({ en: "Desert dusk", ar: "غروب الصحراء" })}
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-white/40">{tx({ en: "Original illustration for the concept — not a photograph of an actual rental vehicle.", ar: "رسم توضيحي أصلي للتصوّر — ليس صورة لسيارة إيجار فعلية." })}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section aria-labelledby="specs">
            <h2 id="specs" className="text-2xl font-semibold tracking-tight">
              {t.v.specs}
            </h2>
            <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {specs.map((s) => (
                <div key={s.k} className="rounded-2xl bg-white p-4 shadow-soft">
                  <s.Icon className="size-5 text-ember" aria-hidden />
                  <dt className="mt-3 text-xs text-slate">{s.k}</dt>
                  <dd className="text-lg font-semibold">{s.val}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="features" className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 id="features" className="text-xl font-semibold">
              {t.v.features}
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {v.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-ok" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="extras" className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="extras" className="text-xl font-semibold">
                {tx({ en: "Optional extras & cover", ar: "الإضافات الاختيارية والتغطية" })}
              </h2>
              <Badge kind="simulated" />
            </div>
            <ul className="mt-4 divide-y divide-ink/8 text-sm">
              {(Object.keys(EXTRAS) as (keyof typeof EXTRAS)[]).map((k) => (
                <li key={k} className="flex justify-between py-2.5">
                  <span>{t.price[k]}</span>
                  <span className="text-slate">
                    {money(EXTRAS[k].perDay)} {t.v.perDay}
                    {EXTRAS[k].maxCharge ? ` · ${tx({ en: "max", ar: "حد أقصى" })} ${money(EXTRAS[k].maxCharge!)}` : ""}
                  </span>
                </li>
              ))}
              {(["super", "premium"] as const).map((k) => (
                <li key={k} className="flex justify-between py-2.5">
                  <span>{t.price[`cover_${k}`]}</span>
                  <span className="text-slate">
                    {money(COVERS[k].perDay)} {t.v.perDay} · {t.price.excess} {money(COVERS[k].excess)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="conditions" className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="conditions" className="text-xl font-semibold">
                {tx({ en: "Rental conditions (illustrative)", ar: "شروط الإيجار (توضيحية)" })}
              </h2>
              <Badge kind="proposed" />
            </div>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm text-slate">
              <li>{tx({ en: "Minimum driver age 21 (a young-driver charge applies to ages 21–24 in this demo). The public booking form asks drivers to confirm they are over 21.", ar: "الحد الأدنى لعمر السائق ٢١ عامًا (تُطبّق رسوم السائق الشاب للأعمار ٢١–٢٤ في هذا العرض). يطلب نموذج الحجز العام تأكيد أن السائق فوق ٢١ عامًا." })}</li>
              <li>{tx({ en: "Valid driving licence and ID are checked at the counter — the prototype never collects documents.", ar: "يتم التحقق من رخصة القيادة والهوية عند الكاونتر — لا يجمع النموذج أي مستندات." })}</li>
              <li>{tx({ en: `${v.kmPerDay} km per day included; additional kilometres charged at the branch rate.`, ar: `${num(v.kmPerDay)} كم يوميًا مشمولة؛ الكيلومترات الإضافية بسعر الفرع.` })}</li>
              <li>{tx({ en: "Rental days are counted in 24-hour blocks with a 59-minute grace period.", ar: "تُحتسب أيام الإيجار بفترات ٢٤ ساعة مع مهلة سماح ٥٩ دقيقة." })}</li>
              <li>{tx({ en: "Real conditions are governed by the operator's published booking terms.", ar: "الشروط الفعلية تحكمها شروط الحجز المنشورة لدى المشغّل." })}</li>
            </ul>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="text-base font-semibold">{tx({ en: "Your rental", ar: "إيجارك" })}</h2>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <label className="label col-span-2 !mb-0" htmlFor="vd-pd">
                {t.search.pickupDate}
              </label>
              <input id="vd-pd" type="date" className="field" value={trip.pd} onChange={(e) => setTrip({ ...trip, pd: e.target.value })} suppressHydrationWarning />
              <select aria-label={t.search.pickupTime} className="field !w-24" value={trip.pt} onChange={(e) => setTrip({ ...trip, pt: e.target.value })}>
                {TIMES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <label className="label col-span-2 !mb-0 mt-2" htmlFor="vd-rd">
                {t.search.returnDate}
              </label>
              <input id="vd-rd" type="date" className="field" value={trip.rd} min={trip.pd} onChange={(e) => setTrip({ ...trip, rd: e.target.value })} suppressHydrationWarning data-testid="vd-return-date" />
              <select aria-label={t.search.returnTime} className="field !w-24" value={trip.rt} onChange={(e) => setTrip({ ...trip, rt: e.target.value })}>
                {TIMES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            {err && (
              <p className="mt-2 text-xs font-medium text-bad" role="alert">
                {t.search[err]}
              </p>
            )}
          </div>
          <PriceSummary q={q} />
          {err ? (
            <button disabled className={clsx(btn.primary, "w-full")}>
              {t.v.select}
            </button>
          ) : (
            <L href={`/booking?${tripToQuery(trip)}&vehicle=${v.id}`} className={clsx(btn.primary, "w-full !py-4 text-base")} data-testid="detail-select">
              {t.v.select}
            </L>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">{tx({ en: "Similar vehicles", ar: "سيارات مشابهة" })}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((x) => (
              <VehicleCard key={x.id} v={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

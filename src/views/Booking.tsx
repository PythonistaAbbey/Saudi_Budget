"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { Baby, Check, CheckCircle2, ChevronLeft, MapPin, Minus, Navigation, Plus, ShieldCheck, Tag, UserPlus, Wifi, CalendarDays, Lock, Printer } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { findVehicle } from "@/data/vehicles";
import { findBranch, findCity } from "@/data/branches";
import { combine, validateTrip } from "@/lib/dates";
import { COVERS, DEMO_CODES, EXTRAS, quote, type CoverId, type ExtraId } from "@/lib/pricing";
import { tripFromParams } from "@/components/SearchWidget";
import { CarArt } from "@/components/CarArt";
import { PriceSummary } from "@/components/PriceSummary";
import { L, btn, Field, Notice } from "@/components/ui";
import { useStore, type Booking } from "@/lib/store";

const STEPS = ["extras", "driver", "review", "done"] as const;
type Step = (typeof STEPS)[number];

const EXTRA_ICONS: Record<ExtraId, typeof Baby> = { additionalDriver: UserPlus, childSeat: Baby, boosterSeat: Baby, gps: Navigation, wifi: Wifi };

export const driverSchema = z.object({
  firstName: z.string().trim().min(2).max(40),
  lastName: z.string().trim().min(2).max(40),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^(05\d{8}|\+9665\d{8})$/),
  licence: z.enum(["ksa", "gcc", "intl"]),
  ageConfirm: z.literal(true),
  terms: z.literal(true),
});
type Driver = z.infer<typeof driverSchema>;

export function BookingView() {
  const { t, tx, locale, dateTime, money, num } = useI18n();
  const params = useSearchParams();
  const trip = tripFromParams(params);
  const v = findVehicle(params.get("vehicle") ?? "");
  const { addBooking } = useStore();

  const [step, setStep] = useState<Step>("extras");
  const [extras, setExtras] = useState<Partial<Record<ExtraId, number>>>({});
  const [cover, setCover] = useState<CoverId>("super");
  const [promo, setPromo] = useState("");
  const [promoPct, setPromoPct] = useState(0);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickup = combine(trip.pd, trip.pt);
  const ret = combine(trip.rd, trip.rt);
  const err = validateTrip(pickup, ret);
  const pb = findBranch(trip.pb);
  const rb = findBranch(trip.rb);
  const oneWay = !!pb && !!rb && pb.city !== rb.city;

  const q = useMemo(
    () => (v ? quote({ vehicle: v, pickupAt: pickup, returnAt: ret, extras, cover, youngDriver: trip.age === "21", airportPickup: pb?.kind === "airport", oneWay, promoPct }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [v?.id, trip.pd, trip.pt, trip.rd, trip.rt, extras, cover, promoPct, trip.age, pb?.id, oneWay],
  );

  const form = useForm<Driver>({ resolver: zodResolver(driverSchema), mode: "onTouched", defaultValues: { licence: "ksa" } as Partial<Driver> });

  if (!v || err) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">{tx({ en: "Let's start with a search", ar: "لنبدأ بالبحث" })}</h1>
        <p className="mt-3 text-slate">{err ? t.search[err] : tx({ en: "Choose a vehicle and your dates first.", ar: "اختر سيارة وتواريخك أولًا." })}</p>
        <L href="/find-a-car" className={clsx(btn.primary, "mt-6")}>
          {t.search.find}
        </L>
      </div>
    );
  }

  const cityName = (id?: string) => {
    const c = id ? findCity(id) : undefined;
    return c ? (locale === "ar" ? c.nameAr : c.name) : "";
  };
  const bName = (b?: { name: string; nameAr?: string }) => (b ? (locale === "ar" ? b.nameAr ?? b.name : b.name) : "");

  const stepIdx = STEPS.indexOf(step);
  const stepLabels = [tx({ en: "Extras", ar: "الإضافات" }), tx({ en: "Driver", ar: "السائق" }), tx({ en: "Review", ar: "المراجعة" }), tx({ en: "Confirmed", ar: "تم التأكيد" })];

  const setQty = (k: ExtraId, d: number) =>
    setExtras((x) => {
      const n = Math.max(0, Math.min(EXTRAS[k].maxQty, (x[k] ?? 0) + d));
      return { ...x, [k]: n };
    });

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    if (DEMO_CODES[code]) {
      setPromoPct(DEMO_CODES[code]);
      setPromoMsg(tx({ en: `Demo code applied: ${DEMO_CODES[code]}% off the rental.`, ar: `تم تطبيق الرمز التجريبي: خصم ${num(DEMO_CODES[code])}٪ على الإيجار.` }));
    } else {
      setPromoPct(0);
      setPromoMsg(tx({ en: "Code not recognised. Try DEMO10 (fictional).", ar: "الرمز غير معروف. جرّب DEMO10 (رمز وهمي)." }));
    }
  }

  function confirm() {
    if (!driver || !v) return;
    setSubmitting(true);
    setTimeout(() => {
      const b = addBooking({
        vehicleId: v.id,
        pickupBranch: trip.pb,
        returnBranch: trip.rb,
        pickupAt: pickup.toISOString(),
        returnAt: ret.toISOString(),
        extras,
        cover,
        youngDriver: trip.age === "21",
        promoPct,
        driver: { firstName: driver.firstName, lastName: driver.lastName, email: driver.email, phone: driver.phone },
      });
      setConfirmed(b);
      setStep("done");
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  }

  const go = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-stone">
      {/* Trip strip */}
      <div className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6">
          <CarArt body={v.body} color={v.color} className="w-28" shadow={false} />
          <div>
            <div className="text-lg font-semibold">{v.model}</div>
            <div className="text-xs text-white/60">
              {t.cat[v.category]} · {t.v.orSimilar}
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 text-ember-2" aria-hidden />
            <div>
              <div className="font-medium">
                {cityName(pb?.city)} · {bName(pb)}
              </div>
              {(oneWay || trip.rb !== trip.pb) && (
                <div className="text-white/60">
                  → {cityName(rb?.city)} · {bName(rb)}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CalendarDays className="mt-0.5 size-4 text-ember-2" aria-hidden />
            <div>
              <div className="font-medium">{dateTime(pickup)}</div>
              <div className="text-white/60">
                {dateTime(ret)} · {num(q!.days)} {q!.days === 1 ? t.search.day : t.search.days}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <nav aria-label={tx({ en: "Booking steps", ar: "خطوات الحجز" })} className="border-b border-ink/8 bg-white">
        <ol className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6">
          {stepLabels.map((s, i) => (
            <li key={s} className="flex shrink-0 items-center gap-2" aria-current={i === stepIdx ? "step" : undefined}>
              <span className={clsx("grid size-7 place-items-center rounded-full text-xs font-bold", i < stepIdx ? "bg-ok text-white" : i === stepIdx ? "bg-ember text-white" : "bg-mist text-slate")}>{i < stepIdx ? <Check className="size-4" aria-hidden /> : num(i + 1)}</span>
              <span className={clsx("text-sm font-semibold", i === stepIdx ? "text-ink" : "text-slate")}>{s}</span>
              {i < stepLabels.length - 1 && <span className="mx-2 h-px w-8 bg-ink/15" aria-hidden />}
            </li>
          ))}
        </ol>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_400px]">
        <div>
          <AnimatePresence mode="wait">
            {step === "extras" && (
              <motion.section key="extras" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6" data-testid="step-extras">
                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <h1 className="text-2xl font-semibold tracking-tight">{tx({ en: "Choose your protection", ar: "اختر مستوى الحماية" })}</h1>
                  <div className="mt-5 grid gap-3 md:grid-cols-3" role="radiogroup" aria-label={tx({ en: "Cover", ar: "التغطية" })}>
                    {(Object.keys(COVERS) as CoverId[]).map((c) => (
                      <label key={c} className={clsx("relative cursor-pointer rounded-2xl border-2 p-5 transition", cover === c ? "border-ember bg-orange-50/50" : "border-ink/10 hover:border-ink/30")} data-testid={`cover-${c}`}>
                        <input type="radio" name="cover" className="sr-only" checked={cover === c} onChange={() => setCover(c)} />
                        <ShieldCheck className={clsx("size-6", cover === c ? "text-ember" : "text-slate")} aria-hidden />
                        <div className="mt-3 font-semibold">{c === "standard" ? tx({ en: "Standard", ar: "أساسية" }) : t.price[`cover_${c}`]}</div>
                        <div className="mt-1 text-sm text-slate">
                          {t.price.excess}: {money(COVERS[c].excess)}
                        </div>
                        <div className="mt-3 text-lg font-semibold">{COVERS[c].perDay ? `+${money(COVERS[c].perDay)}${t.v.perDay}` : tx({ en: "Included", ar: "مشمولة" })}</div>
                        {c === "super" && <span className="absolute end-3 top-3 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white">{tx({ en: "Popular", ar: "الأكثر طلبًا" })}</span>}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <h2 className="text-xl font-semibold">{tx({ en: "Add extras", ar: "أضف إضافات" })}</h2>
                  <ul className="mt-4 divide-y divide-ink/8">
                    {(Object.keys(EXTRAS) as ExtraId[]).map((k) => {
                      const Icon = EXTRA_ICONS[k];
                      const qty = extras[k] ?? 0;
                      return (
                        <li key={k} className="flex items-center gap-4 py-4" data-testid={`extra-${k}`}>
                          <span className="grid size-11 place-items-center rounded-xl bg-stone">
                            <Icon className="size-5 text-ink" aria-hidden />
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">{t.price[k]}</div>
                            <div className="text-xs text-slate">
                              {money(EXTRAS[k].perDay)} {t.v.perDay}
                              {EXTRAS[k].maxCharge ? ` · ${tx({ en: "max", ar: "حد أقصى" })} ${money(EXTRAS[k].maxCharge!)}` : ""}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setQty(k, -1)} disabled={!qty} className="grid size-9 place-items-center rounded-full ring-1 ring-ink/15 disabled:opacity-30" aria-label={`${tx({ en: "Remove", ar: "إزالة" })} ${t.price[k]}`}>
                              <Minus className="size-4" />
                            </button>
                            <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite" data-testid={`qty-${k}`}>
                              {num(qty)}
                            </span>
                            <button type="button" onClick={() => setQty(k, 1)} disabled={qty >= EXTRAS[k].maxQty} className="grid size-9 place-items-center rounded-full bg-ink text-white disabled:opacity-30" aria-label={`${tx({ en: "Add", ar: "إضافة" })} ${t.price[k]}`} data-testid={`add-${k}`}>
                              <Plus className="size-4" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex justify-between">
                  <L href={`/vehicles/${v.id}?${params.toString()}`} className={btn.ghost}>
                    <ChevronLeft className="rtl-flip size-4" aria-hidden /> {t.common.back}
                  </L>
                  <button onClick={() => go("driver")} className={btn.primary} data-testid="to-driver">
                    {t.common.next}
                  </button>
                </div>
              </motion.section>
            )}

            {step === "driver" && (
              <motion.section key="driver" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} data-testid="step-driver">
                <form
                  noValidate
                  onSubmit={form.handleSubmit((d) => {
                    setDriver(d);
                    go("review");
                  })}
                  className="space-y-6"
                >
                  <div className="rounded-3xl bg-white p-6 shadow-soft">
                    <h1 className="text-2xl font-semibold tracking-tight">{tx({ en: "Main driver", ar: "السائق الرئيسي" })}</h1>
                    <div className="mt-4">
                      <Notice>
                        {tx({
                          en: "Demonstration only: use fictional details. Nothing is stored on a server, no ID documents are requested, and no payment is taken.",
                          ar: "للعرض فقط: استخدم بيانات وهمية. لا يُحفظ شيء على خادم، ولا تُطلب مستندات هوية، ولا يُؤخذ أي دفع.",
                        })}
                      </Notice>
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Field id="firstName" label={tx({ en: "First name", ar: "الاسم الأول" })} error={form.formState.errors.firstName && t.form.required}>
                        <input id="firstName" className="field" autoComplete="off" {...form.register("firstName")} aria-invalid={!!form.formState.errors.firstName} data-testid="firstName" />
                      </Field>
                      <Field id="lastName" label={tx({ en: "Last name", ar: "اسم العائلة" })} error={form.formState.errors.lastName && t.form.required}>
                        <input id="lastName" className="field" autoComplete="off" {...form.register("lastName")} aria-invalid={!!form.formState.errors.lastName} data-testid="lastName" />
                      </Field>
                      <Field id="email" label={t.form.email} error={form.formState.errors.email && t.form.invalidEmail}>
                        <input id="email" type="email" dir="ltr" className="field" autoComplete="off" {...form.register("email")} aria-invalid={!!form.formState.errors.email} data-testid="email" />
                      </Field>
                      <Field id="phone" label={t.form.phone} error={form.formState.errors.phone && t.form.invalidPhone} hint="05XXXXXXXX">
                        <input id="phone" type="tel" dir="ltr" className="field" autoComplete="off" {...form.register("phone")} aria-invalid={!!form.formState.errors.phone} data-testid="phone" />
                      </Field>
                      <Field id="licence" label={tx({ en: "Driving licence issued in", ar: "جهة إصدار رخصة القيادة" })}>
                        <select id="licence" className="field" {...form.register("licence")}>
                          <option value="ksa">{tx({ en: "Saudi Arabia", ar: "المملكة العربية السعودية" })}</option>
                          <option value="gcc">{tx({ en: "Another GCC country", ar: "دولة خليجية أخرى" })}</option>
                          <option value="intl">{tx({ en: "International", ar: "دولي" })}</option>
                        </select>
                      </Field>
                    </div>
                    <div className="mt-5 space-y-3 text-sm">
                      <label className="flex items-start gap-3">
                        <input type="checkbox" className="mt-0.5 size-4 accent-ember" {...form.register("ageConfirm")} data-testid="ageConfirm" />
                        <span>
                          {trip.age === "21" ? tx({ en: "I confirm the driver is aged 21–24.", ar: "أؤكد أن عمر السائق بين ٢١ و٢٤ عامًا." }) : tx({ en: "I confirm the driver is aged 25 or over.", ar: "أؤكد أن عمر السائق ٢٥ عامًا أو أكثر." })}
                          {form.formState.errors.ageConfirm && <span className="ms-2 text-xs font-medium text-bad">{t.form.required}</span>}
                        </span>
                      </label>
                      <label className="flex items-start gap-3">
                        <input type="checkbox" className="mt-0.5 size-4 accent-ember" {...form.register("terms")} data-testid="terms" />
                        <span>
                          {tx({ en: "I understand this is a demonstration reservation in an unofficial concept prototype.", ar: "أدرك أن هذا حجز تجريبي في نموذج تصوّري غير رسمي." })}
                          {form.formState.errors.terms && <span className="ms-2 text-xs font-medium text-bad">{t.form.required}</span>}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => go("extras")} className={btn.ghost}>
                      <ChevronLeft className="rtl-flip size-4" aria-hidden /> {t.common.back}
                    </button>
                    <button type="submit" className={btn.primary} data-testid="to-review">
                      {t.common.next}
                    </button>
                  </div>
                </form>
              </motion.section>
            )}

            {step === "review" && driver && (
              <motion.section key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6" data-testid="step-review">
                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <h1 className="text-2xl font-semibold tracking-tight">{tx({ en: "Review your demo reservation", ar: "راجع حجزك التجريبي" })}</h1>
                  <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate">{t.search.pickup}</dt>
                      <dd className="font-medium">
                        {bName(pb)}, {cityName(pb?.city)}
                        <br />
                        {dateTime(pickup)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate">{t.search.return}</dt>
                      <dd className="font-medium">
                        {bName(rb)}, {cityName(rb?.city)}
                        <br />
                        {dateTime(ret)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate">{tx({ en: "Driver", ar: "السائق" })}</dt>
                      <dd className="font-medium">
                        {driver.firstName} {driver.lastName}
                        <br />
                        <span dir="ltr">{driver.email}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate">{tx({ en: "Cover", ar: "التغطية" })}</dt>
                      <dd className="font-medium">{cover === "standard" ? tx({ en: "Standard", ar: "أساسية" }) : t.price[`cover_${cover}`]}</dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <label htmlFor="promo" className="flex items-center gap-2 text-sm font-semibold">
                    <Tag className="size-4" aria-hidden /> {tx({ en: "Promo code (demo)", ar: "رمز الخصم (تجريبي)" })}
                  </label>
                  <div className="mt-3 flex gap-2">
                    <input id="promo" value={promo} onChange={(e) => setPromo(e.target.value)} className="field" placeholder="DEMO10" dir="ltr" data-testid="promo" />
                    <button type="button" onClick={applyPromo} className={btn.dark} data-testid="apply-promo">
                      {tx({ en: "Apply", ar: "تطبيق" })}
                    </button>
                  </div>
                  {promoMsg && (
                    <p className={clsx("mt-2 text-sm", promoPct ? "text-ok" : "text-bad")} role="status">
                      {promoMsg}
                    </p>
                  )}
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <h2 className="flex items-center gap-2 font-semibold">
                    <Lock className="size-4" aria-hidden /> {tx({ en: "Payment", ar: "الدفع" })}
                  </h2>
                  <p className="mt-2 text-sm text-slate">
                    {tx({
                      en: "No payment is taken in this prototype. In production this step would hand off to a PCI-DSS compliant payment provider (mada, Apple Pay, cards) — card data would never touch these servers.",
                      ar: "لا يتم أخذ أي دفعة في هذا النموذج. في الإنتاج تنتقل هذه الخطوة إلى مزوّد دفع متوافق مع PCI-DSS (مدى، Apple Pay، البطاقات) — ولن تمر بيانات البطاقات بهذه الخوادم أبدًا.",
                    })}
                  </p>
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => go("driver")} className={btn.ghost}>
                    <ChevronLeft className="rtl-flip size-4" aria-hidden /> {t.common.back}
                  </button>
                  <button onClick={confirm} disabled={submitting} className={clsx(btn.primary, "!px-8")} data-testid="confirm-booking">
                    {submitting ? t.form.sending : tx({ en: "Confirm demo reservation", ar: "أكّد الحجز التجريبي" })}
                  </button>
                </div>
              </motion.section>
            )}

            {step === "done" && confirmed && (
              <motion.section key="done" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl bg-white p-8 text-center shadow-soft" data-testid="step-done">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}>
                  <CheckCircle2 className="mx-auto size-16 text-ok" aria-hidden />
                </motion.div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight">{tx({ en: "Demo reservation confirmed", ar: "تم تأكيد الحجز التجريبي" })}</h1>
                <p className="mt-2 text-slate">{tx({ en: "Your reservation reference", ar: "رقم الحجز" })}</p>
                <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-ember-ink" data-testid="booking-ref" dir="ltr">
                  {confirmed.ref}
                </p>
                <p className="mx-auto mt-4 max-w-md text-sm text-slate">
                  {tx({
                    en: `In production a confirmation would be emailed to ${confirmed.driver.email}. In this demo, nothing is sent — the booking is saved in this browser only.`,
                    ar: `في الإنتاج يُرسل التأكيد إلى ${confirmed.driver.email}. في هذا العرض لا يُرسل شيء — يُحفظ الحجز في هذا المتصفح فقط.`,
                  })}
                </p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-stone p-4 text-start text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate">{v.model}</span>
                    <span className="font-semibold">{money(confirmed.total, { decimals: true })}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate">
                    {dateTime(confirmed.pickupAt)} → {dateTime(confirmed.returnAt)}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <L href={`/my-bookings?ref=${confirmed.ref}`} className={btn.primary} data-testid="go-my-bookings">
                    {tx({ en: "Manage in My bookings", ar: "إدارة في حجوزاتي" })}
                  </L>
                  <button onClick={() => window.print()} className={btn.ghost}>
                    <Printer className="size-4" aria-hidden /> {t.common.print}
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">{q && <PriceSummary q={step === "done" && confirmed ? q : q} />}</aside>
      </div>
    </div>
  );
}

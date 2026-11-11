"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { ArrowRight, BadgePercent, CalendarClock, CarFront, Check, Download, FileSignature, Gauge, LayoutDashboard, RefreshCcw, ShieldCheck, Truck, Wrench, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { leasing, contact } from "@/content/verified";
import { leaseEstimate } from "@/lib/pricing";
import { toDateInput } from "@/lib/dates";
import { Badge, Card, Eyebrow, Field, H2, L, PageHero, Section, SourceLink, btn } from "@/components/ui";
import { CarArt } from "@/components/CarArt";

type Tier = "essential" | "business" | "executive";

const reqSchema = z.object({
  company: z.string().trim().min(2),
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^(05\d{8}|\+9665\d{8}|01\d{7,8})$/),
  fleet: z.coerce.number().int().min(1).max(5000),
  notes: z.string().max(600).optional(),
});
type Req = z.infer<typeof reqSchema>;

export function CorporateView() {
  const { t, tx, money, num, date, locale } = useI18n();
  const [tier, setTier] = useState<Tier>("business");
  const [vehiclesN, setVehiclesN] = useState(25);
  const [months, setMonths] = useState<24 | 36 | 48>(36);
  const est = leaseEstimate({ vehicles: vehiclesN, months, tier });
  const [sent, setSent] = useState<string | null>(null);
  const [slot, setSlot] = useState<{ day: string; time: string } | null>(null);
  const [booked, setBooked] = useState(false);

  const form = useForm<z.input<typeof reqSchema>, unknown, Req>({ resolver: zodResolver(reqSchema), mode: "onTouched", defaultValues: { fleet: 25 } });

  const tiers: { id: Tier; name: string; body: string; car: { body: "sedan" | "suv" | "pickup"; color: string }; inc: string[] }[] = [
    { id: "essential", name: tx({ en: "Essential fleet", ar: "الأسطول الأساسي" }), body: tx({ en: "Economy and compact sedans for field teams.", ar: "سيارات سيدان اقتصادية وصغيرة للفرق الميدانية." }), car: { body: "sedan", color: "#d9dde4" }, inc: [tx({ en: "Periodic maintenance", ar: "صيانة دورية" }), tx({ en: "24/7 roadside", ar: "مساعدة على الطريق ٢٤/٧" }), tx({ en: "Unlimited mileage", ar: "كيلومترات غير محدودة" })] },
    { id: "business", name: tx({ en: "Business mobility", ar: "تنقّل الأعمال" }), body: tx({ en: "Mid-size sedans, SUVs and pick-ups for mixed operations.", ar: "سيارات سيدان متوسطة وSUV وبيك أب للعمليات المتنوعة." }), car: { body: "suv", color: "#3c4a3e" }, inc: [tx({ en: "Everything in Essential", ar: "كل ما في الأساسي" }), tx({ en: "Replacement vehicles", ar: "سيارات بديلة" }), tx({ en: "Pick-up & drop-off servicing", ar: "استلام وتسليم للصيانة" })] },
    { id: "executive", name: tx({ en: "Executive", ar: "التنفيذي" }), body: tx({ en: "Premium sedans and SUVs for leadership teams.", ar: "سيارات سيدان وSUV فاخرة لفرق القيادة." }), car: { body: "sedan", color: "#0e0f12" }, inc: [tx({ en: "Everything in Business", ar: "كل ما في الأعمال" }), tx({ en: "Priority replacements", ar: "أولوية في الاستبدال" }), tx({ en: "Quick Pass eligibility", ar: "أهلية المسار السريع" })] },
  ];

  const benefits = [
    { Icon: BadgePercent, text: leasing.lowerPayments.value },
    { Icon: RefreshCcw, text: leasing.refreshCycle.value },
    { Icon: FileSignature, text: `${leasing.noDownPayment.value} · ${leasing.credit.value}` },
    { Icon: Gauge, text: leasing.mileage.value },
    { Icon: Wrench, text: leasing.maintenance.value },
    { Icon: Truck, text: `${leasing.towing.value}. ${leasing.replacement.value}.` },
    { Icon: ShieldCheck, text: leasing.insurance.value },
    { Icon: CarFront, text: leasing.delivery.value },
  ];

  function downloadProposal() {
    const tierName = tiers.find((x) => x.id === tier)!.name;
    const html = `<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"><meta charset="utf-8"><title>Mock lease proposal</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;color:#070b14;line-height:1.5}h1{margin:0}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px;border-bottom:1px solid #ddd}.warn{background:#fff7e6;border:2px dashed #f59e0b;padding:12px;font-weight:700;text-align:center}</style>
<p class="warn">${tx({ en: "MOCK PROPOSAL — concept prototype. Not an offer from Budget Saudi. Illustrative figures only.", ar: "عرض تجريبي — نموذج تصوّري. ليس عرضًا من بدجت السعودية. أرقام توضيحية فقط." })}</p>
<h1>${tx({ en: "Fleet lease proposal summary", ar: "ملخص عرض تأجير الأسطول" })}</h1><p>${date(new Date())}</p>
<table><tr><td>${tx({ en: "Package", ar: "الباقة" })}</td><td>${tierName}</td></tr><tr><td>${tx({ en: "Vehicles", ar: "عدد السيارات" })}</td><td>${num(vehiclesN)}</td></tr><tr><td>${tx({ en: "Term", ar: "المدة" })}</td><td>${num(months)} ${tx({ en: "months", ar: "شهرًا" })}</td></tr><tr><td>${tx({ en: "Per vehicle / month (excl. VAT)", ar: "لكل سيارة / شهريًا (بدون الضريبة)" })}</td><td>${money(est.perVehicle)}</td></tr><tr><td>${tx({ en: "Fleet / month (excl. VAT)", ar: "الأسطول / شهريًا (بدون الضريبة)" })}</td><td>${money(est.monthly)}</td></tr><tr><td>${tx({ en: "Contract value (excl. VAT)", ar: "قيمة العقد (بدون الضريبة)" })}</td><td>${money(est.contract)}</td></tr></table>
<h3>${tx({ en: "Published leasing features (verified)", ar: "مزايا التأجير المنشورة (موثّقة)" })}</h3><ul>${benefits.map((b) => `<li>${b.text}</li>`).join("")}</ul>
<p style="font-size:12px;color:#5b6576">Source: ${leasing.mileage.source} (retrieved ${leasing.mileage.retrieved})</p></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-lease-proposal-${vehiclesN}x${months}m.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const days = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  }).filter((d) => d.getDay() !== 5 && d.getDay() !== 6); // Sun–Thu business week
  const times = ["09:00", "10:30", "12:00", "13:30", "15:00"];

  return (
    <>
      <PageHero
        eyebrow={t.nav.corporate}
        title={tx({ en: "Fleet mobility, engineered for business.", ar: "تنقّل أسطولك، مصمَّم للأعمال." })}
        lead={tx({ en: "Customised lease plans that keep your fleet new, your costs predictable and your teams moving.", ar: "خطط تأجير مخصّصة تُبقي أسطولك حديثًا وتكاليفك متوقعة وفرقك في حركة دائمة." })}
        art={<CarArt body="suv" color="#e9e4da" className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />}
      >
        <a href="#estimate" className={btn.primary}>
          {tx({ en: "Estimate a fleet", ar: "قدّر تكلفة أسطول" })}
        </a>
        <L href="/corporate/dashboard" className={btn.glass}>
          <LayoutDashboard className="size-4" aria-hidden /> {t.nav.fleetDashboard}
        </L>
      </PageHero>

      <Section tone="white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{tx({ en: "What's published today", ar: "ما هو منشور حاليًا" })}</Eyebrow>
            <H2>{tx({ en: "Leasing benefits", ar: "مزايا التأجير" })}</H2>
          </div>
          <div className="flex items-center gap-3">
            <Badge kind="verified" />
            <SourceLink href={leasing.mileage.source} />
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Card key={i} className="!p-5">
              <b.Icon className="size-6 text-ember" aria-hidden />
              <p className="mt-3 text-sm">{b.text}</p>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate">{tx({ en: "Benefit text is quoted or closely paraphrased from the public corporate-leasing page (English).", ar: "نص المزايا مقتبس أو معاد صياغته بدقة من صفحة تأجير الشركات العامة (بالإنجليزية)." })}</p>
      </Section>

      <Section id="estimate">
        <Eyebrow>{tx({ en: "Packages & contract structures", ar: "الباقات وهياكل العقود" })}</Eyebrow>
        <H2>{tx({ en: "Build an illustrative fleet plan.", ar: "صمّم خطة أسطول توضيحية." })}</H2>
        <div className="mt-3">
          <Badge kind="simulated" />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3" role="radiogroup" aria-label={tx({ en: "Package", ar: "الباقة" })}>
          {tiers.map((x) => (
            <label key={x.id} className={clsx("cursor-pointer rounded-3xl border-2 bg-white p-6 transition", tier === x.id ? "border-ember shadow-lift" : "border-transparent shadow-soft hover:border-ink/15")} data-testid={`tier-${x.id}`}>
              <input type="radio" name="tier" className="sr-only" checked={tier === x.id} onChange={() => setTier(x.id)} />
              <CarArt body={x.car.body} color={x.car.color} className="w-full" />
              <h3 className="mt-2 text-xl font-semibold">{x.name}</h3>
              <p className="mt-1 text-sm text-slate">{x.body}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {x.inc.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="size-4 text-ok" aria-hidden /> {i}
                  </li>
                ))}
              </ul>
            </label>
          ))}
        </div>
        <div className="mt-6 grid gap-6 rounded-3xl bg-ink p-8 text-white lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div>
              <label htmlFor="fleetN" className="flex justify-between text-sm font-semibold">
                {tx({ en: "Number of vehicles", ar: "عدد السيارات" })} <span className="text-ember-2">{num(vehiclesN)}</span>
              </label>
              <input id="fleetN" type="range" min={1} max={200} value={vehiclesN} onChange={(e) => setVehiclesN(Number(e.target.value))} className="mt-3 w-full accent-ember" data-testid="fleet-size" />
            </div>
            <fieldset>
              <legend className="text-sm font-semibold">{tx({ en: "Contract term", ar: "مدة العقد" })}</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {([24, 36, 48] as const).map((m) => (
                  <label key={m} className={clsx("cursor-pointer rounded-xl py-3 text-center text-sm font-semibold ring-1 transition", months === m ? "bg-ember ring-ember" : "ring-white/20 hover:ring-white/50")}>
                    <input type="radio" className="sr-only" name="term" checked={months === m} onChange={() => setMonths(m)} />
                    {num(m)} {tx({ en: "months", ar: "شهرًا" })}
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="text-xs text-white/50">{tx({ en: "Illustrative: volume and term adjustments are invented for the demo; real pricing depends on vehicles, usage and credit terms.", ar: "توضيحي: تعديلات الحجم والمدة مفترضة لأغراض العرض؛ التسعير الفعلي يعتمد على السيارات والاستخدام وشروط الائتمان." })}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              [tx({ en: "Per vehicle / month", ar: "لكل سيارة / شهريًا" }), money(est.perVehicle)],
              [tx({ en: "Fleet / month", ar: "الأسطول / شهريًا" }), money(est.monthly)],
              [tx({ en: "VAT / month", ar: "الضريبة / شهريًا" }), money(est.vatMonthly)],
              [tx({ en: "Contract value", ar: "قيمة العقد" }), money(est.contract)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-white/60">{k}</div>
                <div className="mt-1 text-xl font-semibold tabular-nums" data-testid="lease-figure">
                  {v}
                </div>
              </div>
            ))}
            <button onClick={downloadProposal} className={clsx(btn.primary, "col-span-2")} data-testid="download-proposal">
              <Download className="size-4" aria-hidden /> {tx({ en: "Download mock proposal", ar: "تنزيل عرض تجريبي" })}
            </button>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>{tx({ en: "Fleet request", ar: "طلب أسطول" })}</Eyebrow>
            <H2 className="!text-3xl">{tx({ en: "Tell us about your fleet.", ar: "أخبرنا عن أسطولك." })}</H2>
            {sent ? (
              <div className="mt-8 rounded-3xl bg-emerald-50 p-6 text-emerald-950" role="status" data-testid="corp-sent">
                <CheckCircle2 className="size-8 text-ok" aria-hidden />
                <p className="mt-3 font-semibold">{t.form.sentDemo}</p>
                <p className="mt-1 text-sm">
                  {tx({ en: "Demo reference", ar: "الرقم التجريبي" })}: <span className="font-mono">{sent}</span>
                </p>
                <p className="mt-3 text-sm">
                  {tx({ en: "Real enquiries: corporate sales", ar: "للاستفسارات الفعلية: مبيعات الشركات" })} <span dir="ltr">{contact.corporateSales.value}</span> · <span dir="ltr">{contact.salesEmail.value}</span>
                </p>
              </div>
            ) : (
              <form
                noValidate
                className="mt-8 grid gap-4 sm:grid-cols-2"
                onSubmit={form.handleSubmit(() => setSent(`CORP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`))}
                data-testid="corp-form"
              >
                <Field id="c-company" label={t.form.company} error={form.formState.errors.company && t.form.required}>
                  <input id="c-company" className="field" {...form.register("company")} aria-invalid={!!form.formState.errors.company} />
                </Field>
                <Field id="c-name" label={t.form.name} error={form.formState.errors.name && t.form.required}>
                  <input id="c-name" className="field" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
                </Field>
                <Field id="c-email" label={t.form.email} error={form.formState.errors.email && t.form.invalidEmail}>
                  <input id="c-email" type="email" dir="ltr" className="field" {...form.register("email")} aria-invalid={!!form.formState.errors.email} />
                </Field>
                <Field id="c-phone" label={t.form.phone} error={form.formState.errors.phone && t.form.invalidPhone}>
                  <input id="c-phone" type="tel" dir="ltr" className="field" {...form.register("phone")} aria-invalid={!!form.formState.errors.phone} />
                </Field>
                <Field id="c-fleet" label={tx({ en: "Vehicles needed", ar: "عدد السيارات المطلوبة" })} error={form.formState.errors.fleet && t.form.required}>
                  <input id="c-fleet" type="number" min={1} className="field" {...form.register("fleet")} aria-invalid={!!form.formState.errors.fleet} />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="c-notes" label={t.form.message}>
                    <textarea id="c-notes" rows={3} className="field" {...form.register("notes")} />
                  </Field>
                </div>
                <button className={clsx(btn.primary, "sm:col-span-2")} data-testid="corp-submit">
                  {t.form.submit} <ArrowRight className="rtl-flip size-4" aria-hidden />
                </button>
              </form>
            )}
          </div>
          <div>
            <Eyebrow>{tx({ en: "Consultation", ar: "استشارة" })}</Eyebrow>
            <H2 className="!text-3xl">{tx({ en: "Book a 30-minute fleet consultation.", ar: "احجز استشارة أسطول لمدة ٣٠ دقيقة." })}</H2>
            <div className="mt-8 rounded-3xl bg-stone p-6">
              <div className="flex gap-2 overflow-x-auto pb-2" role="listbox" aria-label={t.common.date}>
                {days.map((d) => {
                  const id = toDateInput(d);
                  return (
                    <button key={id} role="option" aria-selected={slot?.day === id} onClick={() => setSlot({ day: id, time: slot?.time ?? "" })} className={clsx("shrink-0 rounded-2xl px-4 py-3 text-center transition", slot?.day === id ? "bg-ink text-white" : "bg-white hover:ring-1 hover:ring-ink/20")} data-testid="consult-day">
                      <div className="text-xs opacity-70">{date(d, { weekday: "short" })}</div>
                      <div className="text-lg font-semibold">{date(d, { day: "numeric" })}</div>
                      <div className="text-xs opacity-70">{date(d, { month: "short" })}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {times.map((x) => (
                  <button key={x} disabled={!slot?.day} onClick={() => setSlot({ day: slot!.day, time: x })} className={clsx("rounded-xl py-2 text-sm font-semibold transition disabled:opacity-40", slot?.time === x ? "bg-ember text-white" : "bg-white hover:ring-1 hover:ring-ink/20")} data-testid="consult-time">
                    {x}
                  </button>
                ))}
              </div>
              {booked && slot ? (
                <p className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-950" role="status" data-testid="consult-booked">
                  <CalendarClock className="size-5 text-ok" aria-hidden />
                  {tx({ en: "Demo consultation held for", ar: "تم حجز استشارة تجريبية في" })} {date(slot.day, { weekday: "long", day: "numeric", month: "long" })} · {slot.time}
                </p>
              ) : (
                <button disabled={!slot?.day || !slot?.time} onClick={() => setBooked(true)} className={clsx(btn.dark, "mt-5 w-full")} data-testid="consult-book">
                  <CalendarClock className="size-4" aria-hidden /> {tx({ en: "Hold this slot", ar: "احجز هذا الموعد" })}
                </button>
              )}
              <p className="mt-3 text-xs text-slate">{tx({ en: "Simulated availability. Sunday–Thursday, Riyadh time.", ar: "مواعيد محاكاة. من الأحد إلى الخميس بتوقيت الرياض." })}</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

"use client";

import { useState } from "react";
import clsx from "clsx";
import { Info, Mail, Phone, TrendingDown, KeyRound, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { wafi } from "@/content/verified";
import { WAFI_STEPS, wafiSchedule, VAT_RATE } from "@/lib/pricing";
import { vehicles } from "@/data/vehicles";
import { Badge, Card, Eyebrow, H2, Notice, PageHero, Section, SourceLink, btn } from "@/components/ui";
import { CarArt } from "@/components/CarArt";

const MONTHLY_FACTOR = 18; // mock: monthly rate ≈ 18 × daily rate

export function WafiView() {
  const { tx, money, num, t } = useI18n();
  const options = ["hyundai-accent", "toyota-corolla", "toyota-camry", "hyundai-tucson", "toyota-fortuner"].map((id) => vehicles.find((v) => v.id === id)!);
  const [vid, setVid] = useState(options[1].id);
  const [months, setMonths] = useState(12);
  const [applied, setApplied] = useState(false);
  const v = options.find((x) => x.id === vid)!;
  const monthly = Math.round(v.dailyRate * MONTHLY_FACTOR);
  const s = wafiSchedule(monthly, months);
  const maxBar = monthly;

  return (
    <>
      <PageHero
        eyebrow={tx({ en: "WAFI programme", ar: "برنامج وافي" })}
        title={tx({ en: "Long-term rental that rewards staying power.", ar: "إيجار طويل الأجل يكافئ الاستمرارية." })}
        lead={tx({ en: "WAFI is published as a long-term car rental programme with a progressive discount. This page shows what is verified, and an illustrative model of how a progressive discount works.", ar: "وافي منشور كبرنامج لإيجار السيارات طويل الأجل بخصم تصاعدي. تعرض هذه الصفحة ما هو موثّق، ونموذجًا توضيحيًا لكيفية عمل الخصم التصاعدي." })}
        art={<CarArt body="sedan" color="#e9e7e2" className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />}
      >
        <a href="#calculator" className={btn.primary}>
          {tx({ en: "Open the calculator", ar: "افتح الحاسبة" })}
        </a>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>{tx({ en: "Verified", ar: "موثّق" })}</Eyebrow>
            <H2 className="!text-3xl">{tx({ en: "What the public WAFI page states", ar: "ما تذكره صفحة وافي العامة" })}</H2>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3 rounded-2xl bg-stone p-4">
                <KeyRound className="size-5 shrink-0 text-ember" aria-hidden />
                <span>
                  <strong>{tx({ en: "Programme:", ar: "البرنامج:" })}</strong> {wafi.title.value}
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl bg-stone p-4">
                <TrendingDown className="size-5 shrink-0 text-ember" aria-hidden />
                <span>
                  <strong>{tx({ en: "Headline:", ar: "العنوان:" })}</strong> {wafi.headline.value}
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl bg-stone p-4">
                <Phone className="size-5 shrink-0 text-ember" aria-hidden />
                <a href={`tel:${wafi.contactPhone.value}`} dir="ltr" className="font-semibold">
                  {wafi.contactPhone.value}
                </a>
              </li>
              <li className="flex gap-3 rounded-2xl bg-stone p-4">
                <Mail className="size-5 shrink-0 text-ember" aria-hidden />
                <a href={`mailto:${wafi.contactEmail.value}`} className="font-semibold">
                  {wafi.contactEmail.value}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge kind="verified" />
              <SourceLink href={wafi.title.source} />
            </div>
          </div>
          <div className="space-y-4">
            <Card className="border-amber-200 !bg-amber-50">
              <h3 className="flex items-center gap-2 font-semibold text-amber-950">
                <Info className="size-5" aria-hidden /> {tx({ en: "What we could not verify", ar: "ما لم نتمكن من التحقق منه" })}
              </h3>
              <p className="mt-2 text-sm text-amber-950/80">
                {tx({
                  en: "The page has a “Key Terms” heading, but no terms could be read: eligibility, minimum duration, discount steps and prices are not published in a form we could verify. The calculator below therefore uses an invented model and must not be read as WAFI's actual terms.",
                  ar: "تحتوي الصفحة على عنوان «الشروط الرئيسية» لكن لم نتمكن من قراءة أي شروط: الأهلية والحد الأدنى للمدة وخطوات الخصم والأسعار غير منشورة بصيغة يمكن التحقق منها. لذلك تستخدم الحاسبة أدناه نموذجًا مفترضًا ولا ينبغي اعتباره شروط وافي الفعلية.",
                })}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold">{tx({ en: "Rental, not ownership", ar: "إيجار وليس تملّكًا" })}</h3>
              <p className="mt-2 text-sm text-slate">
                {tx({
                  en: "WAFI is described as a long-term rental programme. The vehicle is returned at the end of the rental; nothing on this page suggests a lease-to-own or ownership scheme.",
                  ar: "يوصف وافي بأنه برنامج إيجار طويل الأجل. تُعاد السيارة في نهاية الإيجار، ولا شيء في هذه الصفحة يشير إلى برنامج تأجير منتهٍ بالتمليك.",
                })}
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <Section id="calculator">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{tx({ en: "Illustrative calculator", ar: "حاسبة توضيحية" })}</Eyebrow>
            <H2>{tx({ en: "See how a progressive discount adds up.", ar: "شاهد كيف يتراكم الخصم التصاعدي." })}</H2>
          </div>
          <Badge kind="simulated" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6 rounded-3xl bg-white p-6 shadow-soft">
            <fieldset>
              <legend className="label">{t.search.category}</legend>
              <div className="space-y-2">
                {options.map((o) => (
                  <label key={o.id} className={clsx("flex cursor-pointer items-center gap-3 rounded-2xl p-2 ring-1 transition", vid === o.id ? "bg-orange-50 ring-ember" : "ring-ink/10 hover:ring-ink/30")}>
                    <input type="radio" name="wafi-v" className="sr-only" checked={vid === o.id} onChange={() => setVid(o.id)} />
                    <CarArt body={o.body} color={o.color} className="w-20" shadow={false} />
                    <span className="flex-1 text-sm font-semibold">{o.model}</span>
                    <span className="text-xs text-slate">
                      {money(Math.round(o.dailyRate * MONTHLY_FACTOR))}/{tx({ en: "mo", ar: "شهر" })}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="wafi-months" className="flex justify-between text-sm font-semibold">
                {tx({ en: "Rental duration", ar: "مدة الإيجار" })}
                <span className="text-ember-ink" data-testid="wafi-months">
                  {num(months)} {tx({ en: "months", ar: "شهرًا" })}
                </span>
              </label>
              <input id="wafi-months" type="range" min={1} max={36} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="mt-3 w-full accent-ember" data-testid="wafi-slider" />
            </div>
            <div className="rounded-2xl bg-stone p-4 text-xs text-slate">
              <div className="font-semibold text-ink">{tx({ en: "Illustrative discount steps", ar: "خطوات الخصم التوضيحية" })}</div>
              <ul className="mt-2 space-y-1">
                {WAFI_STEPS.map((s) => (
                  <li key={s.fromMonth} className="flex justify-between">
                    <span>{tx({ en: `From month ${s.fromMonth}`, ar: `من الشهر ${num(s.fromMonth)}` })}</span>
                    <span className="font-semibold">{num(s.pct)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-ink p-6 text-white">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                [tx({ en: "Without discount", ar: "بدون خصم" }), money(s.undiscounted)],
                [tx({ en: "Illustrative saving", ar: "التوفير التوضيحي" }), money(s.saved)],
                [`${tx({ en: "VAT", ar: "الضريبة" })} ${num(VAT_RATE * 100)}%`, money(s.vat)],
                [tx({ en: "Illustrative total", ar: "الإجمالي التوضيحي" }), money(s.total)],
              ].map(([k, val], i) => (
                <div key={k} className={clsx("rounded-2xl p-4", i === 3 ? "bg-ember" : "bg-white/5")}>
                  <div className="text-xs opacity-75">{k}</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums" data-testid={i === 3 ? "wafi-total" : i === 1 ? "wafi-saved" : undefined}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <div className="mb-2 text-sm text-white/70">{tx({ en: "Monthly charge by month (excl. VAT)", ar: "الرسوم الشهرية لكل شهر (بدون الضريبة)" })}</div>
              <div className="flex h-48 items-end gap-[3px]" role="img" aria-label={tx({ en: `Monthly charges decreasing over ${months} months`, ar: `رسوم شهرية تتناقص على مدى ${months} شهرًا` })}>
                {s.rows.map((r) => (
                  <div key={r.month} className="group relative flex-1">
                    <div className="rounded-t bg-gradient-to-t from-ember-ink to-ember-2 transition-all duration-300" style={{ height: `${(r.amount / maxBar) * 180}px` }} />
                    <span className="pointer-events-none absolute -top-8 start-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-[10px] text-ink group-hover:block">
                      {num(r.month)}: {money(r.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-6 text-xs text-white/50">{tx({ en: "All figures are illustrative. Monthly base ≈ 18 × the simulated daily rate. Not WAFI's published pricing.", ar: "جميع الأرقام توضيحية. القاعدة الشهرية ≈ ١٨ × السعر اليومي المحاكى. ليست أسعار وافي المنشورة." })}</p>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-2xl text-center">
          <H2 className="!text-3xl">{tx({ en: "Interested in WAFI?", ar: "مهتم ببرنامج وافي؟" })}</H2>
          <p className="mt-3 text-slate">{tx({ en: "In production, “Apply now” would start an authenticated application. In this concept it records interest only.", ar: "في الإنتاج يبدأ زر «قدّم الآن» طلبًا موثّقًا. في هذا التصوّر يسجّل الاهتمام فقط." })}</p>
          {applied ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-3 text-emerald-900" role="status" data-testid="wafi-applied">
              <CheckCircle2 className="size-5" aria-hidden /> {t.form.sentDemo}
            </p>
          ) : (
            <button onClick={() => setApplied(true)} className={clsx(btn.primary, "mt-6")} data-testid="wafi-apply">
              {tx({ en: "Register interest (demo)", ar: "سجّل اهتمامك (تجريبي)" })}
            </button>
          )}
          <div className="mt-6">
            <Notice>{tx({ en: "For real WAFI enquiries, use the published contact details above.", ar: "للاستفسارات الفعلية عن وافي، استخدم بيانات التواصل المنشورة أعلاه." })}</Notice>
          </div>
        </div>
      </Section>
    </>
  );
}

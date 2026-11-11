"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import { Eye, Target, Check } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { company, timeline, SOURCES } from "@/content/verified";
import { Badge, Card, Eyebrow, H2, PageHero, Section, SourceLink } from "@/components/ui";

export function AboutView() {
  const { tx, t, locale } = useI18n();
  const [i, setI] = useState(0);
  const m = timeline[i];
  const activitiesAr: Record<string, string> = {
    "Car rental": "تأجير السيارات",
    "Car leasing": "تأجير السيارات طويل الأجل للشركات",
    "Pre-owned car sales": "بيع السيارات المستعملة",
    "International and domestic reservations": "الحجوزات المحلية والدولية",
    "Cross-border rentals": "الإيجار عبر الحدود",
    "Chauffeur-driven and premier limousine services": "خدمات السائق الخاص والليموزين الفاخرة",
  };

  return (
    <>
      <PageHero eyebrow={t.nav.about} title={tx({ en: "Keep moving — since 1978.", ar: "واصل التنقّل — منذ ١٩٧٨." })} lead={tx({ en: "The story, vision and network of Budget Saudi, as published on its public website and stock-exchange profiles.", ar: "قصة بدجت السعودية ورؤيتها وشبكتها كما نُشرت في موقعها العام وملفاتها في السوق المالية." })}>
        <Badge kind="verified" className="!bg-white/10 !text-white !ring-white/20" />
      </PageHero>

      <Section tone="white">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="!bg-ink text-white">
            <Eye className="size-7 text-ember-2" aria-hidden />
            <h2 className="mt-4 text-sm font-bold uppercase tracking-widest text-white/60">{tx({ en: "Vision", ar: "الرؤية" })}</h2>
            <p className="mt-2 text-2xl font-semibold" lang="en" dir={locale === "ar" ? "ltr" : undefined}>
              “{company.vision.value}”
            </p>
          </Card>
          <Card>
            <Target className="size-7 text-ember" aria-hidden />
            <h2 className="mt-4 text-sm font-bold uppercase tracking-widest text-slate">{tx({ en: "Mission", ar: "الرسالة" })}</h2>
            <p className="mt-2 text-2xl font-semibold" lang="en" dir={locale === "ar" ? "ltr" : undefined}>
              “{company.mission.value}”
            </p>
          </Card>
        </div>
        <p className="mt-3 text-xs text-slate">
          {tx({ en: "Quoted verbatim in English from the About page.", ar: "مقتبسة حرفيًا بالإنجليزية من صفحة من نحن." })} <SourceLink href={SOURCES.about} />
        </p>
      </Section>

      <Section tone="dark">
        <Eyebrow light>{tx({ en: "Milestones", ar: "المحطات" })}</Eyebrow>
        <H2>{tx({ en: "An interactive timeline", ar: "خط زمني تفاعلي" })}</H2>
        <div className="mt-12">
          <div className="relative" role="tablist" aria-label={tx({ en: "Timeline", ar: "الخط الزمني" })}>
            <div className="absolute inset-x-0 top-5 h-px bg-white/15" aria-hidden />
            <motion.div className="absolute top-5 h-px bg-ember" initial={false} animate={{ width: `${(i / (timeline.length - 1)) * 100}%` }} style={{ insetInlineStart: 0 }} aria-hidden />
            <ol className="relative flex justify-between">
              {timeline.map((x, j) => (
                <li key={x.year}>
                  <button role="tab" aria-selected={i === j} onClick={() => setI(j)} className="group flex flex-col items-center gap-3" data-testid="timeline-step">
                    <span className={clsx("grid size-10 place-items-center rounded-full border-2 transition", j <= i ? "border-ember bg-ember" : "border-white/30 bg-ink group-hover:border-white")}>
                      {j < i && <Check className="size-4" aria-hidden />}
                    </span>
                    <span className={clsx("text-sm font-semibold sm:text-lg", i === j ? "text-white" : "text-white/50")}>{x.year === "Today" ? tx({ en: "Today", ar: "اليوم" }) : x.year}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="mt-12 grid gap-8 rounded-[2rem] bg-white/[0.04] p-8 ring-1 ring-white/10 md:grid-cols-[200px_1fr]" role="tabpanel">
              <div className="text-7xl font-semibold tracking-tighter text-ember-2">{m.year === "Today" ? "→" : m.year}</div>
              <div>
                <h3 className="text-2xl font-semibold">{m.title[locale]}</h3>
                <p className="mt-3 max-w-2xl text-lg text-white/70">{m.body[locale]}</p>
                <SourceLink href={m.source} className="mt-5 !text-white/50" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>{tx({ en: "Business activities", ar: "الأنشطة" })}</Eyebrow>
            <ul className="mt-4 space-y-3">
              {company.activities.value.map((a) => (
                <li key={a} className="flex items-center gap-3 rounded-2xl bg-stone px-4 py-3">
                  <Check className="size-4 text-ok" aria-hidden /> {locale === "ar" ? activitiesAr[a] ?? a : a}
                </li>
              ))}
            </ul>
            <SourceLink href={SOURCES.about} className="mt-3" />
          </div>
          <div>
            <Eyebrow>{tx({ en: "The network in numbers", ar: "الشبكة بالأرقام" })}</Eyebrow>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                [company.rentalOffices.value, tx({ en: "rental offices", ar: "مكتب تأجير" })],
                [company.employees.value, tx({ en: "employees", ar: "موظف" })],
                ["20+", tx({ en: "airport offices in 17 cities", ar: "مكتبًا في المطارات في ١٧ مدينة" })],
                ["27", tx({ en: "cities with branch offices", ar: "مدينة بها فروع" })],
                ["20+ / 80+", tx({ en: "workshops / mobile workshops", ar: "ورشة / ورشة متنقلة" })],
                ["4", tx({ en: "major rail stations", ar: "محطات قطار رئيسية" })],
              ].map(([v, k]) => (
                <div key={k} className="rounded-2xl bg-stone p-5">
                  <dt className="text-sm text-slate">{k}</dt>
                  <dd className="text-3xl font-semibold tracking-tight">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-slate">
              {tx({ en: "Head office: Jeddah. Regional offices: Riyadh and Dammam.", ar: "المقر الرئيسي: جدة. المكاتب الإقليمية: الرياض والدمام." })} <SourceLink href={SOURCES.about} />
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

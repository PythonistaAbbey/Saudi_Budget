"use client";

import { BarChart3, CalendarDays, ExternalLink, FileText, Landmark, Leaf, Lock, Newspaper } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { company, investor, timeline, SOURCES } from "@/content/verified";
import { Badge, Card, Eyebrow, H2, Notice, PageHero, Section, SourceLink } from "@/components/ui";

export function InvestorsView() {
  const { tx, t, locale } = useI18n();
  const acq = timeline.find((x) => x.year === "2024")!;
  return (
    <>
      <PageHero eyebrow={t.nav.investors} title={tx({ en: "Investor relations, reimagined.", ar: "علاقات المستثمرين بتصوّر جديد." })} lead={tx({ en: "A concept for a clearer investor hub. It links to official sources and deliberately reproduces no financial results.", ar: "تصوّر لمركز مستثمرين أوضح. يرتبط بالمصادر الرسمية ولا يعيد نشر أي نتائج مالية عمدًا." })} />

      <Section tone="white">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [Landmark, tx({ en: "Exchange", ar: "السوق" }), tx({ en: "Saudi Exchange (Tadawul)", ar: "السوق المالية السعودية (تداول)" })],
            [BarChart3, tx({ en: "Symbol", ar: "الرمز" }), company.ticker.value],
            [CalendarDays, tx({ en: "Listed since", ar: "مدرجة منذ" }), tx({ en: "September 2007", ar: "سبتمبر ٢٠٠٧" })],
            [FileText, tx({ en: "Legal name", ar: "الاسم القانوني" }), tx({ en: "United International Transportation Co.", ar: "الشركة المتحدة الدولية للمواصلات" })],
          ].map(([Icon, k, v], i) => {
            const I = Icon as typeof Landmark;
            return (
              <Card key={i}>
                <I className="size-6 text-ember" aria-hidden />
                <div className="mt-3 text-sm text-slate">{k as string}</div>
                <div className="mt-1 text-xl font-semibold">{v as string}</div>
              </Card>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge kind="verified" />
          <SourceLink href={SOURCES.mubasher} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow>{tx({ en: "Published IR sections", ar: "أقسام علاقات المستثمرين المنشورة" })}</Eyebrow>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Card>
                <Leaf className="size-6 text-ok" aria-hidden />
                <h3 className="mt-3 text-lg font-semibold">ESG</h3>
                <p className="mt-1 text-sm text-slate">{tx({ en: "Listed as a section on the current Investor Relations page.", ar: "مدرج كقسم في صفحة علاقات المستثمرين الحالية." })}</p>
                <SourceLink href={SOURCES.ir} className="mt-4" />
              </Card>
              <Card>
                <Newspaper className="size-6 text-ember" aria-hidden />
                <h3 className="mt-3 text-lg font-semibold">{acq.title[locale]}</h3>
                <p className="mt-1 text-sm text-slate">{acq.body[locale]}</p>
                <SourceLink href={acq.source} className="mt-4" />
              </Card>
            </div>
            <h3 className="mt-10 font-semibold">{tx({ en: "Official sources for figures", ar: "المصادر الرسمية للأرقام" })}</h3>
            <ul className="mt-3 space-y-2">
              {[
                [investor.externalProfile.value, tx({ en: "Company overview on Argaam (linked from the IR page)", ar: "نظرة عامة على الشركة في أرقام (مرتبطة من صفحة المستثمرين)" })],
                [SOURCES.mubasher, tx({ en: "Company profile on Mubasher (symbol 4260)", ar: "ملف الشركة في مباشر (الرمز ٤٢٦٠)" })],
                [SOURCES.ir, tx({ en: "Current Investor Relations page", ar: "صفحة علاقات المستثمرين الحالية" })],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-soft hover:ring-1 hover:ring-ember">
                    <span className="font-medium">{label}</span>
                    <ExternalLink className="size-4 text-slate" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <Notice tone="warn">{investor.note.value}</Notice>
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{tx({ en: "Proposed IR hub features", ar: "مزايا مقترحة لمركز المستثمرين" })}</h3>
                <Badge kind="proposed" />
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  tx({ en: "Live share price from a licensed market-data feed (not connected in this prototype).", ar: "سعر السهم المباشر من مزود بيانات مرخّص (غير متصل في هذا النموذج)." }),
                  tx({ en: "Results centre: financial statements, presentations and webcasts by quarter, each linked to its Tadawul disclosure.", ar: "مركز النتائج: القوائم المالية والعروض والبث حسب الربع، مع ربط كل منها بإفصاح تداول." }),
                  tx({ en: "Financial calendar with AGM and results dates, exportable to calendar apps.", ar: "تقويم مالي بمواعيد الجمعية العامة والنتائج، قابل للتصدير إلى تطبيقات التقويم." }),
                  tx({ en: "Bilingual governance library: board, committees, policies.", ar: "مكتبة حوكمة ثنائية اللغة: مجلس الإدارة واللجان والسياسات." }),
                  tx({ en: "ESG dashboard: fleet emissions intensity, EV/hybrid share, safety metrics.", ar: "لوحة الاستدامة: كثافة انبعاثات الأسطول، نسبة الكهربائية والهجينة، مؤشرات السلامة." }),
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <Lock className="mt-0.5 size-4 shrink-0 text-slate" aria-hidden /> {x}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

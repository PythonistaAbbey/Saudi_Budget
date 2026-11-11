"use client";

import { useState } from "react";
import clsx from "clsx";
import { Building2, Car, Crown, Gauge, Mountain, ParkingCircle, Percent, Sparkles, Moon, Globe2 } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { promotions, SOURCES, type Provenance } from "@/content/verified";
import { Badge, Card, Eyebrow, H2, PageHero, Section, SourceLink } from "@/components/ui";

const ART: Record<string, { Icon: typeof Car; g: string }> = {
  alula: { Icon: Mountain, g: "from-[#c0603a] to-[#5c2c1d]" },
  unlimited: { Icon: Gauge, g: "from-navy-2 to-ink" },
  alrajhi: { Icon: Percent, g: "from-[#16325c] to-[#0e2240]" },
  moh: { Icon: Percent, g: "from-[#127a4a] to-[#0b3d27]" },
  rcu: { Icon: Mountain, g: "from-[#a85a35] to-[#3c1d12]" },
  "chauffeur-intercity": { Icon: Crown, g: "from-[#2b1f3a] to-ink" },
  "leasing-promo": { Icon: Building2, g: "from-[#3a5a8a] to-navy" },
  "used-installments": { Icon: Car, g: "from-ember to-ember-ink" },
  "ramadan-2026": { Icon: Moon, g: "from-slate-500 to-slate-700" },
};

export function PromotionsView() {
  const { tx, t } = useI18n();
  const [filter, setFilter] = useState<"all" | Provenance>("all");
  const list = promotions.filter((p) => filter === "all" || p.provenance === filter);

  return (
    <>
      <PageHero
        eyebrow={t.nav.promotions}
        title={tx({ en: "Offers, with nothing hidden.", ar: "عروض بلا شيء مخفي." })}
        lead={tx({ en: "Every offer below is published on the public promotions page. Where no validity window is published, we say so instead of implying it's active.", ar: "كل عرض أدناه منشور في صفحة العروض العامة. حيثما لا تُنشر فترة صلاحية، نوضح ذلك بدل الإيحاء بأنه سارٍ." })}
      />
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-soft" role="group" aria-label={tx({ en: "Filter offers", ar: "تصفية العروض" })}>
            {(["all", "undated", "expired"] as const).map((k) => (
              <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)} className={clsx("rounded-full px-4 py-2 text-sm font-semibold", filter === k ? "bg-ink text-white" : "text-slate")} data-testid={`promo-filter-${k}`}>
                {k === "all" ? tx({ en: "All", ar: "الكل" }) : t.badge[k]}
              </button>
            ))}
          </div>
          <SourceLink href={SOURCES.promos} />
        </div>
        <p className="mt-4 text-sm text-slate">{tx({ en: "Offer titles and terms are shown in the original English as published.", ar: "تظهر عناوين العروض وشروطها بالإنجليزية كما نُشرت." })}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-testid="promo-grid">
          {list.map((p) => {
            const a = ART[p.id] ?? { Icon: Sparkles, g: "from-navy to-ink" };
            return (
              <article key={p.id} className={clsx("flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft", p.provenance === "expired" && "opacity-80")} data-testid="promo-card" data-status={p.provenance}>
                <div className={clsx("grain relative flex h-40 items-end bg-gradient-to-br p-5 text-white", a.g)}>
                  <a.Icon className="absolute end-5 top-5 size-16 opacity-25" aria-hidden />
                  <Badge kind={p.provenance} className="!bg-white/90" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold" lang="en" dir="ltr">
                    {p.title}
                  </h2>
                  {p.detail && (
                    <p className="mt-2 text-sm text-slate" lang="en" dir="ltr">
                      {p.detail}
                    </p>
                  )}
                  {p.validity && (
                    <p className="mt-3 text-sm font-semibold text-bad">
                      {tx({ en: "Published validity:", ar: "الصلاحية المنشورة:" })} {p.validity}
                    </p>
                  )}
                  <SourceLink href={p.source} className="mt-auto pt-5" />
                </div>
              </article>
            );
          })}
          <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="grain relative flex h-40 items-end bg-gradient-to-br from-slate-600 to-slate-800 p-5 text-white">
              <ParkingCircle className="absolute end-5 top-5 size-16 opacity-25" aria-hidden />
              <Badge kind="undated" className="!bg-white/90" />
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold">MAKAN Parking Service</h2>
              <p className="mt-2 text-sm text-slate">{tx({ en: "Listed on the promotions page with no further detail.", ar: "مدرج في صفحة العروض دون تفاصيل إضافية." })}</p>
              <SourceLink href={SOURCES.promos} className="mt-5" />
            </div>
          </article>
          <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="grain relative flex h-40 items-end bg-gradient-to-br from-[#0e2240] to-[#16325c] p-5 text-white">
              <Globe2 className="absolute end-5 top-5 size-16 opacity-25" aria-hidden />
              <Badge kind="undated" className="!bg-white/90" />
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold">Budget UAE Promotion</h2>
              <SourceLink href="https://www.budgetsaudi.com/en/promotions/Budget-UAE-2024--EN" className="mt-5" />
            </div>
          </article>
        </div>
      </Section>
      <Section tone="white">
        <Eyebrow>{tx({ en: "Proposed", ar: "مقترح" })}</Eyebrow>
        <H2 className="!text-3xl">{tx({ en: "How offers could work on the new platform", ar: "كيف يمكن أن تعمل العروض في المنصة الجديدة" })}</H2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [tx({ en: "Always dated", ar: "مؤرخة دائمًا" }), tx({ en: "Every offer carries a start and end date; expired offers move to an archive automatically.", ar: "كل عرض له تاريخ بداية ونهاية؛ تنتقل العروض المنتهية إلى الأرشيف تلقائيًا." })],
            [tx({ en: "Eligibility check", ar: "التحقق من الأهلية" })
              , tx({ en: "Employer offers verified via corporate email or code, then applied at checkout.", ar: "يُتحقق من عروض جهات العمل عبر البريد المؤسسي أو رمز، ثم تُطبَّق عند الدفع." })],
            [tx({ en: "Price shown up front", ar: "السعر واضح مسبقًا" }), tx({ en: "The discount appears as its own line in the price breakdown — like the demo promo code in booking.", ar: "يظهر الخصم كبند مستقل في تفاصيل السعر — مثل رمز الخصم التجريبي في الحجز." })],
          ].map(([h, b]) => (
            <Card key={h}>
              <Badge kind="proposed" />
              <h3 className="mt-3 font-semibold">{h}</h3>
              <p className="mt-1 text-sm text-slate">{b}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

"use client";

import { Sparkles, Cpu, ShieldCheck, Languages } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { ConciergeChat } from "@/components/Concierge";
import { Badge } from "@/components/ui";

export function ConciergeView() {
  const { tx } = useI18n();
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-ember to-ember-ink">
            <Sparkles className="size-7" aria-hidden />
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">{tx({ en: "Mobility Concierge", ar: "مساعد التنقّل" })}</h1>
          <p className="mt-4 max-w-lg text-lg text-white/70">{tx({ en: "Describe your trip in English or Arabic. The concierge extracts cities, dates, group size and terrain, ranks matching vehicles and hands you a pre-filled booking.", ar: "صف رحلتك بالعربية أو الإنجليزية. يستخرج المساعد المدن والمدة وعدد الأشخاص ونوع الطريق، ويرتّب السيارات المناسبة، ويجهّز لك الحجز." })}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge kind="proposed" />
            <Badge kind="prototype" />
          </div>
          <ul className="mt-10 space-y-5">
            {[
              [Cpu, tx({ en: "Deterministic for the prototype", ar: "منطق محدد في النموذج" }), tx({ en: "Rule-based intent parsing and scoring over the mock inventory — predictable for demos and testable.", ar: "تحليل نوايا قائم على القواعد وتقييم على المخزون التجريبي — قابل للتوقع والاختبار." })],
              [Languages, tx({ en: "Bilingual from day one", ar: "ثنائي اللغة من البداية" })
                , tx({ en: "Understands Arabic and English place names, numbers in either script, and common Gulf phrasing like “كشتة”.", ar: "يفهم أسماء الأماكن بالعربية والإنجليزية والأرقام بالصيغتين وعبارات خليجية شائعة مثل «كشتة»." })],
              [ShieldCheck, tx({ en: "Production path", ar: "مسار الإنتاج" }), tx({ en: "Swap the parser for an LLM with tool-calls to the inventory API; keep guardrails so it never invents prices or availability.", ar: "استبدال المحلل بنموذج لغوي يستدعي واجهة المخزون، مع ضوابط تمنعه من اختلاق الأسعار أو التوفر." })],
            ].map(([I, h, b]) => {
              const Icon = I as typeof Cpu;
              return (
                <li key={h as string} className="flex gap-4">
                  <Icon className="mt-1 size-5 shrink-0 text-ember-2" aria-hidden />
                  <div>
                    <div className="font-semibold">{h as string}</div>
                    <p className="text-sm text-white/60">{b as string}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex h-[min(720px,80vh)] flex-col overflow-hidden rounded-[2rem] bg-white text-ink shadow-lift">
          <ConciergeChat />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, Send, X, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { useI18n } from "@/i18n/client";
import { parseIntent, recommend, type Intent, type Recommendation } from "@/lib/concierge";
import { findCity, branchesForCity } from "@/data/branches";
import { defaultTrip, toDateInput } from "@/lib/dates";
import { CarArt } from "./CarArt";
import { L } from "./ui";
import { tripToQuery } from "./SearchWidget";

type Msg = { role: "user" | "bot"; text: string; recs?: Recommendation[]; intent?: Intent };

const REASONS = {
  r_category: { en: "Matches the type of car you asked for", ar: "يطابق نوع السيارة الذي طلبته" },
  r_seats: { en: "Seats everyone in your group", ar: "يتسع لجميع أفراد مجموعتك" },
  r_luggage: { en: "Room for family luggage", ar: "مساحة كافية لأمتعة العائلة" },
  r_comfort: { en: "Comfort features for long hours on the road", ar: "مزايا راحة للساعات الطويلة على الطريق" },
  r_4wd: { en: "4WD/AWD for sand and rough tracks", ar: "دفع رباعي للرمال والطرق الوعرة" },
  r_range: { en: "Efficient over long distances, generous daily km", ar: "اقتصادية للمسافات الطويلة مع كيلومترات يومية سخية" },
  r_value: { en: "Strong value for this trip", ar: "قيمة ممتازة لهذه الرحلة" },
} as const;

export const SUGGESTIONS = [
  { en: "I need a comfortable SUV for a family trip from Riyadh to AlUla for five days", ar: "أحتاج سيارة SUV مريحة لرحلة عائلية من الرياض إلى العلا لمدة خمسة أيام" },
  { en: "Cheapest automatic car in Jeddah for 3 days", ar: "أرخص سيارة أوتوماتيك في جدة لمدة ٣ أيام" },
  { en: "Luxury car for a wedding in Riyadh this weekend", ar: "سيارة فاخرة لحفل زواج في الرياض نهاية الأسبوع" },
  { en: "Desert camping trip from Dammam, 4 people, one week", ar: "رحلة كشتة في الصحراء من الدمام، ٤ أشخاص، أسبوع" },
];

export function useConcierge() {
  const { locale, tx } = useI18n();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: tx({
        en: "Marhaba! Tell me about your trip — where you're starting, where you're heading, how many people and for how long — and I'll suggest the right vehicle.",
        ar: "مرحبًا! أخبرني عن رحلتك — من أين تبدأ، وإلى أين تتجه، وكم عدد الأشخاص والمدة — وسأقترح عليك السيارة المناسبة.",
      }),
    },
  ]);
  const [thinking, setThinking] = useState(false);

  function ask(q: string) {
    const text = q.trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setThinking(true);
    setTimeout(() => {
      const intent = parseIntent(text);
      const recs = recommend(intent);
      const parts: string[] = [];
      const city = intent.pickupCity ? findCity(intent.pickupCity) : undefined;
      const dest = intent.destination ? findCity(intent.destination) : undefined;
      const name = (c?: { name: string; nameAr: string }) => (c ? (locale === "ar" ? c.nameAr : c.name) : "");
      if (locale === "ar") {
        parts.push("فهمت:");
        if (city) parts.push(`الاستلام من ${name(city)}`);
        if (dest) parts.push(`الوجهة ${name(dest)}`);
        if (intent.days) parts.push(`${intent.days} أيام`);
        if (intent.passengers) parts.push(`${intent.passengers} أشخاص`);
        if (intent.wantsOffroad) parts.push("طرق رملية أو وعرة");
        if (parts.length === 1) parts.push("سأقترح خيارات متوازنة.");
      } else {
        parts.push("Here's what I understood:");
        if (city) parts.push(`pick-up in ${name(city)}`);
        if (dest) parts.push(`heading to ${name(dest)}`);
        if (intent.days) parts.push(`${intent.days} days`);
        if (intent.passengers) parts.push(`${intent.passengers} people`);
        if (intent.wantsOffroad) parts.push("sand or rough tracks");
        if (parts.length === 1) parts.push("I'll suggest well-balanced options.");
      }
      let reply = parts[0] + " " + parts.slice(1).join(locale === "ar" ? "، " : ", ") + ".";
      if (dest && (intent.destination === "alula" || intent.longDistance)) {
        reply += tx({
          en: " For long desert highways I'd favour comfort, generous daily kilometres and a full-size boot.",
          ar: " للطرق الصحراوية الطويلة أنصح بالراحة وكيلومترات يومية سخية وصندوق أمتعة واسع.",
        });
      }
      if (city && dest && city.id !== dest.id) {
        reply += tx({ en: " Returning to a different city would add a one-way fee in this demo.", ar: " التسليم في مدينة أخرى يضيف رسوم اتجاه واحد في هذا العرض." });
      }
      setMsgs((m) => [...m, { role: "bot", text: reply, recs, intent }]);
      setThinking(false);
    }, 650);
  }
  return { msgs, ask, thinking };
}

function bookingQuery(intent: Intent | undefined, vehicleId: string) {
  const d = defaultTrip();
  const city = intent?.pickupCity ?? "riyadh";
  const pb = branchesForCity(city)[0].id;
  const r = new Date();
  r.setDate(r.getDate() + 1 + (intent?.days ?? 3));
  const trip = { city, pb, rcity: city, rb: pb, pd: d.pd, pt: "10:00", rd: toDateInput(r), rt: "10:00", age: "25" as const, cat: "" };
  return `${tripToQuery(trip)}&vehicle=${vehicleId}`;
}

export function ConciergeChat({ compact = false }: { compact?: boolean }) {
  const { msgs, ask, thinking } = useConcierge();
  const { tx, locale, money, t } = useI18n();
  const [q, setQ] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, thinking]);

  return (
    <div className="flex h-full flex-col" data-testid="concierge">
      <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={clsx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={clsx("max-w-[92%] rounded-2xl px-4 py-3 text-sm", m.role === "user" ? "rounded-ee-sm bg-ember text-white" : "rounded-es-sm bg-stone text-ink")}>
              <p>{m.text}</p>
              {m.recs && (
                <ul className="mt-3 space-y-2" data-testid="concierge-recs">
                  {m.recs.map((r) => (
                    <li key={r.vehicle.id} className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-soft">
                      <CarArt body={r.vehicle.body} color={r.vehicle.color} className="w-20 shrink-0" shadow={false} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold">{r.vehicle.model}</span>
                          <span className="shrink-0 text-xs font-semibold">{money(r.vehicle.dailyRate)}{t.v.perDay}</span>
                        </div>
                        <p className="text-xs text-slate">{tx(REASONS[r.reasons[0] as keyof typeof REASONS] ?? REASONS.r_value)}</p>
                        <L href={`/booking?${bookingQuery(m.intent, r.vehicle.id)}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-ember-ink hover:underline">
                          {tx({ en: "Book this", ar: "احجز هذه" })} <ArrowUpRight className="rtl-flip size-3" aria-hidden />
                        </L>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-1 px-2" aria-label={tx({ en: "Thinking", ar: "جارٍ التفكير" })}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 animate-bounce rounded-full bg-slate/50" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
        <div ref={end} />
      </div>
      {msgs.length < 2 && (
        <div className={clsx("flex gap-2 overflow-x-auto px-4 pb-2", !compact && "flex-wrap")}>
          {SUGGESTIONS.map((s) => (
            <button key={s.en} onClick={() => ask(s[locale])} className="shrink-0 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-start text-xs hover:border-ember" data-testid="concierge-suggestion">
              {s[locale]}
            </button>
          ))}
        </div>
      )}
      <form
        className="flex gap-2 border-t border-ink/8 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
          setQ("");
        }}
      >
        <label className="sr-only" htmlFor={`cq-${compact ? "w" : "p"}`}>
          {tx({ en: "Describe your trip", ar: "صف رحلتك" })}
        </label>
        <input id={`cq-${compact ? "w" : "p"}`} value={q} onChange={(e) => setQ(e.target.value)} className="field !rounded-full" placeholder={tx({ en: "e.g. 7-seater from Jeddah to Taif for 4 days", ar: "مثال: ٧ مقاعد من جدة إلى الطائف لمدة ٤ أيام" })} data-testid="concierge-input" maxLength={300} />
        <button type="submit" className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white hover:bg-navy" aria-label={tx({ en: "Send", ar: "إرسال" })} data-testid="concierge-send">
          <Send className="rtl-flip size-4" />
        </button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-slate">
        {tx({ en: "Prototype assistant: deterministic matching on simulated inventory. No AI service or personal data is used.", ar: "مساعد تجريبي: مطابقة محددة على مخزون محاكى. لا تُستخدم خدمة ذكاء اصطناعي أو بيانات شخصية." })}
      </p>
    </div>
  );
}

export function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const { t, tx } = useI18n();
  const pathname = usePathname();
  if (pathname.endsWith("/concierge") || pathname.includes("/admin")) return null;
  return (
    <div className="no-print">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-label={t.nav.concierge}
            className="fixed bottom-24 end-4 z-40 flex h-[min(620px,75vh)] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-lift"
          >
            <div className="flex items-center justify-between bg-ink px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-ember to-ember-ink">
                  <Sparkles className="size-4" aria-hidden />
                </span>
                <div>
                  <div className="text-sm font-semibold">{tx({ en: "Mobility Concierge", ar: "مساعد التنقّل" })}</div>
                  <div className="text-[11px] text-white/60">{t.badge.prototype}</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label={t.close}>
                <X className="size-4" />
              </button>
            </div>
            <ConciergeChat compact />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((x) => !x)}
        aria-expanded={open}
        className="fixed bottom-5 end-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-ember to-ember-ink px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgb(244_123_32/0.8)] transition hover:scale-[1.03]"
        data-testid="concierge-open"
      >
        <Sparkles className="size-4" aria-hidden />
        <span className="hidden sm:inline">{tx({ en: "Ask the concierge", ar: "اسأل المساعد" })}</span>
      </button>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { AlertTriangle, BookOpen, CarFront, ChevronDown, CircleDot, Headset, LifeBuoy, Phone, Search, ShieldAlert, Ticket, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { contact, helpTopics, homeClaims, leasing, loyaltyTiers, quickPass, SOURCES } from "@/content/verified";
import { Badge, Field, SourceLink, btn } from "@/components/ui";

interface Faq {
  cat: "booking" | "on-road" | "account" | "business";
  q: { en: string; ar: string };
  a: { en: string; ar: string };
  source?: string;
}

const FAQS: Faq[] = [
  { cat: "booking", q: { en: "What number do I call to make or change a reservation?", ar: "ما الرقم الذي أتصل به لإجراء حجز أو تعديله؟" }, a: { en: `Reservations: ${contact.reservations.value}, Saturday–Thursday 09:00–22:00 and Friday 17:00–22:00.`, ar: `الحجوزات: ${contact.reservations.value}، من السبت إلى الخميس ٠٩:٠٠–٢٢:٠٠ والجمعة ١٧:٠٠–٢٢:٠٠.` }, source: SOURCES.contact },
  { cat: "booking", q: { en: "Can I cancel my booking?", ar: "هل يمكنني إلغاء حجزي؟" }, a: { en: `The homepage advertises: “${homeClaims.freeCancellation.value}”. Exact refund conditions are governed by the booking terms for your rental country.`, ar: "تعلن الصفحة الرئيسية عن إلغاء مجاني وبلا تعقيد. شروط الاسترداد الدقيقة تحكمها شروط الحجز في بلد الإيجار." }, source: SOURCES.home },
  { cat: "booking", q: { en: "What extras can I add?", ar: "ما الإضافات التي يمكنني إضافتها؟" }, a: { en: `Published extras include ${homeClaims.extras.value.join(", ")}. You pay only for what you select.`, ar: "تشمل الإضافات المنشورة: السائق الإضافي، والتسليم في مدينة أخرى، والملاحة GPS، والواي فاي المتنقل. تدفع فقط مقابل ما تختاره." }, source: SOURCES.home },
  { cat: "booking", q: { en: "How old do I need to be to rent?", ar: "كم يجب أن يكون عمري للاستئجار؟" }, a: { en: "The public booking form asks you to confirm the driver is aged over 21, and the loyalty programme requires members to be at least 21 with a valid Saudi driving licence. Check the booking terms for category-specific rules.", ar: "يطلب نموذج الحجز العام تأكيد أن عمر السائق فوق ٢١ عامًا، ويشترط برنامج الولاء ألا يقل عمر العضو عن ٢١ عامًا مع رخصة قيادة سعودية سارية. راجع شروط الحجز للقواعد الخاصة بكل فئة." }, source: SOURCES.home },
  { cat: "on-road", q: { en: "I've broken down. Who do I call?", ar: "تعطلت سيارتي. بمن أتصل؟" }, a: { en: `24-hour roadside assistance: ${contact.roadside.value} — open 24 hours a day, 7 days a week.`, ar: `المساعدة على الطريق على مدار الساعة: ${contact.roadside.value} — طوال أيام الأسبوع.` }, source: SOURCES.contact },
  { cat: "on-road", q: { en: "What is Quick Pass at the airport?", ar: "ما هو المسار السريع في المطار؟" }, a: { en: `${quickPass.what.value}. Available at Riyadh, Jeddah and Dammam airports, subject to airport regulations and operational availability.`, ar: "مسار سريع في المطار لعملاء الشركات والفئتين الذهبية والبلاتينية مجانًا، في مطارات الرياض وجدة والدمام، وفقًا لأنظمة المطار والتوفر التشغيلي." }, source: SOURCES.quickpass },
  { cat: "account", q: { en: "How do loyalty points work?", ar: "كيف تعمل نقاط الولاء؟" }, a: { en: "Earn one point for every SAR 100 spent; points do not expire and are redeemed in slabs of 50, 100, 200 or 500 at Saudi locations. Tiers: Silver (3%), Gold (7%), Platinum (12%) off the walk-in rate.", ar: "اكسب نقطة لكل ١٠٠ ريال؛ النقاط لا تنتهي وتُستبدل بشرائح ٥٠ أو ١٠٠ أو ٢٠٠ أو ٥٠٠ في فروع المملكة. الفئات: فضية (٣٪) وذهبية (٧٪) وبلاتينية (١٢٪) خصمًا على السعر المباشر." }, source: loyaltyTiers.source },
  { cat: "account", q: { en: "How long does it take to resolve a post-rental query?", ar: "كم يستغرق حل استفسار ما بعد الإيجار؟" }, a: { en: `The contact page states queries are resolved within ${contact.resolutionWindow.value}. Email ${contact.email.value}.`, ar: `تذكر صفحة التواصل أن الاستفسارات تُحل خلال ٥ إلى ٣٠ يومًا. راسل ${contact.email.value}.` }, source: SOURCES.contact },
  { cat: "business", q: { en: "Can leased vehicles be driven outside Saudi Arabia?", ar: "هل يمكن قيادة السيارات المؤجرة خارج المملكة؟" }, a: { en: `${leasing.crossBorder.value}.`, ar: "يمكن قيادة سيارات التأجير في الشرق الأوسط بعد دفع التأمين المطلوب وفق أنظمة ذلك البلد." }, source: SOURCES.leasing },
  { cat: "business", q: { en: "Is maintenance included in corporate leases?", ar: "هل الصيانة مشمولة في عقود الشركات؟" }, a: { en: `${leasing.maintenance.value}. ${leasing.towing.value}.`, ar: "الصيانة الدورية مشمولة؛ أول صيانة عند ٥٠٠٠ كم ثم كل ١٥٠٠٠ كم (بنزين) أو ١٤٠٠٠ كم (ديزل). سحب مجاني ضمن ٣٥٠ كم من أي مكتب." }, source: SOURCES.leasing },
  { cat: "booking", q: { en: "What documents should I bring?", ar: "ما المستندات التي يجب إحضارها؟" }, a: { en: "General guidance only: a valid driving licence, ID (national ID, Iqama or passport) and a payment card. Requirements vary — confirm with the operator before you travel. This prototype never collects documents.", ar: "إرشاد عام فقط: رخصة قيادة سارية، وهوية (هوية وطنية أو إقامة أو جواز سفر)، وبطاقة دفع. تختلف المتطلبات — تأكد من المشغّل قبل السفر. لا يجمع هذا النموذج أي مستندات." } },
];

const TICKETS: Record<string, { status: number; subject: { en: string; ar: string } }> = {
  "TCK-1001": { status: 2, subject: { en: "Deposit refund after return", ar: "استرداد مبلغ التأمين بعد الإعادة" } },
  "TCK-1002": { status: 3, subject: { en: "Invoice copy request", ar: "طلب نسخة من الفاتورة" } },
};

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  topic: z.enum(["booking", "billing", "damage", "feedback", "other"]),
  ref: z.string().trim().max(20).optional(),
  message: z.string().trim().min(10).max(1000),
});

export function SupportView() {
  const { tx, t, locale } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Faq["cat"] | "all">("all");
  const [open, setOpen] = useState<number | null>(0);
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState<(typeof TICKETS)[string] | null | undefined>(undefined);
  const [created, setCreated] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: "onTouched", defaultValues: { topic: "booking" } });

  const faqs = useMemo(() => {
    const s = q.trim().toLowerCase();
    return FAQS.map((f, i) => ({ ...f, i })).filter((f) => (cat === "all" || f.cat === cat) && (!s || (f.q[locale] + " " + f.a[locale]).toLowerCase().includes(s)));
  }, [q, cat, locale]);

  const catLabel = { all: tx({ en: "All", ar: "الكل" }), booking: tx({ en: "Booking", ar: "الحجز" }), "on-road": tx({ en: "On the road", ar: "على الطريق" }), account: tx({ en: "Account & loyalty", ar: "الحساب والولاء" }), business: tx({ en: "Business", ar: "الأعمال" }) };
  const steps = [tx({ en: "Received", ar: "مستلم" }), tx({ en: "Assigned", ar: "مُسند" }), tx({ en: "In progress", ar: "قيد المعالجة" }), tx({ en: "Resolved", ar: "تم الحل" })];

  return (
    <div className="bg-stone">
      <header className="grain relative overflow-hidden bg-ink px-4 pb-24 pt-14 text-white sm:px-6">
        <div className="relative mx-auto max-w-3xl text-center">
          <LifeBuoy className="mx-auto size-10 text-ember-2" aria-hidden />
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{tx({ en: "How can we help?", ar: "كيف يمكننا المساعدة؟" })}</h1>
          <label className="relative mx-auto mt-8 block max-w-xl">
            <span className="sr-only">{tx({ en: "Search help", ar: "ابحث في المساعدة" })}</span>
            <Search className="pointer-events-none absolute start-5 top-1/2 size-5 -translate-y-1/2 text-slate" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx({ en: "Search: cancel, roadside, loyalty…", ar: "ابحث: إلغاء، مساعدة على الطريق، الولاء…" })} className="w-full rounded-full bg-white py-4 pe-5 ps-14 text-ink shadow-lift outline-none focus:ring-4 focus:ring-ember/40" data-testid="faq-search" />
          </label>
        </div>
      </header>

      <div className="mx-auto -mt-12 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <a href="tel:8002443399" className="flex items-center gap-4 rounded-3xl bg-bad p-6 text-white shadow-lift transition hover:brightness-110" data-testid="roadside-card">
            <ShieldAlert className="size-10 shrink-0" aria-hidden />
            <div>
              <div className="text-sm font-semibold opacity-90">{tx({ en: "24h roadside assistance", ar: "المساعدة على الطريق ٢٤ ساعة" })}</div>
              <div className="text-3xl font-semibold" dir="ltr">
                {contact.roadside.value}
              </div>
              <div className="text-xs opacity-80">{tx({ en: "In an emergency, call 911 first.", ar: "في حالات الطوارئ اتصل بالرقم ٩١١ أولًا." })}</div>
            </div>
          </a>
          <a href={`tel:${contact.reservations.value}`} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-soft hover:ring-1 hover:ring-ember">
            <Phone className="size-8 shrink-0 text-ember" aria-hidden />
            <div>
              <div className="text-sm text-slate">{tx({ en: "Reservations", ar: "الحجوزات" })}</div>
              <div className="text-2xl font-semibold" dir="ltr">
                {contact.reservations.value}
              </div>
            </div>
          </a>
          <a href={`mailto:${contact.email.value}`} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-soft hover:ring-1 hover:ring-ember">
            <Headset className="size-8 shrink-0 text-ember" aria-hidden />
            <div>
              <div className="text-sm text-slate">{tx({ en: "Customer care", ar: "خدمة العملاء" })}</div>
              <div className="text-lg font-semibold">{contact.email.value}</div>
            </div>
          </a>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate">
          <Badge kind="verified" /> <SourceLink href={SOURCES.contact} />
          <span>{tx({ en: "911 is Saudi Arabia's unified emergency number.", ar: "٩١١ هو رقم الطوارئ الموحد في المملكة." })}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_400px]">
        <section aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-2xl font-semibold tracking-tight">
            {tx({ en: "Frequently asked questions", ar: "الأسئلة الشائعة" })}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2" role="group">
            {(["all", "booking", "on-road", "account", "business"] as const).map((k) => (
              <button key={k} aria-pressed={cat === k} onClick={() => setCat(k)} className={clsx("rounded-full px-4 py-2 text-sm font-semibold", cat === k ? "bg-ink text-white" : "bg-white text-slate shadow-soft")}>
                {catLabel[k]}
              </button>
            ))}
          </div>
          <ul className="mt-6 space-y-3" data-testid="faq-list">
            {faqs.length === 0 && <li className="rounded-2xl bg-white p-6 text-slate">{tx({ en: "No answers match. Try another word or contact us.", ar: "لا توجد إجابات مطابقة. جرّب كلمة أخرى أو تواصل معنا." })}</li>}
            {faqs.map((f) => (
              <li key={f.i} className="overflow-hidden rounded-2xl bg-white shadow-soft" data-testid="faq-item">
                <button onClick={() => setOpen(open === f.i ? null : f.i)} aria-expanded={open === f.i} className="flex w-full items-center justify-between gap-4 p-5 text-start font-semibold">
                  {f.q[locale]}
                  <ChevronDown className={clsx("size-5 shrink-0 transition", open === f.i && "rotate-180")} aria-hidden />
                </button>
                {open === f.i && (
                  <div className="px-5 pb-5 text-sm text-slate">
                    <p>{f.a[locale]}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {f.source ? (
                        <>
                          <Badge kind="verified" /> <SourceLink href={f.source} />
                        </>
                      ) : (
                        <Badge kind="proposed" />
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 text-2xl font-semibold tracking-tight">{tx({ en: "Help topics", ar: "مواضيع المساعدة" })}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              [CarFront, tx({ en: "Hiring a vehicle", ar: "استئجار سيارة" }), helpTopics.value.hiring],
              [BookOpen, tx({ en: "Motoring advice", ar: "نصائح القيادة" }), helpTopics.value.motoring],
            ].map(([Icon, title, items]) => {
              const I = Icon as typeof CarFront;
              return (
                <div key={title as string} className="rounded-2xl bg-white p-5 shadow-soft">
                  <I className="size-6 text-ember" aria-hidden />
                  <h3 className="mt-3 font-semibold">{title as string}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate" lang="en">
                    {(items as string[]).map((x) => (
                      <li key={x} className="flex items-center gap-2">
                        <CircleDot className="size-3" aria-hidden /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <SourceLink href={helpTopics.source} className="mt-3" />
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-soft" aria-labelledby="track-h">
            <h2 id="track-h" className="flex items-center gap-2 font-semibold">
              <Ticket className="size-5 text-ember" aria-hidden /> {tx({ en: "Track a support ticket", ar: "تتبّع تذكرة دعم" })}
            </h2>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const id = ticketId.trim().toUpperCase();
                setTicket(TICKETS[id] ?? (created && id === created ? { status: 0, subject: { en: "Your new request", ar: "طلبك الجديد" } } : null));
              }}
            >
              <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} className="field" placeholder="TCK-1001" dir="ltr" aria-label={tx({ en: "Ticket number", ar: "رقم التذكرة" })} data-testid="ticket-id" />
              <button className={btn.dark} data-testid="ticket-track">
                {tx({ en: "Track", ar: "تتبّع" })}
              </button>
            </form>
            <p className="mt-2 text-xs text-slate">{tx({ en: "Try TCK-1001 or TCK-1002 (synthetic).", ar: "جرّب TCK-1001 أو TCK-1002 (اصطناعية)." })}</p>
            {ticket === null && (
              <p className="mt-3 flex items-center gap-2 text-sm text-bad" role="status">
                <AlertTriangle className="size-4" aria-hidden /> {tx({ en: "Ticket not found.", ar: "لم يتم العثور على التذكرة." })}
              </p>
            )}
            {ticket && (
              <div className="mt-4" data-testid="ticket-status">
                <div className="font-semibold">{ticket.subject[locale]}</div>
                <ol className="mt-3 space-y-2">
                  {steps.map((s, i) => (
                    <li key={s} className={clsx("flex items-center gap-2 text-sm", i <= ticket.status ? "text-ink" : "text-slate/60")}>
                      <span className={clsx("size-3 rounded-full", i < ticket.status ? "bg-ok" : i === ticket.status ? "bg-ember ring-4 ring-ember/20" : "bg-mist")} />
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-soft" aria-labelledby="contact-h">
            <h2 id="contact-h" className="font-semibold">
              {tx({ en: "Contact form", ar: "نموذج التواصل" })}
            </h2>
            {created ? (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-950" role="status" data-testid="ticket-created">
                <CheckCircle2 className="size-6 text-ok" aria-hidden />
                <p className="mt-2 font-semibold">{t.form.sentDemo}</p>
                <p className="mt-1">
                  {tx({ en: "Demo ticket:", ar: "تذكرة تجريبية:" })} <span className="font-mono font-bold">{created}</span>
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={form.handleSubmit(() => setCreated(`TCK-${2000 + Math.floor(Math.random() * 7999)}`))} className="mt-4 space-y-3" data-testid="support-form">
                <Field id="s-name" label={t.form.name} error={form.formState.errors.name && t.form.required}>
                  <input id="s-name" className="field" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
                </Field>
                <Field id="s-email" label={t.form.email} error={form.formState.errors.email && t.form.invalidEmail}>
                  <input id="s-email" dir="ltr" className="field" {...form.register("email")} aria-invalid={!!form.formState.errors.email} />
                </Field>
                <Field id="s-topic" label={tx({ en: "Topic", ar: "الموضوع" })}>
                  <select id="s-topic" className="field" {...form.register("topic")}>
                    <option value="booking">{tx({ en: "Booking", ar: "الحجز" })}</option>
                    <option value="billing">{tx({ en: "Billing & refunds", ar: "الفواتير والاسترداد" })}</option>
                    <option value="damage">{tx({ en: "Damage or accident", ar: "ضرر أو حادث" })}</option>
                    <option value="feedback">{tx({ en: "Feedback", ar: "ملاحظات" })}</option>
                    <option value="other">{tx({ en: "Other", ar: "أخرى" })}</option>
                  </select>
                </Field>
                <Field id="s-ref" label={tx({ en: "Booking reference (optional)", ar: "رقم الحجز (اختياري)" })}>
                  <input id="s-ref" dir="ltr" className="field" {...form.register("ref")} />
                </Field>
                <Field id="s-msg" label={t.form.message} error={form.formState.errors.message && tx({ en: "Please write at least 10 characters.", ar: "يرجى كتابة ١٠ أحرف على الأقل." })}>
                  <textarea id="s-msg" rows={4} className="field" {...form.register("message")} aria-invalid={!!form.formState.errors.message} />
                </Field>
                <button className={clsx(btn.primary, "w-full")} data-testid="support-submit">
                  {t.form.submit}
                </button>
                <p className="text-[11px] text-slate">{tx({ en: "Demo only: nothing is sent or stored. Do not enter real personal data.", ar: "للعرض فقط: لا يُرسل أو يُخزَّن شيء. لا تُدخل بيانات شخصية حقيقية." })}</p>
              </form>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

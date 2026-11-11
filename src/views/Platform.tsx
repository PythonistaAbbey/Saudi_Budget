"use client";

import clsx from "clsx";
import { AlertTriangle, CheckCircle2, CircleDashed, Scale } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { Card, Eyebrow, H2, PageHero, Section } from "@/components/ui";

type Status = "prototype" | "designed" | "production";

export function PlatformView() {
  const { tx } = useI18n();
  const statusMeta: Record<Status, { cls: string; label: string; Icon: typeof CheckCircle2 }> = {
    prototype: { cls: "bg-emerald-50 text-emerald-800", label: tx({ en: "In this prototype", ar: "في هذا النموذج" }), Icon: CheckCircle2 },
    designed: { cls: "bg-sky-50 text-sky-800", label: tx({ en: "Designed, not built", ar: "مصمَّم وغير منفّذ" }), Icon: CircleDashed },
    production: { cls: "bg-amber-50 text-amber-900", label: tx({ en: "Production requirement", ar: "متطلب للإنتاج" }), Icon: AlertTriangle },
  };

  const controls: { area: string; items: [string, Status][] }[] = [
    {
      area: tx({ en: "Identity & access", ar: "الهوية والصلاحيات" }),
      items: [
        [tx({ en: "OIDC sign-in with MFA (e.g. Nafath for Saudi citizens & residents, passkeys for others)", ar: "تسجيل دخول OIDC مع تحقق متعدد (مثل نفاذ للمواطنين والمقيمين، ومفاتيح المرور للآخرين)" }), "designed"],
        [tx({ en: "Role-based access: customer, fleet admin, driver, finance, CMS editor, administrator", ar: "صلاحيات حسب الدور: عميل، مسؤول أسطول، سائق، مالية، محرر، مسؤول" }), "prototype"],
        [tx({ en: "Short-lived, HttpOnly, Secure, SameSite session cookies with rotation", ar: "ملفات جلسة قصيرة العمر HttpOnly وSecure وSameSite مع التدوير" }), "production"],
      ],
    },
    {
      area: tx({ en: "Application security (OWASP Top 10)", ar: "أمن التطبيقات (OWASP Top 10)" }),
      items: [
        [tx({ en: "Schema validation on every form (Zod) — mirrored server-side in production", ar: "تحقق المخطط في كل نموذج (Zod) — مع تكراره على الخادم في الإنتاج" }), "prototype"],
        [tx({ en: "Security headers: nosniff, frame-deny, referrer & permissions policy", ar: "ترويسات الأمان: nosniff ومنع الإطارات وسياسات المُحيل والأذونات" }), "prototype"],
        [tx({ en: "Strict Content-Security-Policy with nonces", ar: "سياسة أمان محتوى صارمة مع nonces" }), "production"],
        [tx({ en: "CSRF protection, rate limiting and bot defence on booking & login", ar: "حماية CSRF وتحديد المعدل والحماية من الروبوتات في الحجز والدخول" }), "production"],
        [tx({ en: "Dependency scanning, SAST and authorised penetration testing before launch", ar: "فحص الاعتماديات والتحليل الثابت واختبار اختراق مصرّح به قبل الإطلاق" }), "production"],
      ],
    },
    {
      area: tx({ en: "Data & privacy (PDPL)", ar: "البيانات والخصوصية (نظام حماية البيانات الشخصية)" }),
      items: [
        [tx({ en: "No real personal data, payments or ID documents collected", ar: "لا تُجمع بيانات شخصية حقيقية أو مدفوعات أو مستندات هوية" }), "prototype"],
        [tx({ en: "Data minimisation: only fields needed for the rental; explicit, withdrawable marketing consent", ar: "تقليل البيانات: الحقول اللازمة فقط؛ موافقة تسويقية صريحة قابلة للسحب" }), "prototype"],
        [tx({ en: "Data residency in-Kingdom, encryption at rest (KMS) and TLS 1.2+ in transit", ar: "إقامة البيانات داخل المملكة، والتشفير أثناء التخزين (KMS) وTLS 1.2+ أثناء النقل" }), "production"],
        [tx({ en: "PDPL compliance review, records of processing, DPIA and data-subject request workflow", ar: "مراجعة الامتثال لنظام حماية البيانات، وسجلات المعالجة، وتقييم الأثر، ومسار طلبات أصحاب البيانات" }), "production"],
        [tx({ en: "Payments via PCI-DSS certified provider (mada, Apple Pay, cards) — no card data on our servers", ar: "المدفوعات عبر مزوّد معتمد PCI-DSS (مدى، Apple Pay، البطاقات) — دون بيانات بطاقات على خوادمنا" }), "designed"],
      ],
    },
    {
      area: tx({ en: "Operations", ar: "العمليات" }),
      items: [
        [tx({ en: "Audit log of administrative actions", ar: "سجل تدقيق للإجراءات الإدارية" }), "prototype"],
        [tx({ en: "Secrets in a managed vault; no secrets in the repository", ar: "الأسرار في خزنة مُدارة؛ لا أسرار في المستودع" }), "prototype"],
        [tx({ en: "CI/CD with automated tests, preview environments and signed releases", ar: "تكامل ونشر مستمر مع اختبارات آلية وبيئات معاينة وإصدارات موقّعة" }), "designed"],
        [tx({ en: "Uploads (e.g. damage photos) scanned, type-checked and stored privately", ar: "الملفات المرفوعة (مثل صور الأضرار) تُفحص ويُتحقق من نوعها وتُخزّن بشكل خاص" }), "designed"],
      ],
    },
  ];

  const layers = [
    { y: 20, label: tx({ en: "Web (Next.js, EN/AR)", ar: "الويب (Next.js، عربي/إنجليزي)" }) + " · " + tx({ en: "Mobile app", ar: "تطبيق الجوال" }) + " · " + tx({ en: "Fleet portal", ar: "بوابة الأسطول" }), color: "#f47b20" },
    { y: 100, label: tx({ en: "API gateway · auth (OIDC) · rate limiting · WAF", ar: "بوابة الواجهات · المصادقة · تحديد المعدل · جدار الحماية" }), color: "#16325c" },
    { y: 180, label: tx({ en: "Services: Inventory · Pricing · Reservations · Customers · Corporate · CMS · Concierge", ar: "الخدمات: المخزون · التسعير · الحجوزات · العملاء · الشركات · المحتوى · المساعد" }), color: "#0e2240" },
    { y: 260, label: tx({ en: "PostgreSQL · cache · object storage · event bus · audit store", ar: "PostgreSQL · ذاكرة مؤقتة · تخزين الكائنات · ناقل الأحداث · مخزن التدقيق" }), color: "#070b14" },
    { y: 340, label: tx({ en: "Integrations: rental core system · payments · ZATCA e-invoicing · SMS/email · maps", ar: "التكاملات: نظام التأجير الأساسي · المدفوعات · الفوترة الإلكترونية · الرسائل · الخرائط" }), color: "#5b6576" },
  ];

  return (
    <>
      <PageHero eyebrow={tx({ en: "Platform", ar: "المنصة" })} title={tx({ en: "Built to be trusted.", ar: "مبنية لتكون موثوقة." })} lead={tx({ en: "How the concept is engineered, what it does and does not do today, and how it would become a secure production platform.", ar: "كيف هُندس هذا التصوّر، وما الذي يفعله وما لا يفعله اليوم، وكيف يصبح منصة إنتاج آمنة." })} />

      <Section tone="white" id="disclaimer">
        <div className="flex gap-4 rounded-3xl border-2 border-ember/40 bg-orange-50 p-6">
          <Scale className="size-8 shrink-0 text-ember-ink" aria-hidden />
          <div>
            <h2 className="text-xl font-semibold">{tx({ en: "Independent concept — not the official website", ar: "تصوّر مستقل — ليس الموقع الرسمي" })}</h2>
            <p className="mt-2 text-slate">
              {tx({
                en: "This prototype was produced independently and without solicitation to demonstrate a possible future direction. It is not affiliated with, endorsed by, or operated by Budget Saudi / United International Transportation Company. Prices, availability, bookings, customer accounts, corporate data and dashboards are simulated. Public facts are shown with their source and retrieval date (11 November 2026). Imagery is original vector illustration. Showing security and privacy controls here does not mean the prototype is secure or compliant.",
                ar: "أُعدّ هذا النموذج بشكل مستقل ودون طلب لعرض توجّه مستقبلي ممكن. وهو غير تابع لبدجت السعودية / الشركة المتحدة الدولية للمواصلات ولا معتمد منها ولا تديره. الأسعار والتوفر والحجوزات وحسابات العملاء وبيانات الشركات ولوحات التحكم كلها محاكاة. تُعرض الحقائق العامة مع مصدرها وتاريخ استرجاعها (١١ نوفمبر ٢٠٢٦). الصور رسوم متجهة أصلية. عرض ضوابط الأمان والخصوصية هنا لا يعني أن النموذج آمن أو ممتثل.",
              })}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow>{tx({ en: "Target architecture", ar: "البنية المستهدفة" })}</Eyebrow>
        <H2 className="!text-3xl">{tx({ en: "API-first, so the frontend never needs a rewrite.", ar: "الواجهات البرمجية أولًا، فلا تحتاج الواجهة إلى إعادة كتابة." })}</H2>
        <div className="mt-8 overflow-x-auto rounded-3xl bg-white p-6 shadow-soft">
          <svg viewBox="0 0 900 400" className="w-full min-w-[640px]" role="img" aria-label={tx({ en: "Layered architecture diagram", ar: "مخطط البنية الطبقية" })}>
            {layers.map((l, i) => (
              <g key={i}>
                <rect x="20" y={l.y} width="860" height="56" rx="14" fill={l.color} />
                <text x="450" y={l.y + 34} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="600">
                  {l.label}
                </text>
                {i < layers.length - 1 && <path d={`M450 ${l.y + 58} v18`} stroke="#9aa3b2" strokeWidth="2" markerEnd="url(#arr)" />}
              </g>
            ))}
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill="#9aa3b2" />
              </marker>
            </defs>
          </svg>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [tx({ en: "Typed data contracts", ar: "عقود بيانات محددة النوع" }), tx({ en: "UI reads through modules (src/lib, src/data) whose shapes match the PostgreSQL schema in docs/schema.sql. Swapping mock data for API calls is a data-layer change.", ar: "تقرأ الواجهة عبر وحدات تطابق مخطط PostgreSQL في docs/schema.sql. استبدال البيانات التجريبية بالواجهات البرمجية تغيير في طبقة البيانات فقط." })],
            [tx({ en: "Pure pricing engine", ar: "محرك تسعير مستقل" }), tx({ en: "Quotes are pure, unit-tested functions — the same logic can run server-side to make prices authoritative.", ar: "عروض الأسعار دوال مستقلة مختبرة — يمكن تشغيل المنطق نفسه على الخادم ليصبح السعر معتمدًا." })],
            [tx({ en: "Bilingual by construction", ar: "ثنائي اللغة بالتصميم" }), tx({ en: "Locale-prefixed routes, RTL via logical CSS properties, Intl formatting, and a compile-time parity check on shared strings.", ar: "مسارات بادئة اللغة، واتجاه من اليمين لليسار عبر خصائص CSS المنطقية، وتنسيق Intl، وفحص تطابق النصوص عند البناء." })],
          ].map(([h, b]) => (
            <Card key={h}>
              <h3 className="font-semibold">{h}</h3>
              <p className="mt-2 text-sm text-slate">{b}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <Eyebrow>{tx({ en: "Security & privacy by design", ar: "الأمان والخصوصية بالتصميم" })}</Eyebrow>
        <H2 className="!text-3xl">{tx({ en: "Controls, and their honest status", ar: "الضوابط وحالتها الفعلية" })}</H2>
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(statusMeta) as Status[]).map((s) => {
            const m = statusMeta[s];
            return (
              <span key={s} className={clsx("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", m.cls)}>
                <m.Icon className="size-3.5" aria-hidden /> {m.label}
              </span>
            );
          })}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {controls.map((c) => (
            <Card key={c.area}>
              <h3 className="text-lg font-semibold">{c.area}</h3>
              <ul className="mt-4 space-y-3">
                {c.items.map(([text, s]) => {
                  const m = statusMeta[s];
                  return (
                    <li key={text} className="flex items-start gap-3 text-sm">
                      <m.Icon className={clsx("mt-0.5 size-4 shrink-0", s === "prototype" ? "text-ok" : s === "designed" ? "text-sky-700" : "text-warn")} aria-label={m.label} />
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate">{tx({ en: "No security testing of any kind was performed against Budget Saudi's live systems while building this concept.", ar: "لم يُجرَ أي اختبار أمني من أي نوع على أنظمة بدجت السعودية الفعلية أثناء بناء هذا التصوّر." })}</p>
      </Section>
    </>
  );
}

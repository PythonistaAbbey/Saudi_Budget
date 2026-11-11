"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import clsx from "clsx";
import { Globe, Menu, X, CalendarCheck, Phone, Info, Scale } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { contact, SOURCES } from "@/content/verified";
import { L } from "./ui";
import { useStore } from "@/lib/store";

export function Wordmark({ light = true }: { light?: boolean }) {
  const { t } = useI18n();
  return (
    <span className="flex items-center gap-2.5" dir="ltr">
      <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-ember to-ember-ink shadow-[0_6px_18px_-6px_rgb(244_123_32/0.8)]">
        <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M4 16 L10 8 L14 13 L20 5" />
          <circle cx="20" cy="5" r="1.2" fill="currentColor" />
        </svg>
      </span>
      <span className={clsx("leading-none", light ? "text-white" : "text-ink")}>
        <span className="block text-[15px] font-bold tracking-tight">Budget Saudi</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.28em] text-ember-2">
          {t.brandNext}
          <span className="rounded-full border border-current px-1.5 py-px text-[8px] tracking-[0.15em]">{t.concept.toUpperCase()}</span>
        </span>
      </span>
    </span>
  );
}

export function DisclaimerBar() {
  const { t, href } = useI18n();
  return (
    <div role="note" className="no-print relative z-50 bg-ember-ink px-4 py-2 text-center text-[12px] font-medium text-white">
      <Info className="me-1.5 inline size-3.5 -translate-y-px" aria-hidden />
      {t.disclaimer}{" "}
      <Link href={href("/platform#disclaimer")} className="underline underline-offset-2">
        {t.learnMore}
      </Link>
    </div>
  );
}

function LangSwitchInner({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const params = useSearchParams();
  const other = locale === "en" ? "ar" : "en";
  const rest = pathname.replace(/^\/(en|ar)/, "");
  const qs = params.toString();
  const target = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${other}${rest}${qs ? `?${qs}` : ""}`;
  return (
    <a href={target} hrefLang={other} lang={other} aria-label={t.languageLabel} className={clsx("inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold", className)} data-testid="lang-switch">
      <Globe className="size-4" aria-hidden />
      <span>{t.language}</span>
    </a>
  );
}

export function LangSwitch(props: { className?: string }) {
  return (
    <Suspense fallback={<span className="w-20" />}>
      <LangSwitchInner {...props} />
    </Suspense>
  );
}

const primary = [
  ["rent", "/find-a-car"],
  ["wafi", "/wafi"],
  ["corporate", "/corporate"],
  ["chauffeur", "/chauffeur"],
  ["used", "/used-cars"],
  ["locations", "/locations"],
  ["promotions", "/promotions"],
] as const;

const secondary = [
  ["support", "/support"],
  ["about", "/about"],
  ["investors", "/investors"],
  ["compare", "/compare"],
  ["concierge", "/concierge"],
  ["fleetDashboard", "/corporate/dashboard"],
  ["admin", "/admin"],
  ["platform", "/platform"],
] as const;

export function Header() {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const overlay = pathname === `/${locale}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { bookings } = useStore();
  const upcoming = bookings.filter((b) => b.status === "upcoming").length;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (p: string) => pathname === `/${locale}${p}` || pathname.startsWith(`/${locale}${p}/`);

  return (
    <header className={clsx("no-print sticky top-0 z-40 transition-colors duration-300", overlay && !scrolled ? "bg-transparent" : "border-b border-white/10 bg-ink/85 backdrop-blur-xl")}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-ink">
        {locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <L href="/" aria-label="Budget Saudi NEXT concept — home" className="shrink-0">
          <Wordmark />
        </L>
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {primary.map(([k, p]) => (
              <li key={k}>
                <L href={p} className={clsx("rounded-full px-3 py-2 text-sm font-medium transition", isActive(p) ? "bg-white/12 text-white" : "text-white/75 hover:text-white")} aria-current={isActive(p) ? "page" : undefined}>
                  {t.nav[k]}
                </L>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1 text-white">
          <LangSwitch className="hover:bg-white/10" />
          <L href="/my-bookings" className="relative hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 sm:inline-flex" data-testid="nav-my-bookings">
            <CalendarCheck className="size-4" aria-hidden />
            {t.nav.myBookings}
            {upcoming > 0 && <span className="grid size-5 place-items-center rounded-full bg-ember text-[10px]">{upcoming}</span>}
          </L>
          <button type="button" data-testid="menu-button" className="rounded-full p-2.5 hover:bg-white/10" aria-expanded={open} aria-controls="mobile-nav" aria-label={t.menu} onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" role="dialog" aria-modal="true" aria-label={t.menu} className="fixed inset-0 z-50 flex">
          <button aria-label={t.close} className="flex-1 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="flex h-full w-[min(380px,90vw)] flex-col overflow-y-auto bg-ink p-6 text-white shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Wordmark />
              <button className="rounded-full p-2 hover:bg-white/10" onClick={() => setOpen(false)} aria-label={t.close} autoFocus>
                <X className="size-5" />
              </button>
            </div>
            <ul className="space-y-1">
              {[["myBookings", "/my-bookings"] as const, ...primary].map(([k, p]) => (
                <li key={k}>
                  <L href={p} className="block rounded-xl px-3 py-3 text-lg font-semibold hover:bg-white/10">
                    {t.nav[k]}
                  </L>
                </li>
              ))}
            </ul>
            <hr className="my-6 border-white/10" />
            <ul className="grid grid-cols-2 gap-1">
              {secondary.map(([k, p]) => (
                <li key={k}>
                  <L href={p} className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
                    {t.nav[k]}
                  </L>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8 text-sm text-white/60">
              <a href={`tel:${contact.reservations.value}`} className="flex items-center gap-2 font-semibold text-white">
                <Phone className="size-4" aria-hidden /> <span dir="ltr">{contact.reservations.value}</span>
              </a>
              <p className="mt-1 text-xs">{locale === "ar" ? "رقم الحجوزات المنشور علنًا" : "Publicly listed reservations line"}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t, locale, tx } = useI18n();
  const cols: { title: string; links: [string, string][] }[] = [
    {
      title: tx({ en: "Rent", ar: "الإيجار" }),
      links: [
        [t.nav.rent, "/find-a-car"],
        [t.nav.wafi, "/wafi"],
        [t.nav.chauffeur, "/chauffeur"],
        [t.nav.promotions, "/promotions"],
        [t.nav.compare, "/compare"],
        [t.nav.concierge, "/concierge"],
      ],
    },
    {
      title: tx({ en: "Business", ar: "الأعمال" }),
      links: [
        [t.nav.corporate, "/corporate"],
        [t.nav.fleetDashboard, "/corporate/dashboard"],
        [t.nav.used, "/used-cars"],
        [t.nav.investors, "/investors"],
      ],
    },
    {
      title: tx({ en: "Help", ar: "المساعدة" }),
      links: [
        [t.nav.support, "/support"],
        [t.nav.myBookings, "/my-bookings"],
        [t.nav.locations, "/locations"],
        [t.nav.about, "/about"],
      ],
    },
    {
      title: tx({ en: "Prototype", ar: "النموذج" }),
      links: [
        [t.nav.platform, "/platform"],
        [t.nav.admin, "/admin"],
      ],
    },
  ];
  return (
    <footer className="no-print bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-sm text-sm text-white/60">
              {tx({
                en: "An independent design and engineering concept exploring what a next-generation Saudi mobility platform could feel like.",
                ar: "تصوّر تصميمي وهندسي مستقل يستكشف شكل منصة تنقّل سعودية من الجيل القادم.",
              })}
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <dt className="w-36 text-white/50">{tx({ en: "Reservations", ar: "الحجوزات" })}</dt>
                <dd>
                  <a href={`tel:${contact.reservations.value}`} className="font-semibold hover:text-ember-2" dir="ltr">
                    {contact.reservations.value}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="w-36 text-white/50">{tx({ en: "24h roadside", ar: "المساعدة على الطريق ٢٤ ساعة" })}</dt>
                <dd>
                  <a href="tel:8002443399" className="font-semibold hover:text-ember-2" dir="ltr">
                    {contact.roadside.value}
                  </a>
                </dd>
              </div>
              <div className="text-xs text-white/40">
                {tx({ en: "Contact numbers as published at", ar: "أرقام التواصل كما نُشرت في" })}{" "}
                <a className="underline" href={SOURCES.contact} target="_blank" rel="noopener noreferrer">
                  budgetsaudi.com
                </a>{" "}
                · {tx({ en: "retrieved 11 Nov 2026", ar: "استُرجعت في ١١ نوفمبر ٢٠٢٦" })}
              </div>
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">{c.title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <L href={href} className="text-white/75 hover:text-white">
                        {label}
                      </L>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div id="disclaimer" className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:items-start md:justify-between">
          <p className="flex max-w-3xl gap-2">
            <Scale className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              {locale === "ar"
                ? "هذا الموقع نموذج تصوّري مستقل وغير مطلوب، أُعدّ لأغراض العرض. ليس الموقع الرسمي لبدجت السعودية (الشركة المتحدة الدولية للمواصلات)، وغير تابع لها ولا معتمد منها. جميع الأسعار والتوفر والحجوزات والحسابات والمخزون والبيانات المالية في لوحات التحكم بيانات محاكاة. المعلومات المؤكدة مرفقة بمصدرها وتاريخ استرجاعها. لا تُعالج أي مدفوعات ولا تُجمع أي بيانات شخصية حقيقية."
                : "This website is an independent, unsolicited concept prototype prepared for demonstration. It is not the official Budget Saudi website and is not affiliated with, or endorsed by, Budget Saudi / United International Transportation Company. All prices, availability, reservations, accounts, inventory and dashboard figures are simulated. Verified facts are shown with their public source and retrieval date. No payments are processed and no real personal data is collected. Budget is a trademark of its respective owner."}
            </span>
          </p>
          <p className="shrink-0">© 2026 {tx({ en: "Concept prototype", ar: "نموذج تصوّري" })}</p>
        </div>
      </div>
    </footer>
  );
}

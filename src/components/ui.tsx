"use client";

import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { BadgeCheck, FlaskConical, Lightbulb, CalendarX, CircleHelp, ExternalLink } from "lucide-react";
import { useI18n } from "@/i18n/client";
import type { Provenance } from "@/content/verified";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgb(244_123_32/0.7)] transition hover:bg-ember-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
  dark: "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy active:scale-[0.98] disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/40 active:scale-[0.98] disabled:opacity-50",
  glass: "glass inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20",
  link: "inline-flex items-center gap-1 font-semibold text-ember-ink underline-offset-4 hover:underline",
};

export function L({ href, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const { href: h } = useI18n();
  return <Link href={href.startsWith("http") || href.startsWith("#") ? href : h(href)} {...rest} />;
}

export function Badge({ kind, className }: { kind: "verified" | "simulated" | "proposed" | "expired" | "undated" | "prototype"; className?: string }) {
  const { t } = useI18n();
  const map = {
    verified: { Icon: BadgeCheck, c: "bg-emerald-50 text-emerald-800 ring-emerald-600/20" },
    simulated: { Icon: FlaskConical, c: "bg-amber-50 text-amber-900 ring-amber-600/25" },
    proposed: { Icon: Lightbulb, c: "bg-sky-50 text-sky-900 ring-sky-600/20" },
    expired: { Icon: CalendarX, c: "bg-rose-50 text-rose-800 ring-rose-600/20" },
    undated: { Icon: CircleHelp, c: "bg-slate-100 text-slate-700 ring-slate-500/20" },
    prototype: { Icon: FlaskConical, c: "bg-violet-50 text-violet-900 ring-violet-600/20" },
  }[kind];
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", map.c, className)}>
      <map.Icon className="size-3.5" aria-hidden />
      {t.badge[kind]}
    </span>
  );
}

export const provenanceBadge = (p: Provenance) => <Badge kind={p} />;

export function SourceLink({ href, className }: { href: string; className?: string }) {
  const { t } = useI18n();
  let host = href;
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {}
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={clsx("inline-flex items-center gap-1 text-xs text-slate hover:text-ink", className)}>
      {t.common.source}: {host}
      <ExternalLink className="size-3" aria-hidden />
    </a>
  );
}

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={clsx("mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]", light ? "text-ember-2" : "text-ember-ink")}>
      <span className="h-px w-6 bg-current" aria-hidden />
      {children}
    </p>
  );
}

export function Section({ children, className, id, tone = "light" }: { children: ReactNode; className?: string; id?: string; tone?: "light" | "white" | "dark" }) {
  return (
    <section
      id={id}
      className={clsx(
        "relative px-4 py-16 sm:px-6 md:py-24",
        tone === "dark" && "bg-ink text-white",
        tone === "white" && "bg-white",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function H2({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={clsx("text-3xl font-semibold tracking-tight text-balance md:text-5xl", className)}>{children}</h2>;
}

export function PageHero({ eyebrow, title, lead, children, art }: { eyebrow: string; title: string; lead?: string; children?: ReactNode; art?: ReactNode }) {
  return (
    <header className="grain relative overflow-hidden bg-ink px-4 pb-16 pt-14 text-white sm:px-6 md:pb-24 md:pt-20">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,rgb(244_123_32/0.28),transparent_60%),radial-gradient(60%_60%_at_0%_100%,rgb(22_50_92/0.9),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">{title}</h1>
          {lead && <p className="mt-5 max-w-2xl text-lg text-white/75 text-pretty">{lead}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {art && <div className="relative hidden md:block">{art}</div>}
      </div>
    </header>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("rounded-3xl border border-ink/8 bg-white p-6 shadow-soft", className)}>{children}</div>;
}

export function Stat({ value, label, source }: { value: string; label: string; source?: string }) {
  return (
    <div>
      <div className="text-4xl font-semibold tracking-tight md:text-5xl">{value}</div>
      <div className="mt-1 text-sm opacity-70">{label}</div>
      {source && <SourceLink href={source} className="mt-1 !text-current opacity-60" />}
    </div>
  );
}

export function Field({ label, error, children, hint, id }: { label: string; error?: string; children: ReactNode; hint?: string; id?: string }) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-medium text-bad" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div className={clsx("flex gap-3 rounded-2xl border p-4 text-sm", tone === "warn" ? "border-amber-300 bg-amber-50 text-amber-950" : "border-sky-200 bg-sky-50 text-sky-950")}>
      <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

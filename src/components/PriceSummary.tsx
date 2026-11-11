"use client";

import clsx from "clsx";
import { FlaskConical } from "lucide-react";
import { useI18n } from "@/i18n/client";
import type { Quote } from "@/lib/pricing";

export function PriceSummary({ q, className, title }: { q: Quote; className?: string; title?: string }) {
  const { t, money, num } = useI18n();
  const label = (k: string) => (t.price as Record<string, string>)[k] ?? k;
  return (
    <div className={clsx("rounded-3xl bg-white p-6 shadow-soft", className)} data-testid="price-summary">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{title ?? t.price.breakdown}</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-600/25">
          <FlaskConical className="size-3" aria-hidden /> {t.price.simulated}
        </span>
      </div>
      <dl className="mt-5 space-y-2.5 text-sm">
        {q.lines.map((l) => (
          <div key={l.key} className="flex justify-between gap-4" data-testid={`line-${l.key}`}>
            <dt className="text-slate">
              {label(l.label)}
              {l.detail && <span className="ms-1 text-xs opacity-70">({l.detail.replace(/\d+(\.\d+)?/g, (m) => num(Number(m)))})</span>}
            </dt>
            <dd className={clsx("font-medium tabular-nums", l.amount < 0 && "text-ok")}>{money(l.amount, { decimals: true })}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-ink/8 pt-2.5">
          <dt className="text-slate">{t.price.subtotal}</dt>
          <dd className="font-medium tabular-nums" data-testid="subtotal">
            {money(q.subtotal, { decimals: true })}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate">{t.price.vat}</dt>
          <dd className="font-medium tabular-nums" data-testid="vat">
            {money(q.vat, { decimals: true })}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink/8 pt-3">
          <dt className="font-semibold">{t.price.total}</dt>
          <dd className="text-2xl font-semibold tracking-tight tabular-nums" data-testid="total">
            {money(q.total, { decimals: true })}
          </dd>
        </div>
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-stone p-3">
          <div className="text-slate">{t.price.includedKm}</div>
          <div className="font-semibold">{num(q.includedKm)} km</div>
        </div>
        <div className="rounded-xl bg-stone p-3">
          <div className="text-slate">{t.price.excess}</div>
          <div className="font-semibold">{money(q.excess)}</div>
        </div>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-slate">{t.price.simulatedLong}</p>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { X, GitCompareArrows } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { useStore } from "@/lib/store";
import { findVehicle } from "@/data/vehicles";
import { CarArt } from "./CarArt";
import { L, btn } from "./ui";

export function CompareTray() {
  const { compare, toggleCompare, clearCompare } = useStore();
  const { tx, t } = useI18n();
  const pathname = usePathname();
  if (!compare.length || pathname.endsWith("/compare")) return null;
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-30 px-4 pb-4" role="region" aria-label={t.nav.compare} data-testid="compare-tray">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-ink/95 p-3 text-white shadow-lift backdrop-blur">
        <GitCompareArrows className="ms-1 size-5 shrink-0 text-ember-2" aria-hidden />
        <ul className="flex flex-1 gap-2 overflow-x-auto">
          {compare.map((id) => {
            const v = findVehicle(id);
            if (!v) return null;
            return (
              <li key={id} className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 py-1 pe-1 ps-2">
                <CarArt body={v.body} color={v.color} className="w-14" shadow={false} />
                <span className="text-xs font-semibold">{v.model}</span>
                <button onClick={() => toggleCompare(id)} className="rounded-full p-1 hover:bg-white/15" aria-label={`${tx({ en: "Remove", ar: "إزالة" })} ${v.model}`}>
                  <X className="size-3.5" />
                </button>
              </li>
            );
          })}
          {compare.length < 3 && <li className="self-center text-xs text-white/50">{tx({ en: `Add up to ${3 - compare.length} more`, ar: `يمكنك إضافة ${3 - compare.length} أخرى` })}</li>}
        </ul>
        <button onClick={clearCompare} className="hidden text-xs text-white/60 hover:text-white sm:block">
          {tx({ en: "Clear", ar: "مسح" })}
        </button>
        <L href="/compare" className={btn.primary + " !px-4 !py-2"} data-testid="open-compare">
          {t.v.compare} ({compare.length})
        </L>
      </div>
    </div>
  );
}

"use client";

import clsx from "clsx";
import { Check, Minus, Plus, X } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { useStore } from "@/lib/store";
import { findVehicle, vehicles, allFeatures, type Vehicle } from "@/data/vehicles";
import { CarArt } from "@/components/CarArt";
import { Badge, L, btn } from "@/components/ui";

export function CompareView() {
  const { t, tx, money, num } = useI18n();
  const { compare, toggleCompare, clearCompare, ready } = useStore();
  const list = compare.map(findVehicle).filter(Boolean) as Vehicle[];
  const best = (f: (v: Vehicle) => number, dir: "max" | "min") => {
    if (list.length < 2) return null;
    const vals = list.map(f);
    const target = dir === "max" ? Math.max(...vals) : Math.min(...vals);
    return vals.filter((x) => x === target).length === vals.length ? null : target;
  };
  const rows: { k: string; f: (v: Vehicle) => React.ReactNode; num?: (v: Vehicle) => number; dir?: "max" | "min" }[] = [
    { k: t.cat.economy && tx({ en: "Category", ar: "الفئة" }), f: (v) => t.cat[v.category] },
    { k: tx({ en: "Daily price (simulated)", ar: "السعر اليومي (محاكى)" }), f: (v) => money(v.dailyRate), num: (v) => v.dailyRate, dir: "min" },
    { k: t.v.seats, f: (v) => num(v.seats), num: (v) => v.seats, dir: "max" },
    { k: t.v.bags, f: (v) => num(v.bags), num: (v) => v.bags, dir: "max" },
    { k: t.v.transmission, f: (v) => t.trans[v.transmission] },
    { k: t.v.fuel, f: (v) => t.fuel[v.fuel] },
    { k: t.v.engine, f: (v) => v.engine },
    { k: t.v.economy, f: (v) => v.economy },
    { k: t.v.kmDay, f: (v) => num(v.kmPerDay), num: (v) => v.kmPerDay, dir: "max" },
    { k: t.v.deposit, f: (v) => money(v.deposit), num: (v) => v.deposit, dir: "min" },
    { k: t.v.rating, f: (v) => num(v.rating), num: (v) => v.rating, dir: "max" },
  ];
  const feats = allFeatures.filter((f) => list.some((v) => v.features.includes(f)));
  const suggestions = vehicles.filter((v) => !compare.includes(v.id)).slice(0, 6);

  return (
    <div className="min-h-screen bg-stone">
      <header className="bg-ink px-4 py-12 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{tx({ en: "Compare vehicles", ar: "قارن السيارات" })}</h1>
            <p className="mt-2 text-white/60">{tx({ en: "Up to three side by side. Best value in each row is highlighted.", ar: "حتى ثلاث سيارات جنبًا إلى جنب. يتم إبراز الأفضل في كل صف." })}</p>
          </div>
          {list.length > 0 && (
            <button onClick={clearCompare} className={btn.glass}>
              {tx({ en: "Clear all", ar: "مسح الكل" })}
            </button>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {!ready ? null : list.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-soft" data-testid="compare-empty">
            <p className="text-lg font-semibold">{tx({ en: "Nothing to compare yet.", ar: "لا يوجد ما تقارنه بعد." })}</p>
            <p className="mt-1 text-slate">{tx({ en: "Add vehicles below or from search results.", ar: "أضف سيارات من الأسفل أو من نتائج البحث." })}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white shadow-soft">
            <table className="w-full min-w-[640px] text-sm" data-testid="compare-table">
              <thead>
                <tr>
                  <th className="w-48 p-5" />
                  {list.map((v) => (
                    <th key={v.id} className="p-5 text-start align-top">
                      <div className="relative rounded-2xl bg-stone p-3">
                        <button onClick={() => toggleCompare(v.id)} className="absolute end-2 top-2 rounded-full bg-white p-1.5 shadow-soft" aria-label={`${tx({ en: "Remove", ar: "إزالة" })} ${v.model}`}>
                          <X className="size-3.5" />
                        </button>
                        <CarArt body={v.body} color={v.color} shadow={false} />
                      </div>
                      <div className="mt-3 text-base font-semibold">{v.model}</div>
                      <L href={`/vehicles/${v.id}`} className={clsx(btn.dark, "mt-3 !px-4 !py-2 text-xs")}>
                        {t.v.details}
                      </L>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const b = r.num && r.dir ? best(r.num, r.dir) : null;
                  return (
                    <tr key={r.k} className="border-t border-ink/5">
                      <th className="p-4 text-start font-medium text-slate">{r.k}</th>
                      {list.map((v) => (
                        <td key={v.id} className={clsx("p-4", b !== null && r.num!(v) === b && "font-semibold text-ok")}>
                          {r.f(v)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {feats.map((f) => (
                  <tr key={f} className="border-t border-ink/5">
                    <th className="p-4 text-start font-medium text-slate">{f}</th>
                    {list.map((v) => (
                      <td key={v.id} className="p-4">
                        {v.features.includes(f) ? <Check className="size-4 text-ok" aria-label={tx({ en: "Yes", ar: "نعم" })} /> : <Minus className="size-4 text-slate/40" aria-label={tx({ en: "No", ar: "لا" })} />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3">
          <Badge kind="simulated" />
        </div>
        {list.length < 3 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">{tx({ en: "Add a vehicle", ar: "أضف سيارة" })}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {suggestions.map((v) => (
                <button key={v.id} onClick={() => toggleCompare(v.id)} className="rounded-2xl bg-white p-3 text-start shadow-soft transition hover:ring-1 hover:ring-ember" data-testid="compare-add">
                  <CarArt body={v.body} color={v.color} shadow={false} />
                  <div className="mt-1 flex items-center justify-between gap-1 text-xs font-semibold">
                    <span className="truncate">{v.model}</span>
                    <Plus className="size-3.5 shrink-0" aria-hidden />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

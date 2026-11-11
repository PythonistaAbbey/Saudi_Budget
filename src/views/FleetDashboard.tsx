"use client";

import { useState } from "react";
import clsx from "clsx";
import { AlertTriangle, Car, Download, FileText, Gauge, LayoutDashboard, Receipt, Wrench, CheckCircle2, Clock } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { allocation, contracts, expenses, fleetCompany, maintenance } from "@/data/fleet";
import { findCity } from "@/data/branches";
import { Badge, L } from "@/components/ui";

const SERIES = [
  { k: "lease", color: "#0e2240" },
  { k: "fuel", color: "#f47b20" },
  { k: "fines", color: "#b42318" },
  { k: "other", color: "#9aa3b2" },
] as const;

export function FleetDashboardView() {
  const { tx, money, num, date, locale } = useI18n();
  const [section, setSection] = useState<"overview" | "contracts" | "maintenance" | "reports">("overview");
  const totalVehicles = contracts.filter((c) => c.status !== "pending").reduce((s, c) => s + c.vehicles, 0);
  const monthly = contracts.filter((c) => c.status !== "pending").reduce((s, c) => s + c.vehicles * c.monthly, 0);
  const last = expenses[expenses.length - 1];
  const seriesLabel: Record<string, string> = { lease: tx({ en: "Lease", ar: "التأجير" }), fuel: tx({ en: "Fuel", ar: "الوقود" }), fines: tx({ en: "Traffic fines", ar: "المخالفات" }), other: tx({ en: "Other", ar: "أخرى" }) };
  const maxStack = Math.max(...expenses.map((e) => e.lease + e.fuel + e.fines + e.other));

  function downloadCsv() {
    const rows = [["month", "lease_sar_k", "fuel_sar_k", "fines_sar_k", "other_sar_k"], ...expenses.map((e) => [e.m, e.lease, e.fuel, e.fines, e.other])];
    const blob = new Blob(["# SYNTHETIC DATA - concept prototype\n" + rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fleet-expenses-demo.csv";
    a.click();
  }

  const nav = [
    ["overview", LayoutDashboard, tx({ en: "Overview", ar: "نظرة عامة" })],
    ["contracts", FileText, tx({ en: "Contracts", ar: "العقود" })],
    ["maintenance", Wrench, tx({ en: "Maintenance", ar: "الصيانة" })],
    ["reports", Receipt, tx({ en: "Reports", ar: "التقارير" })],
  ] as const;

  const statusChip = (s: string) =>
    ({
      active: ["bg-emerald-50 text-emerald-800", tx({ en: "Active", ar: "نشط" })],
      pending: ["bg-sky-50 text-sky-800", tx({ en: "Pending delivery", ar: "بانتظار التسليم" })],
      ending: ["bg-amber-50 text-amber-900", tx({ en: "Ending soon", ar: "ينتهي قريبًا" })],
      scheduled: ["bg-sky-50 text-sky-800", tx({ en: "Scheduled", ar: "مجدول" })],
      "in-progress": ["bg-amber-50 text-amber-900", tx({ en: "In workshop", ar: "في الورشة" })],
      done: ["bg-emerald-50 text-emerald-800", tx({ en: "Done", ar: "منجز" })],
    })[s] ?? ["bg-mist", s];

  return (
    <div className="min-h-screen bg-[#eef1f5]">
      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-3xl bg-ink p-5 text-white lg:sticky lg:top-24 lg:self-start">
          <div className="text-xs uppercase tracking-widest text-white/50">{tx({ en: "Fleet admin", ar: "إدارة الأسطول" })}</div>
          <div className="mt-1 font-semibold">{locale === "ar" ? fleetCompany.nameAr : fleetCompany.name}</div>
          <nav className="mt-6 flex gap-1 overflow-x-auto lg:flex-col" aria-label={tx({ en: "Dashboard sections", ar: "أقسام اللوحة" })}>
            {nav.map(([k, Icon, label]) => (
              <button key={k} onClick={() => setSection(k)} aria-current={section === k ? "page" : undefined} className={clsx("flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition", section === k ? "bg-white/12 text-white" : "text-white/60 hover:text-white")} data-testid={`fleet-nav-${k}`}>
                <Icon className="size-4" aria-hidden /> {label}
              </button>
            ))}
          </nav>
          <div className="mt-6 hidden lg:block">
            <Badge kind="simulated" className="!bg-white/10 !text-white !ring-white/20" />
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">{nav.find((n) => n[0] === section)![2]}</h1>
            <div className="flex items-center gap-2 text-xs text-slate">
              <Badge kind="prototype" />
              <L href="/corporate" className="underline">
                {tx({ en: "Back to Corporate", ar: "العودة إلى الشركات" })}
              </L>
            </div>
          </div>

          {section === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [Car, tx({ en: "Vehicles in service", ar: "سيارات في الخدمة" }), num(totalVehicles)],
                  [Receipt, tx({ en: "Monthly lease (excl. VAT)", ar: "الإيجار الشهري (بدون الضريبة)" }), money(monthly)],
                  [Gauge, tx({ en: "Utilisation (30 days)", ar: "معدل الاستخدام (٣٠ يومًا)" }), `${num(87)}%`],
                  [AlertTriangle, tx({ en: "Open maintenance items", ar: "بنود صيانة مفتوحة" }), num(maintenance.filter((m) => m.status !== "done").length)],
                ].map(([Icon, k, v], i) => {
                  const I = Icon as typeof Car;
                  return (
                    <div key={i} className="rounded-3xl bg-white p-5 shadow-soft" data-testid="kpi">
                      <I className="size-5 text-ember" aria-hidden />
                      <div className="mt-3 text-sm text-slate">{k as string}</div>
                      <div className="mt-1 text-2xl font-semibold tracking-tight">{v as string}</div>
                    </div>
                  );
                })}
              </div>
              <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <section className="rounded-3xl bg-white p-6 shadow-soft" aria-labelledby="exp-h">
                  <div className="flex items-center justify-between">
                    <h2 id="exp-h" className="font-semibold">
                      {tx({ en: "Monthly fleet spend (SAR thousands)", ar: "إنفاق الأسطول الشهري (بالألف ريال)" })}
                    </h2>
                  </div>
                  <svg viewBox="0 0 600 260" className="mt-4 w-full" role="img" aria-label={tx({ en: "Stacked bar chart of monthly fleet spend", ar: "مخطط أعمدة لإنفاق الأسطول الشهري" })}>
                    {[0, 100, 200, 300, 400].map((g) => (
                      <g key={g}>
                        <line x1="40" x2="590" y1={230 - (g / maxStack) * 210} y2={230 - (g / maxStack) * 210} stroke="#e8ebf0" />
                        <text x="34" y={234 - (g / maxStack) * 210} textAnchor="end" fontSize="11" fill="#5b6576">
                          {g}
                        </text>
                      </g>
                    ))}
                    {expenses.map((e, i) => {
                      let y = 230;
                      const x = 60 + i * 90;
                      return (
                        <g key={e.m}>
                          {SERIES.map((s) => {
                            const h = (e[s.k] / maxStack) * 210;
                            y -= h;
                            return <rect key={s.k} x={x} y={y} width="48" height={Math.max(0, h - 1)} rx="3" fill={s.color} />;
                          })}
                          <text x={x + 24} y="250" textAnchor="middle" fontSize="11" fill="#5b6576">
                            {date(`${e.m}-01`, { month: "short" })}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <ul className="mt-2 flex flex-wrap gap-4 text-xs">
                    {SERIES.map((s) => (
                      <li key={s.k} className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm" style={{ background: s.color }} /> {seriesLabel[s.k]}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-3xl bg-white p-6 shadow-soft" aria-labelledby="alloc-h">
                  <h2 id="alloc-h" className="font-semibold">
                    {tx({ en: "Allocation by department & city", ar: "التوزيع حسب القسم والمدينة" })}
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {allocation.map((a) => {
                      const total = a.riyadh + a.jeddah + a.dammam;
                      return (
                        <li key={a.dept.en}>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{a.dept[locale]}</span>
                            <span className="text-slate">{num(total)}</span>
                          </div>
                          <div className="mt-1.5 flex h-3 overflow-hidden rounded-full bg-mist">
                            {(["riyadh", "jeddah", "dammam"] as const).map((c, i) => (
                              <div key={c} style={{ width: `${(a[c] / 60) * 100}%`, background: ["#0e2240", "#f47b20", "#c9a77b"][i] }} title={`${findCity(c)?.name}: ${a[c]}`} />
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <ul className="mt-4 flex gap-4 text-xs">
                    {(["riyadh", "jeddah", "dammam"] as const).map((c, i) => (
                      <li key={c} className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm" style={{ background: ["#0e2240", "#f47b20", "#c9a77b"][i] }} /> {locale === "ar" ? findCity(c)?.nameAr : findCity(c)?.name}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          )}

          {section === "contracts" && (
            <div className="overflow-x-auto rounded-3xl bg-white shadow-soft">
              <table className="w-full min-w-[720px] text-sm" data-testid="contracts-table">
                <thead className="bg-stone text-start text-xs uppercase tracking-wider text-slate">
                  <tr>
                    {[tx({ en: "Contract", ar: "العقد" }), tx({ en: "Vehicles", ar: "السيارات" }), tx({ en: "Model", ar: "الطراز" }), tx({ en: "Start", ar: "البداية" }), tx({ en: "Term", ar: "المدة" }), tx({ en: "Per vehicle", ar: "لكل سيارة" }), tx({ en: "Status", ar: "الحالة" })].map((h) => (
                      <th key={h} className="px-5 py-3 text-start font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => {
                    const [cls, label] = statusChip(c.status);
                    return (
                      <tr key={c.id} className="border-t border-ink/5">
                        <td className="px-5 py-4 font-mono">{c.id}</td>
                        <td className="px-5 py-4">{num(c.vehicles)}</td>
                        <td className="px-5 py-4">{c.model}</td>
                        <td className="px-5 py-4">{date(c.start)}</td>
                        <td className="px-5 py-4">
                          {num(c.months)} {tx({ en: "mo", ar: "شهر" })}
                        </td>
                        <td className="px-5 py-4 tabular-nums">{money(c.monthly)}</td>
                        <td className="px-5 py-4">
                          <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", cls)}>{label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {section === "maintenance" && (
            <ul className="space-y-3" data-testid="maintenance-list">
              {maintenance.map((m) => {
                const [cls, label] = statusChip(m.status);
                const Icon = m.status === "done" ? CheckCircle2 : m.status === "in-progress" ? Wrench : Clock;
                return (
                  <li key={m.plate} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 shadow-soft">
                    <Icon className="size-5 text-ember" aria-hidden />
                    <div className="min-w-48 flex-1">
                      <div className="font-semibold">{m.type[locale]}</div>
                      <div className="text-sm text-slate">
                        {m.model} · {m.plate} · {locale === "ar" ? findCity(m.city)?.nameAr : findCity(m.city)?.name}
                      </div>
                    </div>
                    <div className="text-sm text-slate">{m.due > 0 ? tx({ en: `In ${m.due} days`, ar: `بعد ${num(m.due)} أيام` }) : m.due === 0 ? tx({ en: "Today", ar: "اليوم" }) : tx({ en: `${-m.due} days ago`, ar: `قبل ${num(-m.due)} أيام` })}</div>
                    <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", cls)}>{label}</span>
                  </li>
                );
              })}
            </ul>
          )}

          {section === "reports" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <h2 className="font-semibold">{tx({ en: "Expense export", ar: "تصدير المصروفات" })}</h2>
                <p className="mt-2 text-sm text-slate">{tx({ en: "Six months of synthetic spend, by category, as CSV.", ar: "ستة أشهر من الإنفاق الاصطناعي حسب الفئة بصيغة CSV." })}</p>
                <button onClick={downloadCsv} className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white" data-testid="download-csv">
                  <Download className="size-4" aria-hidden /> CSV
                </button>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <h2 className="font-semibold">{tx({ en: "Last month at a glance", ar: "الشهر الماضي باختصار" })}</h2>
                <dl className="mt-3 space-y-2 text-sm">
                  {SERIES.map((s) => (
                    <div key={s.k} className="flex justify-between">
                      <dt className="text-slate">{seriesLabel[s.k]}</dt>
                      <dd className="font-semibold">{money(last[s.k] * 1000)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
          <p className="text-xs text-slate">{tx({ en: "Fictional company, synthetic contracts and expenses. Role-based access (fleet admin vs. driver vs. finance) would gate each section in production.", ar: "شركة وهمية وعقود ومصروفات اصطناعية. في الإنتاج يُقيَّد كل قسم بصلاحيات حسب الدور (مسؤول الأسطول، السائق، المالية)." })}</p>
        </div>
      </div>
    </div>
  );
}

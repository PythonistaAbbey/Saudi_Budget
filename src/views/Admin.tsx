"use client";

import { useState } from "react";
import clsx from "clsx";
import { Building, Car, FileClock, FlaskConical, LayoutTemplate, Lock, Megaphone, ReceiptText, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { vehicles as seedVehicles } from "@/data/vehicles";
import { branches, findBranch } from "@/data/branches";
import { promotions } from "@/content/verified";
import { adminReservations } from "@/data/fleet";
import { Badge } from "@/components/ui";

type Role = "admin" | "editor" | "viewer";
type TabId = "vehicles" | "branches" | "promotions" | "content" | "reservations" | "audit";

const CAN: Record<Role, { edit: boolean; publish: boolean; reservations: boolean }> = {
  admin: { edit: true, publish: true, reservations: true },
  editor: { edit: true, publish: false, reservations: false },
  viewer: { edit: false, publish: false, reservations: false },
};

export function AdminView() {
  const { tx, money, dateTime } = useI18n();
  const [role, setRole] = useState<Role>("admin");
  const [tab, setTab] = useState<TabId>("vehicles");
  const [fleet, setFleet] = useState(() => seedVehicles.map((v) => ({ id: v.id, model: v.model, category: v.category, rate: v.dailyRate, active: true })));
  const [promoState, setPromoState] = useState(() => Object.fromEntries(promotions.map((p) => [p.id, p.provenance === "expired" ? "archived" : "draft"])) as Record<string, string>);
  const [hero, setHero] = useState({ en: "YOUR JOURNEY. REIMAGINED.", ar: "رحلتك. بتصوّر جديد." });
  const [heroDraft, setHeroDraft] = useState(hero);
  const [res, setRes] = useState(adminReservations);
  const [log, setLog] = useState<{ at: string; who: Role; what: string }[]>([{ at: new Date().toISOString(), who: "admin", what: "Signed in (demo session)" }]);
  const can = CAN[role];
  const audit = (what: string) => setLog((l) => [{ at: new Date().toISOString(), who: role, what }, ...l].slice(0, 50));

  const tabs: [TabId, typeof Car, string][] = [
    ["vehicles", Car, tx({ en: "Vehicles", ar: "السيارات" })],
    ["branches", Building, tx({ en: "Branches", ar: "الفروع" })],
    ["promotions", Megaphone, tx({ en: "Promotions", ar: "العروض" })],
    ["content", LayoutTemplate, tx({ en: "Content", ar: "المحتوى" })],
    ["reservations", ReceiptText, tx({ en: "Reservations", ar: "الحجوزات" })],
    ["audit", FileClock, tx({ en: "Audit log", ar: "سجل التدقيق" })],
  ];

  const Locked = () => (
    <span className="inline-flex items-center gap-1 text-xs text-slate">
      <Lock className="size-3" aria-hidden /> {tx({ en: "No permission", ar: "لا توجد صلاحية" })}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#eef1f5]">
      <div className="border-b border-violet-200 bg-violet-50 px-4 py-2 text-center text-sm font-medium text-violet-950">
        <FlaskConical className="me-1 inline size-4" aria-hidden />
        {tx({ en: "Prototype-only administration console. Synthetic data; changes live in memory and reset on reload.", ar: "لوحة إدارة للنموذج فقط. بيانات اصطناعية؛ التغييرات في الذاكرة وتُعاد عند إعادة التحميل." })}
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[230px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink p-5 text-white">
            <div className="text-xs uppercase tracking-widest text-white/50">CMS</div>
            <nav className="mt-4 flex gap-1 overflow-x-auto lg:flex-col" aria-label="Admin">
              {tabs.map(([k, Icon, label]) => (
                <button key={k} onClick={() => setTab(k)} aria-current={tab === k ? "page" : undefined} className={clsx("flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium", tab === k ? "bg-white/12" : "text-white/60 hover:text-white")} data-testid={`admin-tab-${k}`}>
                  <Icon className="size-4" aria-hidden /> {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <label className="label flex items-center gap-1.5" htmlFor="role">
              <ShieldCheck className="size-3.5" aria-hidden /> {tx({ en: "Simulate role (RBAC)", ar: "محاكاة الدور (صلاحيات)" })}
            </label>
            <select
              id="role"
              className="field"
              value={role}
              onChange={(e) => {
                setRole(e.target.value as Role);
                setLog((l) => [{ at: new Date().toISOString(), who: e.target.value as Role, what: `Role switched to ${e.target.value}` }, ...l]);
              }}
              data-testid="admin-role"
            >
              <option value="admin">{tx({ en: "Administrator", ar: "مسؤول" })}</option>
              <option value="editor">{tx({ en: "Content editor", ar: "محرر محتوى" })}</option>
              <option value="viewer">{tx({ en: "Read-only viewer", ar: "مشاهد فقط" })}</option>
            </select>
            <ul className="mt-3 space-y-1 text-xs text-slate">
              <li>{can.edit ? "✓" : "✕"} {tx({ en: "Edit records", ar: "تعديل السجلات" })}</li>
              <li>{can.publish ? "✓" : "✕"} {tx({ en: "Publish content", ar: "نشر المحتوى" })}</li>
              <li>{can.reservations ? "✓" : "✕"} {tx({ en: "Change reservations", ar: "تغيير الحجوزات" })}</li>
            </ul>
          </div>
        </aside>

        <main className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{tabs.find((x) => x[0] === tab)![2]}</h1>
            <Badge kind="prototype" />
          </div>

          {tab === "vehicles" && (
            <div className="overflow-x-auto rounded-3xl bg-white shadow-soft">
              <table className="w-full min-w-[640px] text-sm" data-testid="admin-vehicles">
                <thead className="bg-stone text-xs uppercase tracking-wider text-slate">
                  <tr>
                    <th className="px-5 py-3 text-start">{tx({ en: "Model", ar: "الطراز" })}</th>
                    <th className="px-5 py-3 text-start">{tx({ en: "Category", ar: "الفئة" })}</th>
                    <th className="px-5 py-3 text-start">{tx({ en: "Daily rate (mock)", ar: "السعر اليومي (تجريبي)" })}</th>
                    <th className="px-5 py-3 text-start">{tx({ en: "Listed", ar: "معروض" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {fleet.map((v, i) => (
                    <tr key={v.id} className="border-t border-ink/5">
                      <td className="px-5 py-3 font-medium">{v.model}</td>
                      <td className="px-5 py-3 text-slate">{v.category}</td>
                      <td className="px-5 py-3">
                        {can.edit ? (
                          <input
                            type="number"
                            min={50}
                            max={5000}
                            className="field !w-28 !py-1.5"
                            value={v.rate}
                            aria-label={`${v.model} rate`}
                            onChange={(e) => setFleet((f) => f.map((x, j) => (j === i ? { ...x, rate: Number(e.target.value) } : x)))}
                            onBlur={() => audit(`Updated rate for ${v.model} to SAR ${v.rate}`)}
                            data-testid="admin-rate"
                          />
                        ) : (
                          money(v.rate)
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          role="switch"
                          aria-checked={v.active}
                          disabled={!can.edit}
                          onClick={() => {
                            setFleet((f) => f.map((x, j) => (j === i ? { ...x, active: !x.active } : x)));
                            audit(`${v.active ? "Unlisted" : "Listed"} ${v.model}`);
                          }}
                          className={clsx("relative h-6 w-11 rounded-full transition disabled:opacity-40", v.active ? "bg-ok" : "bg-slate/30")}
                          aria-label={`${v.model} listed`}
                          data-testid="admin-toggle"
                        >
                          <span className={clsx("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", v.active ? "start-[22px]" : "start-0.5")} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "branches" && (
            <div className="overflow-x-auto rounded-3xl bg-white shadow-soft">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-stone text-xs uppercase tracking-wider text-slate">
                  <tr>
                    <th className="px-5 py-3 text-start">{tx({ en: "Branch", ar: "الفرع" })}</th>
                    <th className="px-5 py-3 text-start">{tx({ en: "Type", ar: "النوع" })}</th>
                    <th className="px-5 py-3 text-start">{tx({ en: "Hours", ar: "الساعات" })}</th>
                    <th className="px-5 py-3 text-start">{tx({ en: "Provenance", ar: "المصدر" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((b) => (
                    <tr key={b.id} className="border-t border-ink/5">
                      <td className="px-5 py-3">
                        <div className="font-medium">{b.name}</div>
                        <div className="text-xs text-slate">{b.address}</div>
                      </td>
                      <td className="px-5 py-3">{b.kind}</td>
                      <td className="px-5 py-3 text-xs">{b.hours ?? <span className="text-amber-800">{tx({ en: "Needs verification", ar: "يحتاج تحقق" })}</span>}</td>
                      <td className="px-5 py-3">
                        <Badge kind="verified" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "promotions" && (
            <ul className="space-y-3">
              {promotions.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-soft">
                  <div className="min-w-56 flex-1">
                    <div className="font-medium">{p.title}</div>
                    <div className="mt-1">
                      <Badge kind={p.provenance} />
                    </div>
                  </div>
                  <select
                    className="field !w-auto !py-2"
                    value={promoState[p.id]}
                    disabled={!can.publish || p.provenance === "expired"}
                    onChange={(e) => {
                      setPromoState((s) => ({ ...s, [p.id]: e.target.value }));
                      audit(`Promotion "${p.title}" → ${e.target.value}`);
                    }}
                    aria-label={`${p.title} status`}
                  >
                    <option value="draft">{tx({ en: "Draft", ar: "مسودة" })}</option>
                    <option value="needs-dates">{tx({ en: "Needs validity dates", ar: "يحتاج تواريخ صلاحية" })}</option>
                    <option value="published">{tx({ en: "Published", ar: "منشور" })}</option>
                    <option value="archived">{tx({ en: "Archived", ar: "مؤرشف" })}</option>
                  </select>
                  {!can.publish && <Locked />}
                </li>
              ))}
              <li className="text-xs text-slate">{tx({ en: "Rule: an offer cannot be published without a start and end date. Expired offers are locked to Archived.", ar: "قاعدة: لا يمكن نشر عرض دون تاريخ بداية ونهاية. العروض المنتهية مقفلة على الأرشفة." })}</li>
            </ul>
          )}

          {tab === "content" && (
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
                <h2 className="font-semibold">{tx({ en: "Homepage hero headline", ar: "عنوان الصفحة الرئيسية" })}</h2>
                <label className="block">
                  <span className="label">English</span>
                  <input className="field" value={heroDraft.en} disabled={!can.edit} onChange={(e) => setHeroDraft({ ...heroDraft, en: e.target.value })} data-testid="admin-hero-en" />
                </label>
                <label className="block">
                  <span className="label">العربية</span>
                  <input className="field" dir="rtl" value={heroDraft.ar} disabled={!can.edit} onChange={(e) => setHeroDraft({ ...heroDraft, ar: e.target.value })} />
                </label>
                <div className="flex items-center gap-3">
                  <button
                    disabled={!can.publish}
                    onClick={() => {
                      setHero(heroDraft);
                      audit("Published homepage hero headline");
                    }}
                    className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                    data-testid="admin-publish"
                  >
                    {tx({ en: "Publish", ar: "نشر" })}
                  </button>
                  {!can.publish && <Locked />}
                </div>
                <p className="text-xs text-slate">{tx({ en: "Workflow: editors draft, administrators publish. Both languages are required before publishing.", ar: "سير العمل: المحررون يصيغون والمسؤولون ينشرون. اللغتان مطلوبتان قبل النشر." })}</p>
              </div>
              <div className="rounded-3xl bg-ink p-8 text-white">
                <div className="text-xs uppercase tracking-widest text-white/50">{tx({ en: "Live preview", ar: "معاينة مباشرة" })}</div>
                <p className="mt-6 text-4xl font-semibold tracking-tight" data-testid="admin-hero-preview">
                  {heroDraft.en}
                </p>
                <p className="mt-3 text-3xl font-semibold" dir="rtl">
                  {heroDraft.ar}
                </p>
                <p className="mt-6 text-xs text-white/50">
                  {tx({ en: "Currently published:", ar: "المنشور حاليًا:" })} {hero.en}
                </p>
              </div>
            </div>
          )}

          {tab === "reservations" && (
            <div className="overflow-x-auto rounded-3xl bg-white shadow-soft">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-stone text-xs uppercase tracking-wider text-slate">
                  <tr>
                    {["Ref", tx({ en: "Customer (fictional)", ar: "العميل (وهمي)" }), tx({ en: "Vehicle", ar: "السيارة" }), tx({ en: "Branch", ar: "الفرع" }), tx({ en: "Total", ar: "الإجمالي" }), tx({ en: "Status", ar: "الحالة" })].map((h) => (
                      <th key={h} className="px-5 py-3 text-start">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {res.map((r, i) => (
                    <tr key={r.ref} className="border-t border-ink/5">
                      <td className="px-5 py-3 font-mono">{r.ref}</td>
                      <td className="px-5 py-3">{r.customer}</td>
                      <td className="px-5 py-3">{r.vehicle}</td>
                      <td className="px-5 py-3 text-slate">{findBranch(r.branch)?.name}</td>
                      <td className="px-5 py-3 tabular-nums">{money(r.total, { decimals: true })}</td>
                      <td className="px-5 py-3">
                        <select
                          className="field !w-auto !py-1.5"
                          value={r.status}
                          disabled={!can.reservations}
                          onChange={(e) => {
                            setRes((xs) => xs.map((x, j) => (j === i ? { ...x, status: e.target.value } : x)));
                            audit(`Reservation ${r.ref} → ${e.target.value}`);
                          }}
                          aria-label={`${r.ref} status`}
                        >
                          {["confirmed", "picked-up", "returned", "no-show", "cancelled"].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-5 py-3 text-xs text-slate">{tx({ en: "Personal data is minimised and masked in production list views; full records require a justified, logged access.", ar: "تُقلَّل البيانات الشخصية وتُخفى في قوائم الإنتاج؛ السجلات الكاملة تتطلب وصولًا مبررًا ومسجّلًا." })}</p>
            </div>
          )}

          {tab === "audit" && (
            <ol className="space-y-2" data-testid="admin-audit">
              {log.map((l, i) => (
                <li key={i} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm shadow-soft">
                  <span className="text-xs text-slate">{dateTime(l.at)}</span>
                  <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-semibold">{l.who}</span>
                  <span>{l.what}</span>
                </li>
              ))}
            </ol>
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { CalendarDays, FileText, MapPin, Pencil, Printer, RotateCcw, Search, Settings2, Trash2, X, Heart, Award, Clock } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { useStore, computeTotal, type Booking } from "@/lib/store";
import { findVehicle } from "@/data/vehicles";
import { findBranch, findCity, cities } from "@/data/branches";
import { quote } from "@/lib/pricing";
import { combine, toDateInput, TIMES, validateTrip, pad } from "@/lib/dates";
import { CarArt } from "@/components/CarArt";
import { Badge, L, Notice, btn } from "@/components/ui";
import { VehicleCard } from "@/components/VehicleCard";

type Tab = "upcoming" | "past" | "cancelled" | "saved" | "prefs";

function useBookingText() {
  const { locale } = useI18n();
  const bn = (id: string) => {
    const b = findBranch(id);
    const c = b ? findCity(b.city) : undefined;
    if (!b) return id;
    return `${locale === "ar" ? b.nameAr ?? b.name : b.name}, ${locale === "ar" ? c?.nameAr : c?.name}`;
  };
  return { bn };
}

function Invoice({ b, onClose }: { b: Booking; onClose: () => void }) {
  const { t, tx, money, date } = useI18n();
  const v = findVehicle(b.vehicleId)!;
  const pb = findBranch(b.pickupBranch);
  const rb = findBranch(b.returnBranch);
  const q = quote({ vehicle: v, pickupAt: new Date(b.pickupAt), returnAt: new Date(b.returnAt), extras: b.extras, cover: b.cover, youngDriver: b.youngDriver, promoPct: b.promoPct, airportPickup: pb?.kind === "airport", oneWay: !!pb && !!rb && pb.city !== rb.city });
  const { bn } = useBookingText();
  const label = (k: string) => (t.price as Record<string, string>)[k] ?? k;
  return (
    <div role="dialog" aria-modal="true" aria-label={tx({ en: "Invoice", ar: "الفاتورة" })} className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-4 print:static print:bg-white print:p-0" data-testid="invoice">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-lift print:shadow-none">
        <div className="no-print mb-4 flex justify-end gap-2">
          <button onClick={() => window.print()} className={btn.ghost}>
            <Printer className="size-4" aria-hidden /> {t.common.print}
          </button>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-mist" aria-label={t.close} autoFocus>
            <X className="size-5" />
          </button>
        </div>
        <div className="rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-center text-xs font-bold uppercase tracking-wider text-amber-900">
          {tx({ en: "Sample document — not a valid tax invoice", ar: "مستند نموذجي — ليس فاتورة ضريبية صالحة" })}
        </div>
        <div className="mt-6 flex justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">{tx({ en: "Rental invoice", ar: "فاتورة الإيجار" })}</h2>
            <p className="text-sm text-slate">
              {tx({ en: "Invoice no.", ar: "رقم الفاتورة" })} INV-{b.ref.replace("DEMO-", "")} · {date(b.returnAt)}
            </p>
          </div>
          <div className="text-end text-sm">
            <div className="font-semibold">{tx({ en: "Concept prototype", ar: "نموذج تصوّري" })}</div>
            <div className="text-slate">{tx({ en: "VAT no.: 3XXXXXXXXXXXXX3 (placeholder)", ar: "الرقم الضريبي: 3XXXXXXXXXXXXX3 (مثال)" })}</div>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate">{tx({ en: "Billed to", ar: "إلى" })}</dt>
            <dd className="font-medium">
              {b.driver.firstName} {b.driver.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-slate">{tx({ en: "Reservation", ar: "الحجز" })}</dt>
            <dd className="font-mono font-medium">{b.ref}</dd>
          </div>
          <div>
            <dt className="text-slate">{t.search.pickup}</dt>
            <dd>{bn(b.pickupBranch)}</dd>
          </div>
          <div>
            <dt className="text-slate">{t.search.return}</dt>
            <dd>{bn(b.returnBranch)}</dd>
          </div>
        </dl>
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-start text-slate">
              <th className="py-2 text-start font-medium">{tx({ en: "Item", ar: "البند" })}</th>
              <th className="py-2 text-end font-medium">{t.common.total}</th>
            </tr>
          </thead>
          <tbody>
            {q.lines.map((l) => (
              <tr key={l.key} className="border-b border-ink/5">
                <td className="py-2">
                  {label(l.label)} {l.detail && <span className="text-xs text-slate">({l.detail})</span>}
                </td>
                <td className="py-2 text-end tabular-nums">{money(l.amount, { decimals: true })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-3 text-slate">{t.price.subtotal}</td>
              <td className="pt-3 text-end tabular-nums">{money(q.subtotal, { decimals: true })}</td>
            </tr>
            <tr>
              <td className="text-slate">{t.price.vat}</td>
              <td className="text-end tabular-nums">{money(q.vat, { decimals: true })}</td>
            </tr>
            <tr className="text-lg font-semibold">
              <td className="pt-2">{t.common.total}</td>
              <td className="pt-2 text-end tabular-nums">{money(q.total, { decimals: true })}</td>
            </tr>
          </tfoot>
        </table>
        <p className="mt-6 text-xs text-slate">{tx({ en: "A production system would issue ZATCA-compliant e-invoices (with QR code) from the billing backend.", ar: "يُصدر نظام الإنتاج فواتير إلكترونية متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (مع رمز QR) من نظام الفوترة." })}</p>
      </div>
    </div>
  );
}

function Modify({ b, onClose }: { b: Booking; onClose: () => void }) {
  const { t, tx, money } = useI18n();
  const { updateBooking } = useStore();
  const p0 = new Date(b.pickupAt);
  const r0 = new Date(b.returnAt);
  const [pd, setPd] = useState(toDateInput(p0));
  const [pt, setPt] = useState(`${pad(p0.getHours())}:${pad(p0.getMinutes())}`);
  const [rd, setRd] = useState(toDateInput(r0));
  const [rt, setRt] = useState(`${pad(r0.getHours())}:${pad(r0.getMinutes())}`);
  const [cover, setCover] = useState(b.cover);
  const pickup = combine(pd, pt);
  const ret = combine(rd, rt);
  const err = validateTrip(pickup, ret);
  const newTotal = err ? b.total : computeTotal({ ...b, pickupAt: pickup.toISOString(), returnAt: ret.toISOString(), cover });
  const diff = newTotal - b.total;
  return (
    <div role="dialog" aria-modal="true" aria-label={tx({ en: "Modify booking", ar: "تعديل الحجز" })} className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" data-testid="modify-dialog">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {tx({ en: "Modify", ar: "تعديل" })} <span className="font-mono">{b.ref}</span>
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-mist" aria-label={t.close} autoFocus>
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
          <label className="label col-span-2 !mb-0">{t.search.pickupDate}</label>
          <input type="date" className="field" value={pd} onChange={(e) => setPd(e.target.value)} aria-label={t.search.pickupDate} />
          <select className="field !w-24" value={pt} onChange={(e) => setPt(e.target.value)} aria-label={t.search.pickupTime}>
            {TIMES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <label className="label col-span-2 !mb-0 mt-2">{t.search.returnDate}</label>
          <input type="date" className="field" value={rd} onChange={(e) => setRd(e.target.value)} aria-label={t.search.returnDate} data-testid="modify-return-date" />
          <select className="field !w-24" value={rt} onChange={(e) => setRt(e.target.value)} aria-label={t.search.returnTime}>
            {TIMES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <label className="label col-span-2 !mb-0 mt-2">{tx({ en: "Cover", ar: "التغطية" })}</label>
          <select className="field col-span-2" value={cover} onChange={(e) => setCover(e.target.value as Booking["cover"])}>
            <option value="standard">{tx({ en: "Standard", ar: "أساسية" })}</option>
            <option value="super">{t.price.cover_super}</option>
            <option value="premium">{t.price.cover_premium}</option>
          </select>
        </div>
        {err && (
          <p className="mt-2 text-sm text-bad" role="alert">
            {t.search[err]}
          </p>
        )}
        <div className="mt-5 rounded-2xl bg-stone p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate">{tx({ en: "New estimated total", ar: "الإجمالي التقديري الجديد" })}</span>
            <span className="font-semibold" data-testid="modify-new-total">
              {money(newTotal, { decimals: true })}
            </span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-slate">{tx({ en: "Difference", ar: "الفرق" })}</span>
            <span className={clsx("font-semibold", diff > 0 ? "text-bad" : "text-ok")}>
              {diff >= 0 ? "+" : ""}
              {money(diff, { decimals: true })}
            </span>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className={btn.ghost}>
            {t.common.cancel}
          </button>
          <button
            disabled={!!err}
            onClick={() => {
              updateBooking(b.ref, { pickupAt: pickup.toISOString(), returnAt: ret.toISOString(), cover });
              onClose();
            }}
            className={btn.primary}
            data-testid="modify-save"
          >
            {tx({ en: "Save changes", ar: "حفظ التغييرات" })}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingRow({ b, highlight, onInvoice, onModify }: { b: Booking; highlight: boolean; onInvoice: () => void; onModify: () => void }) {
  const { t, tx, money, dateTime, date } = useI18n();
  const { cancelBooking } = useStore();
  const [confirming, setConfirming] = useState(false);
  const v = findVehicle(b.vehicleId);
  const { bn } = useBookingText();
  if (!v) return null;
  const statusTone = { upcoming: "bg-sky-50 text-sky-800", active: "bg-emerald-50 text-emerald-800", completed: "bg-slate-100 text-slate-700", cancelled: "bg-rose-50 text-rose-800" }[b.status];
  const statusLabel = {
    upcoming: tx({ en: "Upcoming", ar: "قادم" }),
    active: tx({ en: "Active", ar: "نشط" }),
    completed: tx({ en: "Completed", ar: "مكتمل" }),
    cancelled: tx({ en: "Cancelled", ar: "ملغى" }),
  }[b.status];
  const ev: Record<string, string> = { created: tx({ en: "Booked", ar: "تم الحجز" }), modified: tx({ en: "Modified", ar: "تم التعديل" }), cancelled: tx({ en: "Cancelled", ar: "تم الإلغاء" }), returned: tx({ en: "Returned", ar: "تمت الإعادة" }) };

  return (
    <article className={clsx("overflow-hidden rounded-3xl bg-white shadow-soft ring-2 transition", highlight ? "ring-ember" : "ring-transparent")} data-testid="booking-row" data-ref={b.ref} data-status={b.status}>
      <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr_auto]">
        <div className="rounded-2xl bg-stone p-3">
          <CarArt body={v.body} color={v.color} shadow={false} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold" dir="ltr">
              {b.ref}
            </span>
            <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusTone)} data-testid="booking-status">
              {statusLabel}
            </span>
          </div>
          <h3 className="mt-1 text-xl font-semibold">{v.model}</h3>
          <dl className="mt-3 grid gap-2 text-sm text-slate sm:grid-cols-2">
            <div className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <div>
                <dt className="sr-only">{t.search.pickup}</dt>
                <dd>{bn(b.pickupBranch)}</dd>
                {b.returnBranch !== b.pickupBranch && <dd>→ {bn(b.returnBranch)}</dd>}
              </div>
            </div>
            <div className="flex gap-2">
              <CalendarDays className="mt-0.5 size-4 shrink-0" aria-hidden />
              <div>
                <dd>{dateTime(b.pickupAt)}</dd>
                <dd>→ {dateTime(b.returnAt)}</dd>
              </div>
            </div>
          </dl>
          <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate" aria-label={tx({ en: "History", ar: "السجل" })}>
            {b.history.map((h, i) => (
              <li key={i} className="flex items-center gap-1">
                <Clock className="size-3" aria-hidden /> {ev[h.event] ?? h.event} · {date(h.at)}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <div className="text-xs text-slate">{tx({ en: "Estimated total", ar: "الإجمالي التقديري" })}</div>
          <div className="text-2xl font-semibold tracking-tight" data-testid="booking-total">
            {money(b.total, { decimals: true })}
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            {b.status === "upcoming" && (
              <>
                <button onClick={onModify} className={clsx(btn.ghost, "!px-3 !py-2")} data-testid="modify-booking">
                  <Pencil className="size-3.5" aria-hidden /> {t.common.edit}
                </button>
                <button onClick={() => setConfirming(true)} className={clsx(btn.ghost, "!px-3 !py-2 !text-bad")} data-testid="cancel-booking">
                  <Trash2 className="size-3.5" aria-hidden /> {t.common.cancel}
                </button>
              </>
            )}
            {b.status === "completed" && (
              <button onClick={onInvoice} className={clsx(btn.ghost, "!px-3 !py-2")} data-testid="view-invoice">
                <FileText className="size-3.5" aria-hidden /> {tx({ en: "Invoice", ar: "الفاتورة" })}
              </button>
            )}
            {b.status !== "upcoming" && (
              <L href={`/vehicles/${v.id}`} className={clsx(btn.ghost, "!px-3 !py-2")}>
                <RotateCcw className="size-3.5" aria-hidden /> {tx({ en: "Book again", ar: "احجز مجددًا" })}
              </L>
            )}
          </div>
        </div>
      </div>
      {confirming && (
        <div className="flex flex-wrap items-center gap-3 border-t border-rose-100 bg-rose-50 px-6 py-4 text-sm" role="alertdialog" aria-label={tx({ en: "Confirm cancellation", ar: "تأكيد الإلغاء" })}>
          <span className="flex-1 text-rose-950">{tx({ en: "Cancel this demo reservation? In this concept, cancellation is free.", ar: "هل تريد إلغاء هذا الحجز التجريبي؟ الإلغاء مجاني في هذا التصوّر." })}</span>
          <button onClick={() => setConfirming(false)} className={clsx(btn.ghost, "!py-2")}>
            {tx({ en: "Keep booking", ar: "الإبقاء على الحجز" })}
          </button>
          <button
            onClick={() => {
              cancelBooking(b.ref);
              setConfirming(false);
            }}
            className="rounded-full bg-bad px-4 py-2 font-semibold text-white"
            data-testid="confirm-cancel"
          >
            {tx({ en: "Yes, cancel", ar: "نعم، ألغِ" })}
          </button>
        </div>
      )}
    </article>
  );
}

export function MyBookingsView() {
  const { t, tx, num, money, locale } = useI18n();
  const params = useSearchParams();
  const { bookings, saved, prefs, setPrefs, resetDemo, ready } = useStore();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [invoice, setInvoice] = useState<Booking | null>(null);
  const [modify, setModify] = useState<Booking | null>(null);
  const [lookup, setLookup] = useState({ ref: "", last: "" });
  const [lookupMsg, setLookupMsg] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);
  const highlight = params.get("ref") ?? "";

  const now = Date.now();
  const groups = useMemo(() => {
    const up = bookings.filter((b) => b.status === "upcoming" && new Date(b.returnAt).getTime() > now).sort((a, b) => a.pickupAt.localeCompare(b.pickupAt));
    const past = bookings.filter((b) => b.status === "completed").sort((a, b) => b.pickupAt.localeCompare(a.pickupAt));
    const cancelled = bookings.filter((b) => b.status === "cancelled");
    return { upcoming: up, past, cancelled };
  }, [bookings, now]);

  const spent = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.total, 0);
  const points = Math.floor(spent / 100) + 214; // + simulated history
  const tier = points >= 600 ? "Platinum" : points >= 250 ? "Gold" : "Silver";
  const nextAt = tier === "Silver" ? 250 : tier === "Gold" ? 600 : null;

  const tabs: [Tab, string, number?][] = [
    ["upcoming", tx({ en: "Upcoming", ar: "القادمة" }), groups.upcoming.length],
    ["past", tx({ en: "Previous rentals", ar: "الإيجارات السابقة" }), groups.past.length],
    ["cancelled", tx({ en: "Cancelled", ar: "الملغاة" }), groups.cancelled.length],
    ["saved", tx({ en: "Saved vehicles", ar: "السيارات المحفوظة" }), saved.length],
    ["prefs", tx({ en: "Preferences", ar: "التفضيلات" })],
  ];

  function doLookup(e: React.FormEvent) {
    e.preventDefault();
    const b = bookings.find((x) => x.ref.toUpperCase() === lookup.ref.trim().toUpperCase() && x.driver.lastName.toLowerCase() === lookup.last.trim().toLowerCase());
    if (b) {
      setTab(b.status === "completed" ? "past" : b.status === "cancelled" ? "cancelled" : "upcoming");
      setLookupMsg(tx({ en: `Found ${b.ref}.`, ar: `تم العثور على ${b.ref}.` }));
      setTimeout(() => document.querySelector(`[data-ref="${b.ref}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    } else setLookupMsg(tx({ en: "No demo booking matches that reference and surname.", ar: "لا يوجد حجز تجريبي يطابق الرقم واسم العائلة." }));
  }

  const list = tab === "upcoming" ? groups.upcoming : tab === "past" ? groups.past : tab === "cancelled" ? groups.cancelled : [];

  return (
    <div className="min-h-screen bg-stone">
      <header className="bg-ink px-4 pb-28 pt-12 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm text-white/60">{tx({ en: "Welcome back,", ar: "أهلًا بعودتك،" })}</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{tx({ en: "Noura (demo account)", ar: "نورة (حساب تجريبي)" })}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge kind="simulated" className="!bg-white/10 !text-white !ring-white/20" />
            </div>
          </div>
          <form onSubmit={doLookup} className="glass flex flex-wrap items-end gap-2 rounded-2xl p-3" aria-label={tx({ en: "Find a booking", ar: "ابحث عن حجز" })}>
            <label className="text-xs">
              <span className="mb-1 block text-white/70">{tx({ en: "Booking number", ar: "رقم الحجز" })}</span>
              <input value={lookup.ref} onChange={(e) => setLookup({ ...lookup, ref: e.target.value })} className="w-40 rounded-xl bg-white px-3 py-2 text-sm text-ink" placeholder="DEMO-XXXXXX" dir="ltr" data-testid="lookup-ref" />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-white/70">{tx({ en: "Surname", ar: "اسم العائلة" })}</span>
              <input value={lookup.last} onChange={(e) => setLookup({ ...lookup, last: e.target.value })} className="w-32 rounded-xl bg-white px-3 py-2 text-sm text-ink" placeholder="Demo" data-testid="lookup-last" />
            </label>
            <button className={clsx(btn.primary, "!py-2")} data-testid="lookup-submit">
              <Search className="size-4" aria-hidden /> {t.common.search}
            </button>
            {lookupMsg && (
              <p className="w-full text-xs text-white/80" role="status">
                {lookupMsg}
              </p>
            )}
          </form>
        </div>
      </header>

      <div className="mx-auto -mt-20 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-gradient-to-br from-amber-200 via-amber-100 to-white p-6 shadow-soft md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Award className="size-5 text-amber-700" aria-hidden /> {tx({ en: "Loyalty status (concept)", ar: "حالة الولاء (تصوّر)" })}
              </div>
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{tier}</span>
            </div>
            <div className="mt-4 text-4xl font-semibold" data-testid="points">
              {num(points)} <span className="text-base font-medium text-slate">{tx({ en: "points", ar: "نقطة" })}</span>
            </div>
            {nextAt && (
              <>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-gradient-to-r from-ember to-amber-500" style={{ width: `${Math.min(100, (points / nextAt) * 100)}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate">{tx({ en: `${nextAt - points} points to the next tier. Tier rules modelled on the published programme; points here are simulated.`, ar: `${num(nextAt - points)} نقطة للفئة التالية. قواعد الفئات مستوحاة من البرنامج المنشور؛ النقاط هنا محاكاة.` })}</p>
              </>
            )}
          </div>
          {[
            [tx({ en: "Upcoming trips", ar: "رحلات قادمة" }), num(groups.upcoming.length)],
            [tx({ en: "Spent with us", ar: "إجمالي الإنفاق" }), money(spent)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="text-sm text-slate">{k}</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-soft" role="tablist">
          {tabs.map(([k, label, n]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={clsx("shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition", tab === k ? "bg-ink text-white" : "text-slate hover:text-ink")} data-testid={`tab-${k}`}>
              {label}
              {n !== undefined && <span className="ms-1.5 opacity-60">{num(n)}</span>}
            </button>
          ))}
        </div>

        <div className="py-8" role="tabpanel">
          {!ready ? (
            <div className="h-40 animate-pulse rounded-3xl bg-white" />
          ) : tab === "saved" ? (
            saved.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {saved.map((id) => {
                  const v = findVehicle(id);
                  return v ? <VehicleCard key={id} v={v} /> : null;
                })}
              </div>
            ) : (
              <p className="rounded-3xl bg-white p-10 text-center text-slate shadow-soft">
                <Heart className="mx-auto mb-3 size-6" aria-hidden />
                {tx({ en: "Tap the heart on any vehicle to save it here.", ar: "اضغط على القلب في أي سيارة لحفظها هنا." })}
              </p>
            )
          ) : tab === "prefs" ? (
            <form
              className="max-w-2xl space-y-5 rounded-3xl bg-white p-6 shadow-soft"
              onSubmit={(e) => {
                e.preventDefault();
                setSavedMsg(true);
                setTimeout(() => setSavedMsg(false), 2500);
              }}
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Settings2 className="size-5" aria-hidden /> {tx({ en: "Saved preferences", ar: "التفضيلات المحفوظة" })}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="label">{tx({ en: "Home city", ar: "المدينة الرئيسية" })}</span>
                  <select className="field" value={prefs.homeCity} onChange={(e) => setPrefs({ homeCity: e.target.value })}>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {locale === "ar" ? c.nameAr : c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="label">{tx({ en: "Preferred vehicle type", ar: "نوع السيارة المفضل" })}</span>
                  <select className="field" value={prefs.category} onChange={(e) => setPrefs({ category: e.target.value })}>
                    {Object.entries(t.cat).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="label">{tx({ en: "Default cover", ar: "التغطية الافتراضية" })}</span>
                  <select className="field" value={prefs.cover} onChange={(e) => setPrefs({ cover: e.target.value as typeof prefs.cover })}>
                    <option value="standard">{tx({ en: "Standard", ar: "أساسية" })}</option>
                    <option value="super">{t.price.cover_super}</option>
                    <option value="premium">{t.price.cover_premium}</option>
                  </select>
                </label>
                <label>
                  <span className="label">{tx({ en: "Notifications", ar: "الإشعارات" })}</span>
                  <select className="field" value={prefs.notifications} onChange={(e) => setPrefs({ notifications: e.target.value as typeof prefs.notifications })}>
                    <option value="email">{t.form.email}</option>
                    <option value="sms">SMS</option>
                    <option value="both">{tx({ en: "Email and SMS", ar: "البريد والرسائل" })}</option>
                  </select>
                </label>
              </div>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="size-4 accent-ember" checked={prefs.childSeat} onChange={(e) => setPrefs({ childSeat: e.target.checked })} />
                {tx({ en: "Always add a child seat", ar: "أضف مقعد أطفال دائمًا" })}
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="size-4 accent-ember" checked={prefs.marketing} onChange={(e) => setPrefs({ marketing: e.target.checked })} />
                {tx({ en: "Send me offers (opt-in, can be withdrawn any time — PDPL consent pattern)", ar: "أرسل لي العروض (اشتراك اختياري يمكن سحبه في أي وقت — نمط موافقة نظام حماية البيانات الشخصية)" })}
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button className={btn.primary}>{tx({ en: "Save preferences", ar: "حفظ التفضيلات" })}</button>
                {savedMsg && (
                  <span className="text-sm text-ok" role="status">
                    {tx({ en: "Saved in this browser.", ar: "تم الحفظ في هذا المتصفح." })}
                  </span>
                )}
                <button type="button" onClick={resetDemo} className="ms-auto text-sm text-slate underline" data-testid="reset-demo">
                  {tx({ en: "Reset demo data", ar: "إعادة ضبط البيانات التجريبية" })}
                </button>
              </div>
            </form>
          ) : list.length ? (
            <div className="space-y-4">
              {list.map((b) => (
                <BookingRow key={b.ref} b={b} highlight={b.ref === highlight} onInvoice={() => setInvoice(b)} onModify={() => setModify(b)} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center shadow-soft">
              <p className="text-slate">{tx({ en: "Nothing here yet.", ar: "لا يوجد شيء هنا بعد." })}</p>
              <L href="/find-a-car" className={clsx(btn.primary, "mt-4")}>
                {t.search.find}
              </L>
            </div>
          )}
          <div className="mt-6">
            <Notice>{tx({ en: "Fictional customer, synthetic reservations. Data lives only in this browser's local storage.", ar: "عميل وهمي وحجوزات اصطناعية. البيانات محفوظة في التخزين المحلي لهذا المتصفح فقط." })}</Notice>
          </div>
        </div>
      </div>
      {invoice && <Invoice b={invoice} onClose={() => setInvoice(null)} />}
      {modify && <Modify b={modify} onClose={() => setModify(null)} />}
    </div>
  );
}

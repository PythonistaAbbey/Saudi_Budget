/** SYNTHETIC data for the corporate fleet and admin dashboards. Fictional company. */

export const fleetCompany = { name: "Najd Logistics Co. (fictional)", nameAr: "شركة نجد اللوجستية (وهمية)", contractId: "LSE-DEMO-0042" };

export const allocation = [
  { dept: { en: "Sales", ar: "المبيعات" }, riyadh: 18, jeddah: 11, dammam: 6 },
  { dept: { en: "Field operations", ar: "العمليات الميدانية" }, riyadh: 22, jeddah: 14, dammam: 17 },
  { dept: { en: "Executive", ar: "الإدارة التنفيذية" }, riyadh: 6, jeddah: 2, dammam: 1 },
  { dept: { en: "Logistics", ar: "اللوجستيات" }, riyadh: 9, jeddah: 12, dammam: 10 },
];

export const contracts = [
  { id: "LSE-DEMO-0042", vehicles: 64, model: "Toyota Hilux D/C", start: "2025-02-01", months: 48, monthly: 1890, status: "active" },
  { id: "LSE-DEMO-0057", vehicles: 38, model: "Hyundai Sonata", start: "2025-09-15", months: 36, monthly: 2240, status: "active" },
  { id: "LSE-DEMO-0063", vehicles: 9, model: "Mercedes-Benz E-Class", start: "2026-01-10", months: 36, monthly: 5150, status: "active" },
  { id: "LSE-DEMO-0071", vehicles: 17, model: "Toyota Fortuner", start: "2026-12-01", months: 24, monthly: 2980, status: "pending" },
  { id: "LSE-DEMO-0019", vehicles: 22, model: "Hyundai Accent", start: "2022-07-01", months: 48, monthly: 1490, status: "ending" },
] as const;

export const maintenance = [
  { plate: "ABC 1234 (demo)", model: "Toyota Hilux D/C", type: { en: "15,000 km service", ar: "صيانة ١٥٬٠٠٠ كم" }, due: 3, city: "riyadh", status: "scheduled" },
  { plate: "DEF 5678 (demo)", model: "Hyundai Sonata", type: { en: "Tyre replacement", ar: "تغيير الإطارات" }, due: 6, city: "jeddah", status: "scheduled" },
  { plate: "GHI 9012 (demo)", model: "Toyota Fortuner", type: { en: "Windscreen repair", ar: "إصلاح الزجاج الأمامي" }, due: 0, city: "dammam", status: "in-progress" },
  { plate: "JKL 3456 (demo)", model: "Toyota Hilux D/C", type: { en: "Replacement vehicle issued", ar: "صرف سيارة بديلة" }, due: -2, city: "riyadh", status: "done" },
  { plate: "MNO 7890 (demo)", model: "Mercedes-Benz E-Class", type: { en: "5,000 km first service", ar: "الصيانة الأولى ٥٬٠٠٠ كم" }, due: 11, city: "riyadh", status: "scheduled" },
] as const;

export const expenses = [
  { m: "2026-05", lease: 286, fuel: 71, fines: 4, other: 9 },
  { m: "2026-06", lease: 286, fuel: 78, fines: 6, other: 7 },
  { m: "2026-07", lease: 291, fuel: 84, fines: 3, other: 11 },
  { m: "2026-08", lease: 291, fuel: 88, fines: 5, other: 8 },
  { m: "2026-09", lease: 302, fuel: 76, fines: 2, other: 10 },
  { m: "2026-10", lease: 302, fuel: 73, fines: 4, other: 6 },
]; // SAR thousands

/* ------------------------------------------------------------- Admin */
export const adminReservations = [
  { ref: "DEMO-7QK2MZ", customer: "Noura Demo", vehicle: "Toyota RAV4 Hybrid", branch: "ruh-t5", status: "confirmed", total: 1452.13 },
  { ref: "DEMO-H8T4WN", customer: "Noura Demo", vehicle: "Kia Carnival", branch: "jed-kaia", status: "confirmed", total: 4371.5 },
  { ref: "DEMO-K2L9QS", customer: "Faisal Sample", vehicle: "Toyota Camry", branch: "dmm-a5k", status: "picked-up", total: 822.8 },
  { ref: "DEMO-P4R7TX", customer: "Lina Example", vehicle: "Hyundai Accent", branch: "jed-hamra", status: "no-show", total: 371.45 },
  { ref: "DEMO-W8Z3NM", customer: "Omar Placeholder", vehicle: "BMW X5", branch: "ruh-intl", status: "returned", total: 5310.0 },
  { ref: "DEMO-C6V1BH", customer: "Reem Fictional", vehicle: "Toyota Land Cruiser", branch: "ruh-qiddiya", status: "confirmed", total: 3920.75 },
];

"use client";

import { Suspense } from "react";
import { motion } from "motion/react";
import { ArrowRight, Building2, CalendarRange, Car, Crown, Headset, MapPin, Phone, Plane, ShieldCheck, Sparkles, TrainFront, Wrench, Zap } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { HeroScene } from "@/components/HeroScene";
import { SearchWidget } from "@/components/SearchWidget";
import { CarArt } from "@/components/CarArt";
import { SaudiMap } from "@/components/SaudiMap";
import { Badge, Card, Eyebrow, H2, L, Section, SourceLink, btn } from "@/components/ui";
import { categories, vehicles } from "@/data/vehicles";
import { branches, cities } from "@/data/branches";
import { company, contact, loyaltyTiers, promotions, quickPass, SOURCES } from "@/content/verified";
import { SUGGESTIONS } from "@/components/Concierge";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export function HomeView() {
  const { t, tx, money, num, locale } = useI18n();

  const repFor = (c: string) => vehicles.filter((v) => v.category === c).sort((a, b) => a.dailyRate - b.dailyRate)[0];

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="relative -mt-16 min-h-[100svh] overflow-hidden text-white" aria-labelledby="hero-title">
        <HeroScene />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pb-10 pt-32 sm:px-6 md:pt-40">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles className="size-3.5 text-ember-2" aria-hidden />
              {tx({ en: "A concept for the next generation of Saudi mobility", ar: "تصوّر للجيل القادم من التنقّل في السعودية" })}
            </p>
            <h1 id="hero-title" className="text-5xl font-semibold leading-[0.95] tracking-tighter text-balance sm:text-7xl lg:text-8xl">
              {locale === "ar" ? (
                <>
                  رحلتك.
                  <br />
                  <span className="bg-gradient-to-l from-ember-2 to-white bg-clip-text text-transparent">بتصوّر جديد.</span>
                </>
              ) : (
                <>
                  YOUR JOURNEY.
                  <br />
                  <span className="bg-gradient-to-r from-ember-2 to-white bg-clip-text text-transparent">REIMAGINED.</span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80 text-pretty md:text-xl">
              {tx({
                en: "Discover smarter mobility across Saudi Arabia. Find the right vehicle, plan your journey, and experience effortless travel.",
                ar: "اكتشف تنقّلًا أذكى في أرجاء المملكة. اعثر على السيارة المناسبة، وخطّط لرحلتك، واستمتع بسفر بلا عناء.",
              })}
            </p>
            <p className="mt-2 text-[11px] text-white/45">{tx({ en: "Proposed concept messaging — not an official slogan.", ar: "رسالة تسويقية مقترحة — ليست شعارًا رسميًا." })}</p>
          </motion.div>
          <div className="flex-1" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }} className="relative mt-[38vh] md:mt-0">
            <Suspense fallback={<div className="h-40 rounded-[28px] bg-white/10" />}>
              <SearchWidget variant="hero" />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------- VERIFIED FACTS */}
      <section className="border-b border-ink/8 bg-white px-4 py-10 sm:px-6" aria-label={tx({ en: "Company facts", ar: "حقائق عن الشركة" })}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-5">
          {[
            [company.founded.value, tx({ en: "Founded — one office, 20 cars", ar: "التأسيس — مكتب واحد و٢٠ سيارة" })],
            [company.rentalOffices.value, tx({ en: "Rental offices", ar: "مكتب تأجير" })],
            [company.airportOffices.value.split(" ")[0], tx({ en: "Airport offices in 17 cities", ar: "مكتبًا في المطارات في ١٧ مدينة" })],
            [company.groupFleet.value.split(" ")[0], tx({ en: "Vehicles across the group fleet", ar: "مركبة في أسطول المجموعة" })],
            [company.ticker.value, tx({ en: "Listed on Tadawul since 2007", ar: "مدرجة في تداول منذ ٢٠٠٧" })],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-3xl font-semibold tracking-tight md:text-4xl">{v}</div>
              <div className="mt-1 text-sm text-slate">{l}</div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center gap-3">
          <Badge kind="verified" />
          <SourceLink href={SOURCES.about} />
          <SourceLink href={SOURCES.mubasher} />
        </div>
      </section>

      {/* ---------------------------------------------------------- CATEGORIES */}
      <Section tone="light">
        <motion.div {...fade} className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{tx({ en: "The fleet", ar: "الأسطول" })}</Eyebrow>
            <H2>{tx({ en: "A vehicle for every road in the Kingdom.", ar: "سيارة لكل طريق في المملكة." })}</H2>
          </div>
          <L href="/find-a-car" className={btn.ghost}>
            {tx({ en: "Browse all vehicles", ar: "تصفّح جميع السيارات" })} <ArrowRight className="rtl-flip size-4" aria-hidden />
          </L>
        </motion.div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => {
            const v = repFor(c);
            if (!v) return null;
            return (
              <motion.div key={c} {...fade} transition={{ ...fade.transition, delay: i * 0.05 }}>
                <L href={`/find-a-car?cat=${c}`} className={`group block overflow-hidden rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-lift ${c === "luxury" ? "bg-ink text-white" : "bg-white shadow-soft"}`} data-testid={`category-${c}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t.cat[c]}</h3>
                    <ArrowRight className="rtl-flip size-4 opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100 rtl:group-hover:-translate-x-1" aria-hidden />
                  </div>
                  <CarArt body={v.body} color={v.color} className="my-3 w-full transition duration-500 group-hover:scale-105" />
                  <p className="text-sm opacity-70">
                    {v.model} {t.v.orSimilar}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="opacity-60">{t.v.from}</span> <span className="font-semibold">{money(v.dailyRate)}</span>
                    <span className="opacity-60">{t.v.perDay}</span> <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">· {t.badge.simulated}</span>
                  </p>
                </L>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ---------------------------------------------------------- WAYS TO RENT (bento) */}
      <Section tone="dark" className="overflow-hidden">
        <motion.div {...fade}>
          <Eyebrow light>{tx({ en: "Ways to move", ar: "طرق التنقّل" })}</Eyebrow>
          <H2 className="max-w-3xl">{tx({ en: "From a weekend in Jeddah to a fleet for your whole company.", ar: "من عطلة نهاية أسبوع في جدة إلى أسطول لشركتك بأكملها." })}</H2>
        </motion.div>
        <div className="mt-12 grid gap-4 lg:grid-cols-6 lg:grid-rows-2">
          <motion.div {...fade} className="lg:col-span-3 lg:row-span-2">
            <L href="/find-a-car" className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-2 to-navy p-8">
              <Car className="size-8 text-ember-2" aria-hidden />
              <h3 className="mt-6 text-3xl font-semibold">{tx({ en: "Short-term rental", ar: "إيجار قصير الأجل" })}</h3>
              <p className="mt-3 max-w-md text-white/70">
                {tx({
                  en: "Daily and weekly rentals from airports, rail stations and city branches — with extras such as additional drivers, one-way rentals, GPS and mobile Wi-Fi.",
                  ar: "إيجار يومي وأسبوعي من المطارات ومحطات القطار وفروع المدن — مع إضافات مثل السائق الإضافي والتسليم في مدينة أخرى والملاحة والواي فاي المتنقل.",
                })}
              </p>
              <div className="mt-3">
                <Badge kind="verified" className="!bg-white/10 !text-white !ring-white/20" />
              </div>
              <CarArt body="suv" color="#c9a77b" className="absolute -bottom-6 end-[-8%] w-[85%] transition duration-700 group-hover:-translate-x-4 rtl:group-hover:translate-x-4" />
              <span className={`${btn.primary} relative mt-auto w-fit`}>
                {t.search.find} <ArrowRight className="rtl-flip size-4" aria-hidden />
              </span>
            </L>
          </motion.div>
          {[
            { href: "/wafi", Icon: CalendarRange, title: tx({ en: "WAFI long-term", ar: "وافي طويل الأجل" }), body: tx({ en: "Long-term car rental with a progressive discount — the longer you rent, the more you save.", ar: "إيجار سيارات طويل الأجل بخصم تصاعدي — كلما طالت المدة زاد التوفير." }), col: "lg:col-span-3" },
            { href: "/corporate", Icon: Building2, title: tx({ en: "Corporate leasing", ar: "تأجير الشركات" }), body: tx({ en: "No-down-payment options, unlimited mileage and maintenance included.", ar: "خيارات بدون دفعة أولى، وكيلومترات غير محدودة، وصيانة مشمولة." }), col: "lg:col-span-2" },
            { href: "/chauffeur", Icon: Crown, title: tx({ en: "Chauffeur drive", ar: "سائق خاص" }), body: tx({ en: "Business trips, events and intercity travel.", ar: "رحلات العمل والمناسبات والسفر بين المدن." }), col: "lg:col-span-1" },
          ].map((x) => (
            <motion.div {...fade} key={x.href} className={x.col}>
              <L href={x.href} className="group flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 transition hover:border-ember/60 hover:bg-white/[0.07]">
                <x.Icon className="size-7 text-ember-2" aria-hidden />
                <h3 className="mt-5 text-xl font-semibold">{x.title}</h3>
                <p className="mt-2 text-sm text-white/65">{x.body}</p>
                <span className="mt-auto pt-6 text-sm font-semibold text-ember-2">
                  {t.learnMore} <ArrowRight className="rtl-flip inline size-4" aria-hidden />
                </span>
              </L>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- CONCIERGE TEASER */}
      <Section tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div {...fade}>
            <Eyebrow>{tx({ en: "Mobility concierge", ar: "مساعد التنقّل" })}</Eyebrow>
            <H2>{tx({ en: "Describe the trip. We'll find the car.", ar: "صِف الرحلة. ونحن نجد السيارة." })}</H2>
            <p className="mt-5 max-w-lg text-lg text-slate">
              {tx({
                en: "A bilingual assistant that turns a sentence like “a comfortable SUV for a family trip from Riyadh to AlUla for five days” into matched vehicles and a pre-filled booking.",
                ar: "مساعد ثنائي اللغة يحوّل جملة مثل «سيارة SUV مريحة لرحلة عائلية من الرياض إلى العلا لمدة خمسة أيام» إلى سيارات مطابقة وحجز جاهز.",
              })}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge kind="proposed" />
              <Badge kind="prototype" />
            </div>
            <L href="/concierge" className={`${btn.primary} mt-8`}>
              <Sparkles className="size-4" aria-hidden /> {tx({ en: "Try the concierge", ar: "جرّب المساعد" })}
            </L>
          </motion.div>
          <motion.div {...fade} className="rounded-[2rem] bg-stone p-6">
            <div className="ms-auto max-w-[85%] rounded-2xl rounded-ee-sm bg-ember px-4 py-3 text-sm text-white">{SUGGESTIONS[0][locale]}</div>
            <div className="mt-4 max-w-[92%] rounded-2xl rounded-es-sm bg-white p-4 text-sm shadow-soft">
              <p>{tx({ en: "Pick-up in Riyadh, heading to AlUla, 5 days, family of 5. For long desert highways I'd favour comfort and a full-size boot:", ar: "الاستلام من الرياض، الوجهة العلا، ٥ أيام، عائلة من ٥ أفراد. للطرق الصحراوية الطويلة أنصح بالراحة وصندوق أمتعة واسع:" })}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["toyota-rav4", "toyota-fortuner", "toyota-landcruiser"].map((id) => {
                  const v = vehicles.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="rounded-xl bg-stone p-2 text-center">
                      <CarArt body={v.body} color={v.color} shadow={false} />
                      <div className="mt-1 truncate text-xs font-semibold">{v.model}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- PROMOTIONS */}
      <Section>
        <motion.div {...fade} className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{t.nav.promotions}</Eyebrow>
            <H2>{tx({ en: "Published offers, shown honestly.", ar: "العروض المنشورة، كما هي." })}</H2>
            <p className="mt-4 max-w-2xl text-slate">
              {tx({
                en: "These offers appear on the public promotions page, but most carry no published validity dates — so the concept labels them rather than presenting them as active.",
                ar: "تظهر هذه العروض في صفحة العروض العامة، لكن معظمها بلا تواريخ صلاحية منشورة — لذا يوضّح التصوّر حالتها بدل عرضها كعروض سارية.",
              })}
            </p>
          </div>
          <L href="/promotions" className={btn.ghost}>
            {t.common.viewAll} <ArrowRight className="rtl-flip size-4" aria-hidden />
          </L>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {promotions.slice(0, 3).map((p, i) => (
            <motion.div key={p.id} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }}>
              <Card className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <Badge kind={p.provenance} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                {p.detail && <p className="mt-2 text-sm text-slate">{p.detail}</p>}
                <SourceLink href={p.source} className="mt-auto pt-5" />
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- LOCATIONS PREVIEW */}
      <Section tone="dark">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <motion.div {...fade}>
            <Eyebrow light>{t.nav.locations}</Eyebrow>
            <H2>{tx({ en: "Airports, rail stations and city branches across the Kingdom.", ar: "مطارات ومحطات قطار وفروع مدن في أرجاء المملكة." })}</H2>
            <ul className="mt-8 space-y-4 text-white/80">
              <li className="flex gap-3">
                <Plane className="mt-0.5 size-5 shrink-0 text-ember-2" aria-hidden />
                {tx({ en: "20+ airport rental offices in 17 cities", ar: "أكثر من ٢٠ مكتبًا في المطارات في ١٧ مدينة" })}
              </li>
              <li className="flex gap-3">
                <TrainFront className="mt-0.5 size-5 shrink-0 text-ember-2" aria-hidden />
                {tx({ en: "Rail stations in Jeddah, Makkah, Madinah and KAEC", ar: "محطات القطار في جدة ومكة والمدينة ومدينة الملك عبدالله الاقتصادية" })}
              </li>
              <li className="flex gap-3">
                <Wrench className="mt-0.5 size-5 shrink-0 text-ember-2" aria-hidden />
                {tx({ en: "20+ workshops and 80+ mobile workshops", ar: "أكثر من ٢٠ ورشة و٨٠ ورشة متنقلة" })}
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge kind="verified" className="!bg-white/10 !text-white !ring-white/20" />
              <SourceLink href={SOURCES.about} className="!text-white/60" />
            </div>
            <L href="/locations" className={`${btn.primary} mt-8`}>
              <MapPin className="size-4" aria-hidden /> {tx({ en: "Open branch locator", ar: "افتح محدد الفروع" })}
            </L>
          </motion.div>
          <motion.div {...fade} className="relative">
            <SaudiMap />
            <p className="mt-2 text-center text-xs text-white/40">
              {tx({ en: `${num(branches.length)} branches with published details in ${num(3)} cities · ${num(cities.length)} cities shown`, ar: `${num(branches.length)} فرعًا بتفاصيل منشورة في ${num(3)} مدن · ${num(cities.length)} مدينة على الخريطة` })}
            </p>
          </motion.div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- LOYALTY + QUICK PASS */}
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div {...fade}>
            <Eyebrow>{tx({ en: "Loyalty", ar: "برنامج الولاء" })}</Eyebrow>
            <H2>{tx({ en: "Rewards that grow with every kilometre.", ar: "مكافآت تنمو مع كل كيلومتر." })}</H2>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {loyaltyTiers.value.map((tier, i) => (
                <div key={tier.tier} className={`rounded-2xl p-5 ${["bg-gradient-to-br from-slate-200 to-slate-100", "bg-gradient-to-br from-amber-200 to-amber-50", "bg-gradient-to-br from-ink to-navy text-white"][i]}`}>
                  <div className="text-sm font-bold">{tier.tier}</div>
                  <div className="mt-4 text-3xl font-semibold">{num(tier.discountPct)}%</div>
                  <div className="text-xs opacity-70">{tx({ en: "off walk-in rate", ar: "خصم على السعر المباشر" })}</div>
                  <div className="mt-3 text-xs opacity-80">
                    {num(tier.kmDaily)} {tx({ en: "km free daily", ar: "كم مجانًا يوميًا" })}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate">{tx({ en: "Earn one point for every SAR 100 spent. Points do not expire.", ar: "اكسب نقطة لكل ١٠٠ ريال تنفقها. النقاط لا تنتهي صلاحيتها." })}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Badge kind="verified" />
              <SourceLink href={loyaltyTiers.source} />
            </div>
          </motion.div>
          <motion.div {...fade} className="rounded-[2rem] bg-gradient-to-br from-navy to-ink p-8 text-white">
            <ShieldCheck className="size-8 text-ember-2" aria-hidden />
            <h3 className="mt-5 text-2xl font-semibold">{tx({ en: "Quick Pass at the airport", ar: "المسار السريع في المطار" })}</h3>
            <p className="mt-3 text-white/70">{tx({ en: "A fast-track airport lane for Corporate, Gold and Platinum customers, free of charge — at Riyadh, Jeddah and Dammam airports.", ar: "مسار سريع في المطار لعملاء الشركات والفئتين الذهبية والبلاتينية مجانًا — في مطارات الرياض وجدة والدمام." })}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {quickPass.airports.value.map((a) => (
                <li key={a.airport} className="rounded-xl bg-white/5 p-3 text-sm">
                  <div className="text-white/60">{a.airport}</div>
                  <a href={`tel:${a.phone.replace(/-/g, "")}`} className="font-semibold hover:text-ember-2" dir="ltr">
                    {a.phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Badge kind="verified" className="!bg-white/10 !text-white !ring-white/20" />
              <SourceLink href={quickPass.what.source} className="!text-white/60" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- CUSTOMER SERVICE */}
      <Section>
        <motion.div {...fade}>
          <Eyebrow>{t.nav.support}</Eyebrow>
          <H2>{tx({ en: "People on the line, day and night.", ar: "فريق جاهز على الخط ليلًا ونهارًا." })}</H2>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { Icon: Phone, title: tx({ en: "Reservations", ar: "الحجوزات" }), value: contact.reservations.value, href: `tel:${contact.reservations.value}`, note: tx({ en: "Sat–Thu 09:00–22:00 · Fri 17:00–22:00", ar: "السبت–الخميس ٠٩:٠٠–٢٢:٠٠ · الجمعة ١٧:٠٠–٢٢:٠٠" }) },
            { Icon: Zap, title: tx({ en: "24-hour roadside assistance", ar: "المساعدة على الطريق ٢٤ ساعة" }), value: contact.roadside.value, href: "tel:8002443399", note: tx({ en: "Open 24 hours a day, 7 days a week", ar: "على مدار الساعة طوال أيام الأسبوع" }) },
            { Icon: Headset, title: tx({ en: "Customer care", ar: "خدمة العملاء" }), value: contact.email.value, href: `mailto:${contact.email.value}`, note: tx({ en: "Post-rental enquiries", ar: "استفسارات ما بعد الإيجار" }) },
          ].map((c) => (
            <Card key={c.title}>
              <c.Icon className="size-6 text-ember" aria-hidden />
              <h3 className="mt-4 text-sm font-semibold text-slate">{c.title}</h3>
              <a href={c.href} className="mt-1 block text-2xl font-semibold tracking-tight hover:text-ember-ink" dir="ltr">
                {c.value}
              </a>
              <p className="mt-2 text-sm text-slate">{c.note}</p>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge kind="verified" />
          <SourceLink href={SOURCES.contact} />
          <L href="/support" className={btn.link + " ms-auto text-sm"}>
            {tx({ en: "Visit the support centre", ar: "زُر مركز الدعم" })} <ArrowRight className="rtl-flip size-4" aria-hidden />
          </L>
        </div>
      </Section>

      {/* ---------------------------------------------------------- CTA */}
      <section className="grain relative overflow-hidden bg-gradient-to-br from-ember to-ember-ink px-4 py-20 text-white sm:px-6">
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">{tx({ en: "Ready when you are. Keep moving.", ar: "جاهزون متى كنت جاهزًا. واصل التنقّل." })}</h2>
          <div className="flex flex-wrap gap-3">
            <L href="/find-a-car" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-ink hover:bg-stone">
              {t.search.find} <ArrowRight className="rtl-flip size-4" aria-hidden />
            </L>
            <L href="/my-bookings" className={btn.glass}>
              {t.nav.myBookings}
            </L>
          </div>
        </div>
      </section>
    </>
  );
}

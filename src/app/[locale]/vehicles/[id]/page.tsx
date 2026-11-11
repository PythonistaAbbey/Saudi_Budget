import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findVehicle, vehicles } from "@/data/vehicles";
import { locales } from "@/i18n/config";
import { VehicleDetailView } from "@/views/VehicleDetail";

export function generateStaticParams() {
  return locales.flatMap((locale) => vehicles.map((v) => ({ locale, id: v.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: findVehicle(id)?.model ?? "Vehicle" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = findVehicle(id);
  if (!v) notFound();
  return (
    <Suspense>
      <VehicleDetailView v={v} />
    </Suspense>
  );
}

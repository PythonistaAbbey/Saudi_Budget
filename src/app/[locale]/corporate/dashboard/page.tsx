import { Suspense } from "react";
import { FleetDashboardView } from "@/views/FleetDashboard";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Fleet dashboard", "لوحة الأسطول");

export default function Page() {
  return (
    <Suspense>
      <FleetDashboardView />
    </Suspense>
  );
}

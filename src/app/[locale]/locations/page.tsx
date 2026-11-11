import { Suspense } from "react";
import { LocationsView } from "@/views/Locations";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Branch locator", "محدد الفروع");

export default function Page() {
  return (
    <Suspense>
      <LocationsView />
    </Suspense>
  );
}

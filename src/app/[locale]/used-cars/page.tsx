import { Suspense } from "react";
import { UsedCarsView } from "@/views/UsedCars";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Used cars", "السيارات المستعملة");

export default function Page() {
  return (
    <Suspense>
      <UsedCarsView />
    </Suspense>
  );
}

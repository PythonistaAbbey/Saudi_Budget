import { Suspense } from "react";
import { FindCarView } from "@/views/FindCar";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Find a car", "ابحث عن سيارة");

export default function Page() {
  return (
    <Suspense>
      <FindCarView />
    </Suspense>
  );
}

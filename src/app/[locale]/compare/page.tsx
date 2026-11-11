import { Suspense } from "react";
import { CompareView } from "@/views/Compare";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Compare vehicles", "مقارنة السيارات");

export default function Page() {
  return (
    <Suspense>
      <CompareView />
    </Suspense>
  );
}

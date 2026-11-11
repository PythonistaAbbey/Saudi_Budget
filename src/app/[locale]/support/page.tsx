import { Suspense } from "react";
import { SupportView } from "@/views/Support";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Support centre", "مركز الدعم");

export default function Page() {
  return (
    <Suspense>
      <SupportView />
    </Suspense>
  );
}

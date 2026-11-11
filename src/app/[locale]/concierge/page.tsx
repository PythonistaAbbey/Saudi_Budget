import { Suspense } from "react";
import { ConciergeView } from "@/views/ConciergePage";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Mobility concierge", "مساعد التنقّل");

export default function Page() {
  return (
    <Suspense>
      <ConciergeView />
    </Suspense>
  );
}

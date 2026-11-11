import { Suspense } from "react";
import { PromotionsView } from "@/views/Promotions";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Offers", "العروض");

export default function Page() {
  return (
    <Suspense>
      <PromotionsView />
    </Suspense>
  );
}

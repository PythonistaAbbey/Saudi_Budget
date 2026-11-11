import { Suspense } from "react";
import { InvestorsView } from "@/views/Investors";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Investor relations", "علاقات المستثمرين");

export default function Page() {
  return (
    <Suspense>
      <InvestorsView />
    </Suspense>
  );
}

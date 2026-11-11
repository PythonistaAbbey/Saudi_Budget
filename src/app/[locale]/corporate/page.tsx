import { Suspense } from "react";
import { CorporateView } from "@/views/Corporate";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Corporate leasing", "تأجير الشركات");

export default function Page() {
  return (
    <Suspense>
      <CorporateView />
    </Suspense>
  );
}

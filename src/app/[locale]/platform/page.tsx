import { Suspense } from "react";
import { PlatformView } from "@/views/Platform";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Platform, security and privacy", "المنصة والأمان والخصوصية");

export default function Page() {
  return (
    <Suspense>
      <PlatformView />
    </Suspense>
  );
}

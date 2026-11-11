import { Suspense } from "react";
import { AboutView } from "@/views/About";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("About", "من نحن");

export default function Page() {
  return (
    <Suspense>
      <AboutView />
    </Suspense>
  );
}

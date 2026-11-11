import { Suspense } from "react";
import { WafiView } from "@/views/Wafi";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("WAFI long-term rental", "وافي للإيجار طويل الأجل");

export default function Page() {
  return (
    <Suspense>
      <WafiView />
    </Suspense>
  );
}

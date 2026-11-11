import { Suspense } from "react";
import { ChauffeurView } from "@/views/Chauffeur";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Chauffeur services", "خدمة السائق الخاص");

export default function Page() {
  return (
    <Suspense>
      <ChauffeurView />
    </Suspense>
  );
}

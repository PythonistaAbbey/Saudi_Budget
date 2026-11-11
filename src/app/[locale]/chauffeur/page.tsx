import { ChauffeurView } from "@/views/Chauffeur";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Chauffeur services", "خدمة السائق الخاص");

// No Suspense here: the view doesn't read search params, so it renders in one pass without a streamed hidden copy.
export default function Page() {
  return <ChauffeurView />;
}

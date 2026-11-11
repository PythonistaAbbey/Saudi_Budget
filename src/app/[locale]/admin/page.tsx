import { Suspense } from "react";
import { AdminView } from "@/views/Admin";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Admin (prototype)", "الإدارة (نموذج)");

export default function Page() {
  return (
    <Suspense>
      <AdminView />
    </Suspense>
  );
}

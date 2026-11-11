import { Suspense } from "react";
import { BookingView } from "@/views/Booking";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("Booking", "الحجز");

export default function Page() {
  return (
    <Suspense>
      <BookingView />
    </Suspense>
  );
}

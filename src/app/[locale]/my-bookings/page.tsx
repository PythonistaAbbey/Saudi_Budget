import { Suspense } from "react";
import { MyBookingsView } from "@/views/MyBookings";
import { pageMeta } from "@/lib/meta";

export const generateMetadata = pageMeta("My bookings", "حجوزاتي");

export default function Page() {
  return (
    <Suspense>
      <MyBookingsView />
    </Suspense>
  );
}

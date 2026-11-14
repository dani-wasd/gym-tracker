import { Suspense } from "react";
import { DashboardFrame } from "./frame";
import {
  LogbookSection,
  LogbookSkeleton,
  PlannerSection,
  PlannerSkeleton,
  WeekSection,
  WeekSkeleton,
} from "./sections";

/** Static text paints at once; each data-backed section streams in when ready. */
export default function DashboardPage() {
  return (
    <DashboardFrame
      week={
        <Suspense fallback={<WeekSkeleton />}>
          <WeekSection />
        </Suspense>
      }
      planner={
        <Suspense fallback={<PlannerSkeleton />}>
          <PlannerSection />
        </Suspense>
      }
      logbook={
        <Suspense fallback={<LogbookSkeleton />}>
          <LogbookSection />
        </Suspense>
      }
    />
  );
}

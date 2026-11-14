import { DashboardFrame } from "./frame";
import { LogbookSkeleton, PlannerSkeleton, WeekSkeleton } from "./sections";

/** Shown the instant the tab is clicked, before the server has answered. */
export default function DashboardLoading() {
  return (
    <DashboardFrame
      week={<WeekSkeleton />}
      planner={<PlannerSkeleton />}
      logbook={<LogbookSkeleton />}
    />
  );
}

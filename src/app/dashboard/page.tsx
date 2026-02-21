import ScheduleSelector from "@/src/components/schedule-select";
import LogWorkout from "@/src/components/log-workout";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10 items-center p-10 w-auto">
      <LogWorkout />
      <ScheduleSelector />
    </div>
  );
}

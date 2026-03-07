import ScheduleSelector from "@/src/components/schedule-select";
import LogWorkout from "@/src/components/log-workout";
import { auth } from "@/src/lib/authHelper";
import { getUserPublicData } from "@/src/lib/dashboardHelpers";

export default async function DashboardPage() {
  const user = await auth();
  const username: string = (await getUserPublicData(user.user.id)).username;

  return (
    <div className="flex flex-col gap-10 items-center p-10 w-auto">
      <p>Welcome <b>{username}</b>!</p>
      <LogWorkout userId={user.user.id} />
      <ScheduleSelector />
    </div>
  );
}
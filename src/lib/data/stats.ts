import type { User } from "@/src/lib/db/schemas";
import { shiftDate } from "@/src/lib/dates";
import { buildLifterStats, type LifterStats } from "@/src/lib/stats";
import { getPlansUpTo } from "./schedules";
import { currentWeekOf } from "./week-summary";
import { getSessionsBetween, getWorkoutTotals, type WorkoutTotals } from "./workouts";

/** How many weeks (including the current one) the stats page looks back over. */
export const STATS_WEEKS = 8;

export interface StatsReport {
  recent: LifterStats;
  allTime: WorkoutTotals;
}

export async function getStatsReport(
  user: Pick<User, "userId" | "timezone">,
): Promise<StatsReport> {
  const { today, weekStart } = currentWeekOf(user);
  const windowStart = shiftDate(weekStart, -7 * (STATS_WEEKS - 1));

  const [plans, sessions, allTime] = await Promise.all([
    getPlansUpTo(user.userId, weekStart),
    getSessionsBetween(user.userId, windowStart, shiftDate(weekStart, 6)),
    getWorkoutTotals(user.userId),
  ]);

  return {
    recent: buildLifterStats({
      currentWeekStart: weekStart,
      today,
      weekCount: STATS_WEEKS,
      plans,
      sessions,
    }),
    allTime,
  };
}

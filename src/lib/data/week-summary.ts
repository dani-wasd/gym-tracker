import { shiftDate, todayInTimezone, weekStartOf } from "@/src/lib/dates";
import type { User } from "@/src/lib/db/schemas";
import { buildWeekSummary, EMPTY_MASK, type WeekSummary } from "@/src/lib/week";
import { getEffectiveSchedule } from "./schedules";
import { timezoneOf } from "./users";
import { getSessionsBetween } from "./workouts";

/**
 * A user's current week, judged against *their own* clock. Whoever is looking
 * — the user or a friend on another continent — gets the same seven states.
 */
export async function getCurrentWeekSummary(
  user: Pick<User, "userId" | "timezone">,
): Promise<WeekSummary> {
  const today = todayInTimezone(timezoneOf(user));
  const weekStart = weekStartOf(today);
  const weekEnd = shiftDate(weekStart, 6);

  const [schedule, sessions] = await Promise.all([
    getEffectiveSchedule(user.userId, weekStart),
    getSessionsBetween(user.userId, weekStart, weekEnd),
  ]);

  return buildWeekSummary({
    weekStart,
    today,
    plannedMask: schedule?.plannedDays ?? EMPTY_MASK,
    sessions,
  });
}

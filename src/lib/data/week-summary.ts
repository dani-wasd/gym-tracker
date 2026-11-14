import { cache } from "react";
import { shiftDate, todayInTimezone, weekStartOf, type DateString } from "@/src/lib/dates";
import type { User } from "@/src/lib/db/schemas";
import { buildWeekSummary, EMPTY_MASK, type WeekSummary } from "@/src/lib/week";
import { getEffectiveSchedule } from "./schedules";
import { timezoneOf } from "./users";
import { getSessionsBetween } from "./workouts";

type Lifter = Pick<User, "userId" | "timezone">;

/** Where a user currently is in time, on their own clock. */
export function currentWeekOf(user: Pick<User, "timezone">): {
  today: DateString;
  weekStart: DateString;
} {
  const today = todayInTimezone(timezoneOf(user));
  return { today, weekStart: weekStartOf(today) };
}

export interface CurrentWeek {
  summary: WeekSummary;
  /** False for an account that has never planned a week. */
  hasPlan: boolean;
  plannedDays: number;
}

/**
 * A user's current week, judged against *their own* clock. Whoever is looking
 * — the user or a friend on another continent — gets the same seven states.
 */
export function getCurrentWeek(user: Lifter): Promise<CurrentWeek> {
  return loadCurrentWeek(user.userId, user.timezone);
}

/** Cached per request, so separate sections of one page share a single fetch. */
const loadCurrentWeek = cache(async (userId: string, timezone: Lifter["timezone"]) => {
  const { today, weekStart } = currentWeekOf({ timezone });

  const [schedule, sessions] = await Promise.all([
    getEffectiveSchedule(userId, weekStart),
    getSessionsBetween(userId, weekStart, shiftDate(weekStart, 6)),
  ]);

  const plannedDays = schedule?.plannedDays ?? EMPTY_MASK;
  return {
    summary: buildWeekSummary({ weekStart, today, plannedMask: plannedDays, sessions }),
    hasPlan: schedule !== null,
    plannedDays,
  } satisfies CurrentWeek;
});

import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/src/lib/db/connection";
import { workouts, type Workout } from "@/src/lib/db/schemas";
import { MINUTE_MS, type MuscleGroup } from "@/src/lib/definitions";
import { type DateString, formatTimeInTimezone } from "@/src/lib/dates";
import type { ValidWorkout } from "@/src/lib/validation";
import type { Session } from "@/src/lib/week";

export async function insertWorkout(
  userId: string,
  scheduleId: number,
  workout: ValidWorkout,
): Promise<void> {
  await db.insert(workouts).values({
    userId,
    scheduleId,
    startTime: workout.startTime,
    endTime: workout.endTime,
    localDate: workout.localDate,
    recordedTimezone: workout.timezone,
    musclesWorked: workout.muscles,
  });
}

/** Workouts whose local date falls within [from, to], oldest first. */
export async function getSessionsBetween(
  userId: string,
  from: DateString,
  to: DateString,
): Promise<Session[]> {
  const rows = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.localDate, from),
        lte(workouts.localDate, to),
      ),
    )
    .orderBy(workouts.startTime);
  return rows.map(toSession);
}

export async function getRecentSessions(
  userId: string,
  limit: number,
): Promise<Session[]> {
  const rows = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.startTime))
    .limit(limit);
  return rows.map(toSession);
}

/**
 * Times are rendered in the timezone the workout was recorded in, so "5 PM
 * Monday" reads as 5 PM Monday for everyone, wherever they are.
 */
function toSession(workout: Workout): Session {
  const { startTime, endTime, recordedTimezone } = workout;
  return {
    id: workout.id,
    date: workout.localDate,
    startLabel: formatTimeInTimezone(startTime, recordedTimezone),
    endLabel: formatTimeInTimezone(endTime, recordedTimezone),
    minutes: Math.round((endTime.getTime() - startTime.getTime()) / MINUTE_MS),
    muscles: (workout.musclesWorked ?? []) as MuscleGroup[],
  };
}

export interface WorkoutTotals {
  sessions: number;
  totalMinutes: number;
  longestMinutes: number;
}

/** All-time totals, added up by the database. */
export async function getWorkoutTotals(userId: string): Promise<WorkoutTotals> {
  const minutes = sql<number>`extract(epoch from ${workouts.endTime} - ${workouts.startTime}) / 60`;
  const [totals] = await db
    .select({
      sessions: sql<number>`count(*)`.mapWith(Number),
      totalMinutes: sql<number>`coalesce(sum(${minutes}), 0)`.mapWith(Number),
      longestMinutes: sql<number>`coalesce(max(${minutes}), 0)`.mapWith(Number),
    })
    .from(workouts)
    .where(eq(workouts.userId, userId));
  return totals;
}

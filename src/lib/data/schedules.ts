import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "@/src/lib/db/connection";
import { weeklySchedules } from "@/src/lib/db/schemas";
import type { DateString } from "@/src/lib/dates";
import { EMPTY_MASK } from "@/src/lib/week";

export type WeeklySchedule = typeof weeklySchedules.$inferSelect;

/** The schedule explicitly saved for one week, if any. */
export async function getSchedule(
  userId: string,
  weekStart: DateString,
): Promise<WeeklySchedule | null> {
  const schedule = await db.query.weeklySchedules.findFirst({
    where: and(
      eq(weeklySchedules.userId, userId),
      eq(weeklySchedules.weekStartDate, weekStart),
    ),
  });
  return schedule ?? null;
}

/**
 * The plan in force for a week: the one saved for it, otherwise the most
 * recent earlier plan carried forward. Null when the user has never planned.
 */
export async function getEffectiveSchedule(
  userId: string,
  weekStart: DateString,
): Promise<WeeklySchedule | null> {
  const schedule = await db.query.weeklySchedules.findFirst({
    where: and(
      eq(weeklySchedules.userId, userId),
      lte(weeklySchedules.weekStartDate, weekStart),
    ),
    orderBy: [desc(weeklySchedules.weekStartDate)],
  });
  return schedule ?? null;
}

export async function upsertSchedule(
  userId: string,
  weekStart: DateString,
  plannedDays: number,
): Promise<void> {
  await db
    .insert(weeklySchedules)
    .values({ userId, weekStartDate: weekStart, plannedDays })
    .onConflictDoUpdate({
      target: [weeklySchedules.userId, weeklySchedules.weekStartDate],
      set: { plannedDays },
    });
}

/**
 * Returns the week's schedule row, creating it from the carried-forward plan
 * if this is the first thing to touch that week.
 */
export async function ensureSchedule(
  userId: string,
  weekStart: DateString,
): Promise<WeeklySchedule> {
  const existing = await getSchedule(userId, weekStart);
  if (existing) return existing;

  const carried = await getEffectiveSchedule(userId, weekStart);
  await db
    .insert(weeklySchedules)
    .values({
      userId,
      weekStartDate: weekStart,
      plannedDays: carried?.plannedDays ?? EMPTY_MASK,
    })
    .onConflictDoNothing();

  const created = await getSchedule(userId, weekStart);
  if (!created) throw new Error("Failed to create weekly schedule.");
  return created;
}

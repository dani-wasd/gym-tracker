"use server";

import { db } from "@/src/lib/db/connection";
import { workouts, weeklySchedules } from "@/src/lib/db/schemas/index";
import { and, eq, desc } from "drizzle-orm";
import { startOfWeek, format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { muscleGroup } from "@/src/lib/definitions";
import { LIMITS } from "@/src/lib/definitions";

export async function saveWorkout(userId: string, workoutData: any) {
  const validatedData = validateWorkoutData(workoutData);

  const workoutDate = parseISO(validatedData.localDate);
  const sunday = format(startOfWeek(workoutDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');

  // Schedule Lookup / Auto-creation logic
  let currentSchedule = await db.query.weeklySchedules.findFirst({
    where: and(
      eq(weeklySchedules.userId, userId),
      eq(weeklySchedules.weekStartDate, sunday)
    )
  });

  if (!currentSchedule) {
    const lastSchedule = await db.query.weeklySchedules.findFirst({
      where: eq(weeklySchedules.userId, userId),
      orderBy: [desc(weeklySchedules.weekStartDate)],
    });

    const [newSchedule] = await db.insert(weeklySchedules).values({
      userId,
      weekStartDate: sunday,
      plannedDays: lastSchedule?.plannedDays ?? 0, // Default to none if no last schedule
    }).returning();
    
    currentSchedule = newSchedule;
  }

  // Workout Creation
  await db.insert(workouts).values({
    userId,
    scheduleId: currentSchedule.id,
    startTime: new Date(validatedData.startTime),
    endTime: new Date(validatedData.endTime),
    localDate: validatedData.localDate,
    recordedTimezone: validatedData.recordedTimezone,
    musclesWorked: validatedData.musclesWorked,
  });

  return { success: true };
}

function validateWorkoutData(workoutData: {
  startTime: string;
  endTime: string;
  localDate: string;
  recordedTimezone: string;
  musclesWorked: muscleGroup[];
}) {
  const { startTime, endTime, localDate, recordedTimezone } = workoutData;

  // Presence Check
  if (!startTime || !endTime || !localDate || !recordedTimezone) {
    throw new Error("Invalid request: Missing required time metadata.");
  }

  const startMs = Date.parse(startTime);
  const endMs = Date.parse(endTime);
  const now = Date.now();

  // Check if absolute startTime actually fall on the localDate
  // Convert the UTC startTime to the user's recorded timezone and check the date string.
  const zonedStartTime = toZonedTime(new Date(startMs), recordedTimezone);
  const actualLocalDate = format(zonedStartTime, 'yyyy-MM-dd');

  if (actualLocalDate !== localDate) {
    throw new Error(`Timezone mismatch: Start time resolves to ${actualLocalDate}, but local date provided was ${localDate}.`);
  }

  // Chronological & Duration Checks
  if (startMs >= endMs) throw new Error("Workout cannot end before it starts.");
  
  const duration = endMs - startMs;
  if (duration < LIMITS.MIN_DURATION) throw new Error("Workout must be at least 10 minutes.");

  // Past/Future Window Checks
  if (startMs < now - LIMITS.SUBMISSION_WINDOW) {
    throw new Error("Submission window expired (max 24 hours ago).");
  }
  if (startMs > now + LIMITS.FUTURE_BUFFER) {
    throw new Error("Cannot record workouts in the future.");
  }

  // Cap duration at 10 hours if it exceeds it
  if (duration > LIMITS.MAX_DURATION) {
    workoutData.endTime = new Date(startMs + LIMITS.MAX_DURATION).toISOString();
  }

  return workoutData;
}

export async function saveWorkoutSchedule(nextWeek: String, scheduleBitMask: number) {

}
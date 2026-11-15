"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/src/lib/auth";
import { shiftDate, todayInTimezone, weekStartOf } from "@/src/lib/dates";
import {
  ensureSchedule,
  getEffectiveSchedule,
  upsertSchedule,
} from "@/src/lib/data/schedules";
import { timezoneOf } from "@/src/lib/data/users";
import { insertWorkout } from "@/src/lib/data/workouts";
import type { ActionResult } from "@/src/lib/definitions";
import { ROUTES } from "@/src/lib/routes";
import { parseWorkout, type WorkoutInput } from "@/src/lib/validation";
import { isValidMask, type PlanTarget } from "@/src/lib/week";

export async function logWorkout(
  input: Omit<WorkoutInput, "timezone">,
): Promise<ActionResult> {
  const profile = await requireProfile();

  // The saved timezone, not the device's, decides which day this counts for,
  // so the workout always lands in the same week the plan is judged in.
  const parsed = parseWorkout({ ...input, timezone: timezoneOf(profile) });
  if (!parsed.ok) return parsed;
  const workout = parsed.value;

  const schedule = await ensureSchedule(
    profile.userId,
    weekStartOf(workout.localDate),
  );
  await insertWorkout(profile.userId, schedule.id, workout);

  revalidatePath(ROUTES.dashboard);
  return { ok: true };
}

/**
 * Saves the plan for next week. The current week can only be set while it has
 * no plan at all (a brand-new account) — otherwise a missed day could simply
 * be un-planned after the fact.
 */
export async function savePlan(
  target: PlanTarget,
  plannedDays: number,
): Promise<ActionResult> {
  const profile = await requireProfile();

  if (!isValidMask(plannedDays)) {
    return { ok: false, error: "That isn't a valid week." };
  }

  const currentWeek = weekStartOf(todayInTimezone(timezoneOf(profile)));

  if (target === "current") {
    const existing = await getEffectiveSchedule(profile.userId, currentWeek);
    if (existing) {
      return { ok: false, error: "This week already has a plan." };
    }
    await upsertSchedule(profile.userId, currentWeek, plannedDays);
  } else {
    await upsertSchedule(profile.userId, shiftDate(currentWeek, 7), plannedDays);
  }

  revalidatePath(ROUTES.dashboard);
  return { ok: true };
}

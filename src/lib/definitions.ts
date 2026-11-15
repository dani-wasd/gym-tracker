export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export type Day = (typeof DAYS)[number];

export const MUSCLE_GROUPS = [
  "Chest",
  "Lats",
  "Upper Back",
  "Traps",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Abs",
  "Lower Back",
  "Glutes",
  "Quads",
  "Hamstrings",
  "Calves",
  "Cardio",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

/** Coarser groups that older workouts were logged with, and what they cover. */
const LEGACY_MUSCLE_GROUPS: Record<string, MuscleGroup[]> = {
  Back: ["Lats", "Upper Back"],
  Legs: ["Quads", "Hamstrings", "Glutes"],
  "Full Body": ["Chest", "Upper Back", "Shoulders", "Quads", "Glutes", "Abs"],
};

export const isMuscleGroup = (value: unknown): value is MuscleGroup =>
  MUSCLE_GROUPS.includes(value as MuscleGroup);

/** Stored muscle names → today's list, in list order, expanding the old groups. */
export function normalizeMuscles(stored: readonly string[]): MuscleGroup[] {
  const named = new Set(
    stored.flatMap((name) => (isMuscleGroup(name) ? [name] : (LEGACY_MUSCLE_GROUPS[name] ?? []))),
  );
  return MUSCLE_GROUPS.filter((muscle) => named.has(muscle));
}

export const MINUTE_MS = 60 * 1000;
export const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export const LIMITS = {
  MIN_DURATION: 10 * MINUTE_MS,
  MAX_DURATION: 10 * HOUR_MS,
  SUBMISSION_WINDOW: DAY_MS,
  FUTURE_BUFFER: 5 * MINUTE_MS,
};

export const DEFAULT_TIMEZONE = "UTC";

/** What every server action hands back to the client. */
export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

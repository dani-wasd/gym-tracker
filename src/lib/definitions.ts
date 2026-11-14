export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export type Day = (typeof DAYS)[number];

export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Abs",
  "Full Body",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const MINUTE_MS = 60 * 1000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

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

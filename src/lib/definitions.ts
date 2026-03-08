export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type muscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Legs' | 'Abs' | 'Full Body';

export const MINUTE_MS = 60 * 1000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export const LIMITS = {
  MIN_DURATION: 10 * MINUTE_MS,
  MAX_DURATION: 10 * HOUR_MS,
  SUBMISSION_WINDOW: DAY_MS,
  FUTURE_BUFFER: 5 * MINUTE_MS,
};
import { LIMITS, MUSCLE_GROUPS, type MuscleGroup } from "./definitions";
import { type DateString, dateInTimezone, isValidTimezone } from "./dates";

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

const fail = (error: string): Parsed<never> => ({ ok: false, error });

/* ---------- auth ---------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_.-]{2,24}$/;
const MIN_PASSWORD_LENGTH = 8;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  return EMAIL_PATTERN.test(email) && email.length <= 254 ? email : null;
}

export interface Credentials {
  email: string;
  password: string;
}

export function parseCredentials(formData: FormData): Parsed<Credentials> {
  const email = normalizeEmail(formData.get("email"));
  const password = formData.get("password");

  if (!email) return fail("Enter a valid email address.");
  if (typeof password !== "string" || password.length === 0) {
    return fail("Enter your password.");
  }
  return { ok: true, value: { email, password } };
}

export interface SignupInput extends Credentials {
  username: string;
  timezone: string;
}

export function parseSignup(formData: FormData): Parsed<SignupInput> {
  const credentials = parseCredentials(formData);
  if (!credentials.ok) return credentials;

  const username = String(formData.get("username") ?? "").trim();
  const timezone = formData.get("timezone");

  if (!USERNAME_PATTERN.test(username)) {
    return fail("Username: 2–24 letters, numbers, dots, dashes or underscores.");
  }
  if (credentials.value.password.length < MIN_PASSWORD_LENGTH) {
    return fail(`Password needs at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (!isValidTimezone(timezone)) {
    return fail("Couldn't read your timezone. Reload and try again.");
  }
  return { ok: true, value: { ...credentials.value, username, timezone } };
}

/* ---------- workouts ---------- */

export interface WorkoutInput {
  startTime: string;
  endTime: string;
  timezone: string;
  muscles: string[];
}

export interface ValidWorkout {
  startTime: Date;
  endTime: Date;
  /** The date the workout started on, in the timezone it was recorded in. */
  localDate: DateString;
  timezone: string;
  muscles: MuscleGroup[];
}

const isMuscleGroup = (value: unknown): value is MuscleGroup =>
  MUSCLE_GROUPS.includes(value as MuscleGroup);

export function parseWorkout(
  input: WorkoutInput,
  now: number = Date.now(),
): Parsed<ValidWorkout> {
  const startMs = Date.parse(input?.startTime);
  const rawEndMs = Date.parse(input?.endTime);

  if (Number.isNaN(startMs) || Number.isNaN(rawEndMs)) {
    return fail("Start and end time are required.");
  }
  if (!isValidTimezone(input.timezone)) {
    return fail("Couldn't read your timezone. Reload and try again.");
  }
  if (!Array.isArray(input.muscles) || input.muscles.length === 0) {
    return fail("Pick at least one muscle group.");
  }
  if (!input.muscles.every(isMuscleGroup)) {
    return fail("Unknown muscle group.");
  }

  if (startMs >= rawEndMs) return fail("A workout can't end before it starts.");
  if (rawEndMs - startMs < LIMITS.MIN_DURATION) {
    return fail("Too short to count — a workout is at least 10 minutes.");
  }
  if (startMs < now - LIMITS.SUBMISSION_WINDOW) {
    return fail("Too late — workouts must be logged within 24 hours.");
  }
  if (rawEndMs > now + LIMITS.FUTURE_BUFFER) {
    return fail("That workout hasn't happened yet.");
  }

  // Forgot to stop the clock? Cap it rather than reject it.
  const endMs = Math.min(rawEndMs, startMs + LIMITS.MAX_DURATION);
  const startTime = new Date(startMs);

  return {
    ok: true,
    value: {
      startTime,
      endTime: new Date(endMs),
      localDate: dateInTimezone(startTime, input.timezone),
      timezone: input.timezone,
      muscles: [...new Set(input.muscles)] as MuscleGroup[],
    },
  };
}

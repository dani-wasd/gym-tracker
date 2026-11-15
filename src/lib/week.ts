import { DAYS, type Day, type MuscleGroup } from "./definitions";
import { type DateString, weekDates } from "./dates";

/* ---------- planned-days bitmask (bit 0 = Sunday … bit 6 = Saturday) ---------- */

export const EMPTY_MASK = 0;
const FULL_WEEK_MASK = 127;

export function isDayPlanned(mask: number, dayIndex: number): boolean {
  return (mask & (1 << dayIndex)) !== 0;
}

export function toggleDay(mask: number, dayIndex: number): number {
  return mask ^ (1 << dayIndex);
}

export function plannedDayNames(mask: number): Day[] {
  return DAYS.filter((_, index) => isDayPlanned(mask, index));
}

export function isValidMask(mask: unknown): mask is number {
  return (
    typeof mask === "number" &&
    Number.isInteger(mask) &&
    mask >= EMPTY_MASK &&
    mask <= FULL_WEEK_MASK
  );
}

/** Which week a plan is being saved for. */
export type PlanTarget = "current" | "next";

/* ---------- week summary ---------- */

/**
 * done    – planned and lifted
 * extra   – lifted on a day that wasn't planned (doesn't count for consistency)
 * missed  – planned, the day is over, nothing logged
 * due     – planned for today, nothing logged yet
 * pending – planned for a later day this week
 * rest    – nothing planned, nothing logged
 */
export type DayStatus = "done" | "extra" | "missed" | "due" | "pending" | "rest";

/** An exercise as it reads in the logbook, e.g. "Bench press · 3 × 8 @ 60 kg". */
export interface SessionExercise {
  name: string;
  /** Sets in gym shorthand; empty when none were noted. */
  sets: string;
}

/** One logged workout, already formatted in the lifter's own wall-clock time. */
export interface Session {
  id: number;
  date: DateString;
  startLabel: string;
  endLabel: string;
  minutes: number;
  muscles: MuscleGroup[];
  exercises: SessionExercise[];
}

export interface WeekDay {
  index: number;
  date: DateString;
  name: Day;
  planned: boolean;
  isToday: boolean;
  status: DayStatus;
  sessions: Session[];
}

export interface WeekSummary {
  weekStart: DateString;
  weekEnd: DateString;
  days: WeekDay[];
  plannedCount: number;
  doneCount: number;
  missedCount: number;
  extraCount: number;
}

function resolveDayStatus(
  planned: boolean,
  worked: boolean,
  date: DateString,
  today: DateString,
): DayStatus {
  if (worked) return planned ? "done" : "extra";
  if (!planned) return "rest";
  if (date < today) return "missed";
  return date === today ? "due" : "pending";
}

/**
 * Pure: turns a plan, the sessions logged that week, and the lifter's own
 * "today" into the seven day states. `today` must be the date in the lifter's
 * timezone — that is what keeps a friend's week correct for every viewer.
 */
export function buildWeekSummary(input: {
  weekStart: DateString;
  today: DateString;
  plannedMask: number;
  sessions: Session[];
}): WeekSummary {
  const { weekStart, today, plannedMask, sessions } = input;

  const days = weekDates(weekStart).map((date, index): WeekDay => {
    const daySessions = sessions.filter((session) => session.date === date);
    const planned = isDayPlanned(plannedMask, index);
    return {
      index,
      date,
      name: DAYS[index],
      planned,
      isToday: date === today,
      status: resolveDayStatus(planned, daySessions.length > 0, date, today),
      sessions: daySessions,
    };
  });

  const count = (status: DayStatus) =>
    days.filter((day) => day.status === status).length;

  return {
    weekStart,
    weekEnd: days[6].date,
    days,
    plannedCount: days.filter((day) => day.planned).length,
    doneCount: count("done"),
    missedCount: count("missed"),
    extraCount: count("extra"),
  };
}

/** One-line verdict on a week, e.g. "2 of 4 lifted · 1 missed · due today". */
export function describeWeek(summary: WeekSummary): string {
  if (summary.plannedCount === 0) {
    return summary.extraCount > 0
      ? `Nothing planned · ${summary.extraCount} extra`
      : "Nothing planned";
  }

  const parts = [`${summary.doneCount} of ${summary.plannedCount} lifted`];
  if (summary.missedCount > 0) parts.push(`${summary.missedCount} missed`);
  if (summary.extraCount > 0) parts.push(`${summary.extraCount} extra`);
  if (summary.days.some((day) => day.status === "due")) parts.push("due today");
  return parts.join(" · ");
}

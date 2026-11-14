import { MUSCLE_GROUPS, type MuscleGroup } from "./definitions";
import { shiftDate, type DateString } from "./dates";
import { buildWeekSummary, EMPTY_MASK, type Session, type WeekSummary } from "./week";

/** A saved plan, as needed to work out which plan was in force in any week. */
export interface PlanRecord {
  weekStart: DateString;
  plannedDays: number;
}

export interface MuscleCount {
  muscle: MuscleGroup;
  sessions: number;
}

export interface LifterStats {
  /** Newest first; the first entry is the week in progress. */
  weeks: WeekSummary[];
  /** Planned days that have come and gone, and how many of them were lifted. */
  plannedDaysElapsed: number;
  plannedDaysLifted: number;
  /** Lifted ÷ elapsed, 0–1. Null until at least one planned day has passed. */
  consistency: number | null;
  /** Consecutive weeks, counting back from now, with a plan and no missed day. */
  cleanWeekStreak: number;
  /** Sessions per muscle group across `weeks`, most-trained first. */
  muscleSplit: MuscleCount[];
}

/** The plan in force for a week: the latest one saved on or before it. */
function plannedDaysFor(weekStart: DateString, plans: PlanRecord[]): number {
  let plannedDays = EMPTY_MASK;
  for (const plan of plans) {
    if (plan.weekStart > weekStart) break;
    plannedDays = plan.plannedDays;
  }
  return plannedDays;
}

function countCleanWeekStreak(weeks: WeekSummary[]): number {
  const [current, ...past] = weeks;
  if (!current || current.missedCount > 0) return 0;

  // The week in progress only counts once every planned day is lifted;
  // until then it neither adds to the streak nor breaks it.
  const currentIsComplete =
    current.plannedCount > 0 && current.doneCount === current.plannedCount;

  let streak = currentIsComplete ? 1 : 0;
  for (const week of past) {
    if (week.plannedCount === 0 || week.missedCount > 0) break;
    streak += 1;
  }
  return streak;
}

function countMuscles(sessions: Session[]): MuscleCount[] {
  return MUSCLE_GROUPS.map((muscle) => ({
    muscle,
    sessions: sessions.filter((session) => session.muscles.includes(muscle)).length,
  })).sort((a, b) => b.sessions - a.sessions);
}

/**
 * Pure: rebuilds the last `weekCount` weeks from saved plans and logged
 * sessions, then scores them. `plans` must be sorted oldest first.
 */
export function buildLifterStats(input: {
  currentWeekStart: DateString;
  today: DateString;
  weekCount: number;
  plans: PlanRecord[];
  sessions: Session[];
}): LifterStats {
  const { currentWeekStart, today, weekCount, plans, sessions } = input;

  const allWeeks = Array.from({ length: weekCount }, (_, weeksAgo) => {
    const weekStart = shiftDate(currentWeekStart, -7 * weeksAgo);
    return buildWeekSummary({
      weekStart,
      today,
      plannedMask: plannedDaysFor(weekStart, plans),
      sessions,
    });
  });

  // Don't hold weeks from before the account was in use against the lifter.
  const isActive = (week: WeekSummary) =>
    week.plannedCount > 0 || week.days.some((day) => day.sessions.length > 0);
  const oldestActive = allWeeks.findLastIndex(isActive);
  const weeks = allWeeks.slice(0, Math.max(oldestActive + 1, 1));

  const plannedDaysLifted = weeks.reduce((sum, week) => sum + week.doneCount, 0);
  const plannedDaysElapsed =
    plannedDaysLifted + weeks.reduce((sum, week) => sum + week.missedCount, 0);

  const oldestDate = weeks[weeks.length - 1].weekStart;
  return {
    weeks,
    plannedDaysElapsed,
    plannedDaysLifted,
    consistency: plannedDaysElapsed > 0 ? plannedDaysLifted / plannedDaysElapsed : null,
    cleanWeekStreak: countCleanWeekStreak(weeks),
    muscleSplit: countMuscles(sessions.filter((session) => session.date >= oldestDate)),
  };
}

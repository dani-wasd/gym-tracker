import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

/**
 * A calendar date with no time or timezone attached, formatted `yyyy-MM-dd`.
 * Everything that decides "which day did this happen on" works in these, so a
 * Monday workout stays a Monday no matter who is looking at it or from where.
 */
export type DateString = string;

const DATE_FORMAT = "yyyy-MM-dd";
const WEEK_STARTS_ON = 0; // Sunday

export function isValidTimezone(timezone: unknown): timezone is string {
  if (typeof timezone !== "string" || timezone.length === 0) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/** The calendar date an instant falls on for someone living in `timezone`. */
export function dateInTimezone(instant: Date, timezone: string): DateString {
  return formatInTimeZone(instant, timezone, DATE_FORMAT);
}

export function todayInTimezone(timezone: string): DateString {
  return dateInTimezone(new Date(), timezone);
}

export function shiftDate(date: DateString, days: number): DateString {
  return format(addDays(parseISO(date), days), DATE_FORMAT);
}

/** The Sunday that opens the week containing `date`. */
export function weekStartOf(date: DateString): DateString {
  return format(
    startOfWeek(parseISO(date), { weekStartsOn: WEEK_STARTS_ON }),
    DATE_FORMAT,
  );
}

export function weekDates(weekStart: DateString): DateString[] {
  return Array.from({ length: 7 }, (_, index) => shiftDate(weekStart, index));
}

/** Formats a plain calendar date, e.g. `formatDate("2026-11-15", "EEE d MMM")`. */
export function formatDate(date: DateString, pattern: string): string {
  return format(parseISO(date), pattern);
}

/** e.g. "Nov 15 — 21", or "Nov 29 — Dec 5" when the week straddles months. */
export function formatWeekRange(weekStart: DateString, weekEnd: DateString): string {
  const sameMonth = weekStart.slice(0, 7) === weekEnd.slice(0, 7);
  return `${formatDate(weekStart, "MMM d")} — ${formatDate(weekEnd, sameMonth ? "d" : "MMM d")}`;
}

/** Value for an `<input type="datetime-local">`, in the browser's own timezone. */
export function toDateTimeInputValue(instant: Date): string {
  return format(instant, "yyyy-MM-dd'T'HH:mm");
}

/** Stopwatch reading: "7:05", or "1:07:05" past the hour. */
export function formatElapsed(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const pad = (value: number) => value.toString().padStart(2, "0");
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds % 60)}`
    : `${minutes}:${pad(seconds % 60)}`;
}

/** Wall-clock time of an instant as seen in `timezone`, e.g. "5:02 PM". */
export function formatTimeInTimezone(instant: Date, timezone: string): string {
  return formatInTimeZone(instant, timezone, "h:mm a");
}

/** e.g. "Tue 9:14 PM" — what the clock on their wall says right now. */
export function localClockLabel(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, "EEE h:mm a");
}

/** e.g. "UTC+08:00" */
export function timezoneOffsetLabel(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, "'UTC'xxx");
}

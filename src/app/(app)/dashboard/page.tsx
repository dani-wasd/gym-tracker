import { PlateLegend } from "@/src/components/barbell/legend";
import { WeekBar } from "@/src/components/barbell/week-bar";
import { Logbook } from "@/src/components/session/logbook";
import { SessionConsole } from "@/src/components/session/session-console";
import { WeekPlanner, type PlannableWeek } from "@/src/components/week-planner";
import { requireProfile } from "@/src/lib/auth";
import { getEffectiveSchedule, getSchedule } from "@/src/lib/data/schedules";
import { timezoneOf } from "@/src/lib/data/users";
import { getCurrentWeekSummary } from "@/src/lib/data/week-summary";
import { getRecentSessions } from "@/src/lib/data/workouts";
import { formatWeekRange, shiftDate, timezoneOffsetLabel } from "@/src/lib/dates";
import { describeWeek, EMPTY_MASK } from "@/src/lib/week";

const LOGBOOK_LENGTH = 8;

export default async function DashboardPage() {
  const profile = await requireProfile();
  const week = await getCurrentWeekSummary(profile);
  const nextWeekStart = shiftDate(week.weekStart, 7);

  const [currentPlan, nextPlan, recentSessions] = await Promise.all([
    getEffectiveSchedule(profile.userId, week.weekStart),
    getSchedule(profile.userId, nextWeekStart),
    getRecentSessions(profile.userId, LOGBOOK_LENGTH),
  ]);

  const plannableWeeks: PlannableWeek[] = [
    {
      target: "next",
      title: "Next week",
      range: formatWeekRange(nextWeekStart, shiftDate(nextWeekStart, 6)),
      plannedDays: nextPlan?.plannedDays ?? currentPlan?.plannedDays ?? EMPTY_MASK,
      isSaved: nextPlan !== null,
    },
  ];
  // A brand-new account has no plan in force yet, so it may set this week once.
  if (!currentPlan) {
    plannableWeeks.unshift({
      target: "current",
      title: "This week",
      range: formatWeekRange(week.weekStart, week.weekEnd),
      plannedDays: EMPTY_MASK,
      isSaved: false,
    });
  }

  return (
    <div className="flex flex-col gap-16 sm:gap-20">
      <section>
        <p className="eyebrow">
          This week · your clock is {timezoneOffsetLabel(timezoneOf(profile))}
        </p>
        <h1 className="headline mt-2 text-[clamp(3.5rem,13vw,9rem)]">
          {formatWeekRange(week.weekStart, week.weekEnd)}
        </h1>
        <p className="mt-3 font-display text-2xl leading-none font-bold uppercase tracking-wide text-steel">
          {describeWeek(week)}
        </p>

        <WeekBar summary={week} />
        <PlateLegend className="mt-8" />
      </section>

      <SessionConsole />
      <WeekPlanner weeks={plannableWeeks} />
      <Logbook sessions={recentSessions} />
    </div>
  );
}

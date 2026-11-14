import { PlateLegend } from "@/src/components/barbell/legend";
import { WeekBar } from "@/src/components/barbell/week-bar";
import { Logbook } from "@/src/components/session/logbook";
import { SessionConsole } from "@/src/components/session/session-console";
import { PageHeader } from "@/src/components/ui/page-header";
import { WeekPlanner, type PlannableWeek } from "@/src/components/week-planner";
import { requireProfile } from "@/src/lib/auth";
import { getSchedule } from "@/src/lib/data/schedules";
import { timezoneOf } from "@/src/lib/data/users";
import { currentWeekOf, getCurrentWeek } from "@/src/lib/data/week-summary";
import { getRecentSessions } from "@/src/lib/data/workouts";
import { formatWeekRange, shiftDate, timezoneOffsetLabel } from "@/src/lib/dates";
import { describeWeek, EMPTY_MASK } from "@/src/lib/week";

const LOGBOOK_LENGTH = 8;

export default async function DashboardPage() {
  const profile = await requireProfile();
  const nextWeekStart = shiftDate(currentWeekOf(profile).weekStart, 7);

  // One parallel batch: every query here is a separate trip to the database.
  const [currentWeek, nextPlan, recentSessions] = await Promise.all([
    getCurrentWeek(profile),
    getSchedule(profile.userId, nextWeekStart),
    getRecentSessions(profile.userId, LOGBOOK_LENGTH),
  ]);
  const week = currentWeek.summary;

  const plannableWeeks: PlannableWeek[] = [
    {
      target: "next",
      title: "Next week",
      range: formatWeekRange(nextWeekStart, shiftDate(nextWeekStart, 6)),
      plannedDays: nextPlan?.plannedDays ?? currentWeek.plannedDays,
      isSaved: nextPlan !== null,
    },
  ];
  // A brand-new account has no plan in force yet, so it may set this week once.
  if (!currentWeek.hasPlan) {
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
        <PageHeader
          eyebrow={`This week · your clock is ${timezoneOffsetLabel(timezoneOf(profile))}`}
          title={formatWeekRange(week.weekStart, week.weekEnd)}
          subtitle={describeWeek(week)}
        />
        <WeekBar summary={week} />
        <PlateLegend className="mt-8" />
      </section>

      <SessionConsole />
      <WeekPlanner weeks={plannableWeeks} />
      <Logbook sessions={recentSessions} />
    </div>
  );
}

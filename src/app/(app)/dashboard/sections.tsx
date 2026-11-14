import { Rack } from "@/src/components/rack/rack";
import { WeekRack } from "@/src/components/rack/week-rack";
import { LogbookEntries } from "@/src/components/session/logbook";
import { PageHeader } from "@/src/components/ui/page-header";
import { LoadingRegion, SkeletonText } from "@/src/components/ui/skeleton";
import { WeekPlanner, type PlannableWeek } from "@/src/components/week-planner";
import { requireProfile } from "@/src/lib/auth";
import { getSchedule } from "@/src/lib/data/schedules";
import { timezoneOf } from "@/src/lib/data/users";
import { currentWeekOf, getCurrentWeek } from "@/src/lib/data/week-summary";
import { getRecentSessions } from "@/src/lib/data/workouts";
import { formatWeekRange, shiftDate, timezoneOffsetLabel } from "@/src/lib/dates";
import { describeWeek, EMPTY_MASK } from "@/src/lib/week";

/*
 * The data-backed parts of "My week". Each section fetches for itself and
 * streams in on its own; each has a placeholder of the same shape.
 */

const LOGBOOK_LENGTH = 8;
const WEEK_EYEBROW = "This week";

/* ---------- this week ---------- */

export async function WeekSection() {
  const profile = await requireProfile();
  const { summary } = await getCurrentWeek(profile);

  return (
    <>
      <PageHeader
        eyebrow={`${WEEK_EYEBROW} · your clock is ${timezoneOffsetLabel(timezoneOf(profile))}`}
        title={formatWeekRange(summary.weekStart, summary.weekEnd)}
        subtitle={describeWeek(summary)}
      />
      <WeekRack summary={summary} />
    </>
  );
}

export function WeekSkeleton() {
  return (
    <LoadingRegion label="this week">
      <PageHeader
        eyebrow={WEEK_EYEBROW}
        title={<SkeletonText width="7ch" />}
        subtitle={<SkeletonText width="16ch" />}
      />
      <Rack>{null}</Rack>
      <div className="min-h-24 border-l-4 border-iron pl-4">
        <SkeletonText width="14ch" className="font-display text-3xl sm:text-4xl" />
        <SkeletonText width="26ch" className="mt-2 text-sm" />
      </div>
    </LoadingRegion>
  );
}

/* ---------- planner ---------- */

export async function PlannerSection() {
  const profile = await requireProfile();
  const nextWeekStart = shiftDate(currentWeekOf(profile).weekStart, 7);

  const [currentWeek, nextPlan] = await Promise.all([
    getCurrentWeek(profile),
    getSchedule(profile.userId, nextWeekStart),
  ]);
  const week = currentWeek.summary;

  const weeks: PlannableWeek[] = [
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
    weeks.unshift({
      target: "current",
      title: "This week",
      range: formatWeekRange(week.weekStart, week.weekEnd),
      plannedDays: EMPTY_MASK,
      isSaved: false,
    });
  }

  return <WeekPlanner weeks={weeks} />;
}

export function PlannerSkeleton() {
  return (
    <section>
      <p className="eyebrow">Planner</p>
      <h2 className="headline mt-1 text-5xl">Next week</h2>
      <LoadingRegion label="planner">
        <Rack className="mt-6">{null}</Rack>
        <SkeletonText width="34ch" className="text-sm" />
        <SkeletonText width="9ch" className="mt-4 text-4xl" />
      </LoadingRegion>
    </section>
  );
}

/* ---------- logbook ---------- */

export async function LogbookSection() {
  const profile = await requireProfile();
  const sessions = await getRecentSessions(profile.userId, LOGBOOK_LENGTH);
  return <LogbookEntries sessions={sessions} />;
}

export function LogbookSkeleton() {
  return (
    <LoadingRegion label="logbook">
      <ul className="border-t border-iron">
        {["11ch", "9ch", "12ch"].map((width) => (
          <li
            key={width}
            className="grid grid-cols-[1fr_auto] items-center gap-x-6 border-b border-iron py-3 sm:grid-cols-[9rem_14rem_5rem_1fr]"
          >
            <SkeletonText width="7ch" className="font-display text-2xl" />
            <SkeletonText width="16ch" className="text-sm" />
            <SkeletonText width="5ch" className="hidden text-sm sm:flex" />
            <SkeletonText width={width} className="hidden text-sm sm:flex" />
          </li>
        ))}
      </ul>
    </LoadingRegion>
  );
}

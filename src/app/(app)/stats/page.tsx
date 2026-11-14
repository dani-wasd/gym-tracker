import { RackLegend } from "@/src/components/rack/legend";
import { MuscleSplit } from "@/src/components/stats/muscle-split";
import { StatTile } from "@/src/components/stats/stat-tile";
import { WeekHistory } from "@/src/components/stats/week-history";
import { PageHeader } from "@/src/components/ui/page-header";
import { requireProfile } from "@/src/lib/auth";
import { getStatsReport, STATS_WEEKS } from "@/src/lib/data/stats";

export default async function StatsPage() {
  const profile = await requireProfile();
  const { recent, allTime } = await getStatsReport(profile);

  const hasSessions = allTime.sessions > 0;
  const averageMinutes = hasSessions
    ? Math.round(allTime.totalMinutes / allTime.sessions)
    : 0;

  return (
    <div className="flex flex-col gap-16">
      <PageHeader
        eyebrow={`Your statistics · last ${STATS_WEEKS} weeks and all time`}
        title="The numbers"
      />

      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        <StatTile
          label="Consistency"
          value={recent.consistency === null ? "—" : `${Math.round(recent.consistency * 100)}%`}
          detail={
            recent.consistency === null
              ? "No planned day has passed yet"
              : `${recent.plannedDaysLifted} of ${recent.plannedDaysElapsed} planned days lifted`
          }
        />
        <StatTile
          label="Clean weeks"
          value={String(recent.cleanWeekStreak)}
          detail="In a row with no missed day"
        />
        <StatTile
          label="Sessions"
          value={String(allTime.sessions)}
          detail={hasSessions ? `All time · ${averageMinutes} min on average` : "All time"}
        />
        <StatTile
          label="Hours"
          value={(allTime.totalMinutes / 60).toFixed(1)}
          detail={
            hasSessions
              ? `All time · longest ${Math.round(allTime.longestMinutes)} min`
              : "All time"
          }
        />
      </dl>

      <section>
        <p className="eyebrow">Week by week</p>
        <h2 className="headline mt-1 mb-6 text-5xl">The record</h2>
        <WeekHistory weeks={recent.weeks} />
        <RackLegend className="mt-6" />
      </section>

      <section>
        <p className="eyebrow">Sessions per muscle group · last {STATS_WEEKS} weeks</p>
        <h2 className="headline mt-1 mb-6 text-5xl">The split</h2>
        {hasSessions ? (
          <MuscleSplit split={recent.muscleSplit} />
        ) : (
          <p className="text-sm text-steel">Log a session and the split shows up here.</p>
        )}
      </section>
    </div>
  );
}

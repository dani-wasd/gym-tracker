import { cache } from "react";
import { Rack } from "@/src/components/rack/rack";
import { MuscleSplit } from "@/src/components/stats/muscle-split";
import { StatTile } from "@/src/components/stats/stat-tile";
import { WeekHistory } from "@/src/components/stats/week-history";
import { LoadingRegion, SkeletonText } from "@/src/components/ui/skeleton";
import { requireProfile } from "@/src/lib/auth";
import { getStatsReport, type StatsReport } from "@/src/lib/data/stats";

/* The data-backed parts of "The numbers". All of them share one fetch. */

const loadReport = cache(async () => getStatsReport(await requireProfile()));

/* ---------- headline numbers ---------- */

/** The four tiles. Without a report, the labels still show and the numbers shimmer. */
function Tiles({ report }: { report?: StatsReport }) {
  const value = (text: (report: StatsReport) => string, width: string) =>
    report ? text(report) : <SkeletonText width={width} />;
  const detail = (text: (report: StatsReport) => string) =>
    report ? text(report) : <SkeletonText width="18ch" />;

  const hasSessions = (report?.allTime.sessions ?? 0) > 0;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
      <StatTile
        label="Consistency"
        value={value(
          ({ recent }) =>
            recent.consistency === null ? "—" : `${Math.round(recent.consistency * 100)}%`,
          "3ch",
        )}
        detail={detail(({ recent }) =>
          recent.consistency === null
            ? "No planned day has passed yet"
            : `${recent.plannedDaysLifted} of ${recent.plannedDaysElapsed} planned days lifted`,
        )}
      />
      <StatTile
        label="Clean weeks"
        value={value(({ recent }) => String(recent.cleanWeekStreak), "1.5ch")}
        detail="In a row with no missed day"
      />
      <StatTile
        label="Sessions"
        value={value(({ allTime }) => String(allTime.sessions), "2ch")}
        detail={detail(({ allTime }) =>
          hasSessions
            ? `All time · ${Math.round(allTime.totalMinutes / allTime.sessions)} min on average`
            : "All time",
        )}
      />
      <StatTile
        label="Hours"
        value={value(({ allTime }) => (allTime.totalMinutes / 60).toFixed(1), "3ch")}
        detail={detail(({ allTime }) =>
          hasSessions
            ? `All time · longest ${Math.round(allTime.longestMinutes)} min`
            : "All time",
        )}
      />
    </dl>
  );
}

export async function TilesSection() {
  return <Tiles report={await loadReport()} />;
}

export function TilesSkeleton() {
  return (
    <LoadingRegion label="your numbers">
      <Tiles />
    </LoadingRegion>
  );
}

/* ---------- week by week ---------- */

export async function HistorySection() {
  const { recent } = await loadReport();
  return <WeekHistory weeks={recent.weeks} />;
}

export function HistorySkeleton() {
  return (
    <LoadingRegion label="week by week">
      <ul className="border-t border-iron">
        {["9ch", "10ch", "8ch"].map((width) => (
          <li
            key={width}
            className="grid items-center gap-x-8 border-b border-iron py-4 sm:grid-cols-[13rem_1fr]"
          >
            <div>
              <SkeletonText width={width} className="font-display text-2xl" />
              <SkeletonText width="20ch" className="mt-1 text-xs" />
            </div>
            <Rack size="sm" className="mt-3 mb-5">
              {null}
            </Rack>
          </li>
        ))}
      </ul>
    </LoadingRegion>
  );
}

/* ---------- muscle split ---------- */

export async function SplitSection() {
  const { recent, allTime } = await loadReport();

  if (allTime.sessions === 0) {
    return <p className="text-sm text-steel">Log a session and the split shows up here.</p>;
  }
  return <MuscleSplit split={recent.muscleSplit} />;
}

export function SplitSkeleton() {
  return (
    <LoadingRegion label="muscle split">
      <ul className="flex flex-col gap-3">
        {["85%", "70%", "55%", "40%", "20%"].map((width) => (
          <li
            key={width}
            className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 sm:grid-cols-[9rem_1fr_2rem]"
          >
            <SkeletonText width="7ch" className="font-display text-xl" />
            <span className="h-3 bg-iron/50">
              <span className="skeleton block h-full" style={{ width }} />
            </span>
            <span />
          </li>
        ))}
      </ul>
    </LoadingRegion>
  );
}

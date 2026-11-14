import { Suspense } from "react";
import { StatsFrame } from "./frame";
import {
  HistorySection,
  HistorySkeleton,
  SplitSection,
  SplitSkeleton,
  TilesSection,
  TilesSkeleton,
} from "./sections";

/** Static text paints at once; each data-backed section streams in when ready. */
export default function StatsPage() {
  return (
    <StatsFrame
      tiles={
        <Suspense fallback={<TilesSkeleton />}>
          <TilesSection />
        </Suspense>
      }
      history={
        <Suspense fallback={<HistorySkeleton />}>
          <HistorySection />
        </Suspense>
      }
      split={
        <Suspense fallback={<SplitSkeleton />}>
          <SplitSection />
        </Suspense>
      }
    />
  );
}

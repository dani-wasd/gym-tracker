import { StatsFrame } from "./frame";
import { HistorySkeleton, SplitSkeleton, TilesSkeleton } from "./sections";

/** Shown the instant the tab is clicked, before the server has answered. */
export default function StatsLoading() {
  return (
    <StatsFrame
      tiles={<TilesSkeleton />}
      history={<HistorySkeleton />}
      split={<SplitSkeleton />}
    />
  );
}

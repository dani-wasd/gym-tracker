import { StackLegend } from "@/src/components/stack/legend";
import { PageHeader } from "@/src/components/ui/page-header";
import { STATS_WEEKS } from "@/src/lib/data/stats";

interface StatsFrameProps {
  tiles: React.ReactNode;
  history: React.ReactNode;
  split: React.ReactNode;
}

/** The static parts of "The numbers", with slots for the parts that need data. */
export function StatsFrame({ tiles, history, split }: StatsFrameProps) {
  return (
    <div className="flex flex-col gap-16">
      <PageHeader
        eyebrow={`Your statistics · last ${STATS_WEEKS} weeks and all time`}
        title="The numbers"
      />

      {tiles}

      <section>
        <p className="eyebrow">Week by week</p>
        <h2 className="headline mt-1 mb-6 text-5xl">The record</h2>
        {history}
        <StackLegend className="mt-6" />
      </section>

      <section>
        <p className="eyebrow">Sessions per muscle group · last {STATS_WEEKS} weeks</p>
        <h2 className="headline mt-1 mb-6 text-5xl">The split</h2>
        {split}
      </section>
    </div>
  );
}

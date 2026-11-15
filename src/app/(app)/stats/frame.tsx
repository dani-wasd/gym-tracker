import { StackLegend } from "@/src/components/stack/legend";
import { PageHeader } from "@/src/components/ui/page-header";
import { Section } from "@/src/components/ui/section";
import { STATS_WEEKS } from "@/src/lib/data/stats";

interface StatsFrameProps {
  tiles: React.ReactNode;
  history: React.ReactNode;
  split: React.ReactNode;
}

/** The static parts of the Stats tab, with slots for the parts that need data. */
export function StatsFrame({ tiles, history, split }: StatsFrameProps) {
  return (
    <div className="flex flex-col gap-16">
      <PageHeader eyebrow={`Last ${STATS_WEEKS} weeks and all time`} title="Stats" />

      {tiles}

      <Section eyebrow="Week by week" title="The record">
        {history}
        <StackLegend className="mt-6" />
      </Section>

      <Section
        eyebrow={`Workouts per muscle group · last ${STATS_WEEKS} weeks`}
        title="The split"
      >
        {split}
      </Section>
    </div>
  );
}

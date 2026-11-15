import { StackLegend } from "@/src/components/stack/legend";
import { Logbook } from "@/src/components/session/logbook";
import { SessionConsole } from "@/src/components/session/session-console";

interface DashboardFrameProps {
  /** This week's header and stack. */
  week: React.ReactNode;
  planner: React.ReactNode;
  logbook: React.ReactNode;
}

/**
 * Everything on "My week" that needs no data, with slots for the parts that
 * do. The page fills the slots with live sections; `loading.tsx` fills them
 * with placeholders, so the two always line up.
 */
export function DashboardFrame({ week, planner, logbook }: DashboardFrameProps) {
  return (
    <div className="flex flex-col gap-16 sm:gap-20">
      <section>
        {week}
        <StackLegend className="mt-8" />
      </section>

      <SessionConsole />
      {planner}
      <Logbook>{logbook}</Logbook>
    </div>
  );
}

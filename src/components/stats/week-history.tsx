import { DumbbellShape, Rack, RackSlot } from "@/src/components/rack/rack";
import { STATUS_META } from "@/src/components/rack/status";
import { formatDate, formatWeekRange } from "@/src/lib/dates";
import { describeWeek, type WeekSummary } from "@/src/lib/week";

/** Past weeks as a wall of small racks, newest on top. */
export function WeekHistory({ weeks }: { weeks: WeekSummary[] }) {
  return (
    <ol className="border-t border-iron">
      {weeks.map((week, index) => (
        <li
          key={week.weekStart}
          className="grid items-center gap-x-8 border-b border-iron py-4 sm:grid-cols-[13rem_1fr]"
        >
          <div>
            <p className="font-display text-2xl leading-none font-extrabold uppercase">
              {index === 0 ? "This week" : formatWeekRange(week.weekStart, week.weekEnd)}
            </p>
            <p className="mt-1 text-xs text-steel">{describeWeek(week)}</p>
          </div>

          <Rack size="sm" className="mt-3 mb-5">
            {week.days.map((day) => {
              const meta = STATUS_META[day.status];
              const description = `${formatDate(day.date, "EEE d MMM")} · ${meta.label}`;
              return (
                <RackSlot key={day.date}>
                  <span
                    role="img"
                    aria-label={description}
                    title={description}
                    className="flex h-full items-end px-2"
                  >
                    <DumbbellShape look={meta.look} size="sm" />
                  </span>
                </RackSlot>
              );
            })}
          </Rack>
        </li>
      ))}
    </ol>
  );
}

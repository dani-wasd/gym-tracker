import { SlabShape, Stack } from "@/src/components/stack/stack";
import { STATUS_META } from "@/src/components/stack/status";
import { formatDate, formatWeekRange } from "@/src/lib/dates";
import { describeWeek, type WeekSummary } from "@/src/lib/week";

/** Past weeks as a row of small weight stacks, newest first. */
export function WeekHistory({ weeks }: { weeks: WeekSummary[] }) {
  return (
    <ol className="grid grid-cols-2 gap-x-4 gap-y-10 border-y border-iron py-8 sm:grid-cols-3 lg:grid-cols-4">
      {weeks.map((week, index) => (
        <li key={week.weekStart} className="flex flex-col items-start gap-3">
          <Stack size="sm">
            {week.days.map((day) => {
              const meta = STATUS_META[day.status];
              const description = `${formatDate(day.date, "EEE d MMM")} · ${meta.label}`;
              return (
                <span
                  key={day.date}
                  role="img"
                  aria-label={description}
                  title={description}
                  className="relative z-10"
                >
                  <SlabShape look={meta.look} size="sm" label={day.name} />
                </span>
              );
            })}
          </Stack>
          <div>
            <p className="font-display text-xl leading-none font-extrabold uppercase">
              {index === 0 ? "This week" : formatWeekRange(week.weekStart, week.weekEnd)}
            </p>
            <p className="mt-1 text-xs text-steel">{describeWeek(week)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

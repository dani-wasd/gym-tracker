import { cn } from "@/src/lib/cn";
import { DumbbellShape } from "./rack";
import { STATUS_META, STATUS_ORDER } from "./status";

/** Key to the dumbbell colours. */
export function RackLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        return (
          <li key={status} className="eyebrow flex items-center gap-2">
            <span aria-hidden className="flex h-3.5 items-end">
              <DumbbellShape look={meta.look} size="xs" />
            </span>
            {meta.label}
          </li>
        );
      })}
    </ul>
  );
}

import { cn } from "@/src/lib/cn";
import { SlabShape } from "./stack";
import { STATUS_META, STATUS_ORDER } from "./status";

/** Key to the slab colours. */
export function StackLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        return (
          <li key={status} className="eyebrow flex items-center gap-2">
            <span aria-hidden className="block w-6">
              <SlabShape look={meta.look} size="sm" />
            </span>
            {meta.label}
          </li>
        );
      })}
    </ul>
  );
}

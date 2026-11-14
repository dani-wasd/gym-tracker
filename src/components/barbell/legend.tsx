import { cn } from "@/src/lib/cn";
import type { PlateLook } from "./barbell";
import { STATUS_META, STATUS_ORDER } from "./status";

const SWATCH: Record<PlateLook, string> = {
  solid: "bg-chalk",
  accent: "bg-plate-blue",
  alert: "bg-plate-yellow",
  hatch: "plate-hatch border border-plate-red",
  hollow: "border border-steel",
  stub: "bg-iron",
};

/** Key to the plate colours. */
export function PlateLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        return (
          <li key={status} className="eyebrow flex items-center gap-2">
            <span aria-hidden className={cn("h-4 w-1.5 rounded-[2px]", SWATCH[meta.look])} />
            {meta.label}
          </li>
        );
      })}
    </ul>
  );
}

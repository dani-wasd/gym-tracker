import { cn } from "@/src/lib/cn";
import { MUSCLE_GROUPS, type MuscleGroup } from "@/src/lib/definitions";

interface MusclePickerProps {
  /** Muscles ticked by hand. */
  value: MuscleGroup[];
  onChange: (muscles: MuscleGroup[]) => void;
  /** Muscles already covered by the chosen exercises: lit and locked. */
  implied?: MuscleGroup[];
}

export function MusclePicker({ value, onChange, implied = [] }: MusclePickerProps) {
  const toggle = (muscle: MuscleGroup) =>
    onChange(
      value.includes(muscle)
        ? value.filter((selected) => selected !== muscle)
        : [...value, muscle],
    );

  return (
    <fieldset>
      <legend className="eyebrow mb-2">
        Muscles worked
        {implied.length > 0 && " · filled in from your exercises, tick any extra"}
      </legend>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
        {MUSCLE_GROUPS.map((muscle) => {
          const isImplied = implied.includes(muscle);
          const selected = isImplied || value.includes(muscle);
          return (
            <button
              key={muscle}
              type="button"
              aria-pressed={selected}
              disabled={isImplied}
              onClick={() => toggle(muscle)}
              className={cn(
                "border-2 px-1 py-2 font-display text-base leading-none font-bold uppercase tracking-wide transition-colors disabled:cursor-default",
                isImplied && "border-steel bg-steel text-mat",
                !isImplied && selected && "border-chalk bg-chalk text-mat",
                !selected && "border-iron text-steel hover:border-steel hover:text-chalk",
              )}
            >
              {muscle}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

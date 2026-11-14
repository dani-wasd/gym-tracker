import { cn } from "@/src/lib/cn";
import { MUSCLE_GROUPS, type MuscleGroup } from "@/src/lib/definitions";

interface MusclePickerProps {
  value: MuscleGroup[];
  onChange: (muscles: MuscleGroup[]) => void;
}

export function MusclePicker({ value, onChange }: MusclePickerProps) {
  const toggle = (muscle: MuscleGroup) =>
    onChange(
      value.includes(muscle)
        ? value.filter((selected) => selected !== muscle)
        : [...value, muscle],
    );

  return (
    <fieldset>
      <legend className="eyebrow mb-2">Muscles worked</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MUSCLE_GROUPS.map((muscle) => {
          const selected = value.includes(muscle);
          return (
            <button
              key={muscle}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(muscle)}
              className={cn(
                "border-2 px-2 py-3 font-display text-lg leading-none font-bold uppercase tracking-wide transition-colors",
                selected
                  ? "border-chalk bg-chalk text-mat"
                  : "border-iron text-steel hover:border-steel hover:text-chalk",
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

import { Button } from "@/src/components/ui/button";
import { inputStyles } from "@/src/components/ui/field";
import { cn } from "@/src/lib/cn";
import { EXERCISE_LIMITS } from "@/src/lib/exercises";
import { EMPTY_SET, type DraftSet } from "./exercise-draft";

interface SetRowsProps {
  /** Used in the inputs' accessible names. */
  exerciseName: string;
  sets: DraftSet[];
  onChange: (sets: DraftSet[]) => void;
}

const NUMBER_INPUT = cn(inputStyles, "w-16 py-1 text-center");

/** The sets of one exercise: reps and weight per row. */
export function SetRows({ exerciseName, sets, onChange }: SetRowsProps) {
  const update = (index: number, patch: Partial<DraftSet>) =>
    onChange(sets.map((set, at) => (at === index ? { ...set, ...patch } : set)));

  // A new set starts as a copy of the last one, since most sets repeat.
  const addSet = () => onChange([...sets, sets[sets.length - 1] ?? EMPTY_SET]);

  return (
    <div className="flex flex-col gap-2">
      {sets.map((set, index) => (
        <div key={index} className="flex items-center gap-3 text-sm text-steel">
          <span className="eyebrow w-14 whitespace-nowrap">Set {index + 1}</span>
          <input
            inputMode="numeric"
            placeholder="8"
            aria-label={`${exerciseName}, set ${index + 1}, reps`}
            value={set.reps}
            onChange={(event) => update(index, { reps: event.target.value })}
            className={NUMBER_INPUT}
          />
          reps
          <input
            inputMode="decimal"
            placeholder="body"
            aria-label={`${exerciseName}, set ${index + 1}, weight in kilograms`}
            value={set.weight}
            onChange={(event) => update(index, { weight: event.target.value })}
            className={NUMBER_INPUT}
          />
          kg
          <button
            type="button"
            aria-label={`Remove set ${index + 1} of ${exerciseName}`}
            onClick={() => onChange(sets.filter((_, at) => at !== index))}
            className="ml-auto px-2 text-lg leading-none text-steel transition-colors hover:text-plate-red"
          >
            ×
          </button>
        </div>
      ))}

      {sets.length < EXERCISE_LIMITS.SETS_PER_EXERCISE && (
        <Button variant="ghost" size="inline" onClick={addSet} className="self-start">
          + {sets.length === 0 ? "Add sets" : "Set"}
        </Button>
      )}
    </div>
  );
}

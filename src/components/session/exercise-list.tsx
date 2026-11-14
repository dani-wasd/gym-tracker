import { exerciseById } from "@/src/lib/exercises";
import type { DraftExercise } from "./exercise-draft";
import { SetRows } from "./set-rows";

interface ExerciseListProps {
  exercises: DraftExercise[];
  onChange: (exercises: DraftExercise[]) => void;
}

/** The exercises added to this session, each with its sets. */
export function ExerciseList({ exercises, onChange }: ExerciseListProps) {
  if (exercises.length === 0) return null;

  return (
    <ol className="flex flex-col gap-5">
      {exercises.map((draft) => {
        const known = exerciseById(draft.exerciseId);
        if (!known) return null;

        return (
          <li key={draft.exerciseId} className="border-l-4 border-chalk pl-4">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="font-display text-2xl leading-none font-extrabold uppercase">
                {known.name}
              </p>
              <button
                type="button"
                onClick={() =>
                  onChange(exercises.filter((other) => other.exerciseId !== draft.exerciseId))
                }
                className="eyebrow transition-colors hover:text-plate-red"
              >
                Remove
              </button>
            </div>
            <SetRows
              exerciseName={known.name}
              sets={draft.sets}
              onChange={(sets) =>
                onChange(
                  exercises.map((other) =>
                    other.exerciseId === draft.exerciseId ? { ...other, sets } : other,
                  ),
                )
              }
            />
          </li>
        );
      })}
    </ol>
  );
}

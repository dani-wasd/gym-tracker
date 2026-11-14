import { EXERCISE_LIMITS, exerciseById, type LoggedExercise, type LoggedSet } from "@/src/lib/exercises";

/*
 * Exercises as they sit in the log form: numbers are still the raw text of
 * their inputs. `toLoggedExercises` turns them into what gets saved.
 */

export interface DraftSet {
  reps: string;
  /** Kilograms; blank means bodyweight. */
  weight: string;
}

export interface DraftExercise {
  exerciseId: string;
  sets: DraftSet[];
}

export const EMPTY_SET: DraftSet = { reps: "", weight: "" };

type Converted = { ok: true; value: LoggedExercise[] } | { ok: false; error: string };

/** Rows left completely blank are dropped; half-filled or out-of-range rows are errors. */
export function toLoggedExercises(drafts: DraftExercise[]): Converted {
  const logged: LoggedExercise[] = [];

  for (const draft of drafts) {
    const name = exerciseById(draft.exerciseId)?.name ?? "Exercise";
    const sets: LoggedSet[] = [];

    for (const { reps, weight } of draft.sets) {
      if (reps.trim() === "" && weight.trim() === "") continue;

      const repCount = Number(reps);
      if (!Number.isInteger(repCount) || repCount < 1 || repCount > EXERCISE_LIMITS.MAX_REPS) {
        return { ok: false, error: `${name}: reps must be a whole number from 1 to ${EXERCISE_LIMITS.MAX_REPS}.` };
      }

      const weightKg = weight.trim() === "" ? null : Number(weight);
      if (
        weightKg !== null &&
        (!Number.isFinite(weightKg) || weightKg < 0 || weightKg > EXERCISE_LIMITS.MAX_WEIGHT_KG)
      ) {
        return { ok: false, error: `${name}: weight must be from 0 to ${EXERCISE_LIMITS.MAX_WEIGHT_KG} kg.` };
      }
      sets.push({ reps: repCount, weightKg });
    }
    logged.push({ exerciseId: draft.exerciseId, sets });
  }
  return { ok: true, value: logged };
}

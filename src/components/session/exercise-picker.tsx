"use client";

import { useState } from "react";
import { cn } from "@/src/lib/cn";
import { MUSCLE_GROUPS, type MuscleGroup } from "@/src/lib/definitions";
import { EXERCISE_LIMITS, findExercises } from "@/src/lib/exercises";

interface ExercisePickerProps {
  /** Ids already in the session — shown as added, tap again to take them off. */
  selectedIds: string[];
  onToggle: (exerciseId: string) => void;
}

const chip = (active: boolean) =>
  cn(
    "border px-2 py-1 font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors",
    active
      ? "border-chalk bg-chalk text-mat"
      : "border-iron text-steel hover:border-steel hover:text-chalk",
  );

/** Browse the exercise list by muscle or by name, and tap to add. */
export function ExercisePicker({ selectedIds, onToggle }: ExercisePickerProps) {
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null);
  const [search, setSearch] = useState("");

  const matches = findExercises(muscle, search);
  const isFull = selectedIds.length >= EXERCISE_LIMITS.EXERCISES_PER_WORKOUT;

  return (
    <fieldset>
      <legend className="eyebrow mb-2">Exercises</legend>

      <div className="flex flex-wrap gap-1.5">
        <button type="button" aria-pressed={muscle === null} onClick={() => setMuscle(null)} className={chip(muscle === null)}>
          All
        </button>
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            aria-pressed={muscle === group}
            onClick={() => setMuscle(group)}
            className={chip(muscle === group)}
          >
            {group}
          </button>
        ))}
      </div>

      <input
        type="search"
        aria-label="Search exercises"
        placeholder="Search exercises"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mt-3 w-full border-b-2 border-iron bg-transparent py-2 font-mono text-base text-chalk transition-colors placeholder:text-steel/60 focus:border-chalk focus:outline-none"
      />

      <ul className="mt-2 max-h-44 overflow-y-auto border border-iron">
        {matches.length === 0 && (
          <li className="px-3 py-3 text-sm text-steel">
            No exercise by that name. You can tick the muscles below instead.
          </li>
        )}
        {matches.map((entry) => {
          const added = selectedIds.includes(entry.id);
          return (
            <li key={entry.id} className="border-b border-iron last:border-b-0">
              <button
                type="button"
                aria-pressed={added}
                disabled={!added && isFull}
                onClick={() => onToggle(entry.id)}
                className={cn(
                  "flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm transition-colors disabled:cursor-default disabled:opacity-40",
                  added ? "bg-chalk text-mat" : "hover:bg-iron/60",
                )}
              >
                <span>{entry.name}</span>
                <span className={cn("text-xs", added ? "text-mat/70" : "text-steel")}>
                  {added ? "Added" : entry.primary}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

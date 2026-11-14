"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { logWorkout } from "@/src/app/(app)/dashboard/actions";
import { Button } from "@/src/components/ui/button";
import { Dialog } from "@/src/components/ui/dialog";
import { Field } from "@/src/components/ui/field";
import { FormMessage } from "@/src/components/ui/form-message";
import { toDateTimeInputValue } from "@/src/lib/dates";
import { MINUTE_MS, type MuscleGroup } from "@/src/lib/definitions";
import { musclesOf } from "@/src/lib/exercises";
import { toLoggedExercises, type DraftExercise } from "./exercise-draft";
import { ExerciseList } from "./exercise-list";
import { ExercisePicker } from "./exercise-picker";
import { MusclePicker } from "./muscle-picker";

/**
 * A workout waiting to be logged. `timer` drafts come off the running clock and
 * have fixed times; `manual` drafts start from a suggestion the user can edit.
 */
export interface SessionDraft {
  mode: "timer" | "manual";
  start: string;
  end: string;
}

interface LogSessionDialogProps {
  draft: SessionDraft | null;
  onClose: () => void;
  onLogged: () => void;
  /** Throw the running session away without logging it. */
  onScrap: () => void;
}

export function LogSessionDialog({ draft, ...handlers }: LogSessionDialogProps) {
  return (
    <Dialog
      open={draft !== null}
      onClose={handlers.onClose}
      title={draft?.mode === "manual" ? "Log by hand" : "Rack it"}
      size="wide"
    >
      {draft && <LogSessionForm draft={draft} {...handlers} />}
    </Dialog>
  );
}

function LogSessionForm({
  draft,
  onClose,
  onLogged,
  onScrap,
}: LogSessionDialogProps & { draft: SessionDraft }) {
  const isManual = draft.mode === "manual";
  const [start, setStart] = useState(toDateTimeInputValue(new Date(draft.start)));
  const [end, setEnd] = useState(toDateTimeInputValue(new Date(draft.end)));
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [muscles, setMuscles] = useState<MuscleGroup[]>([]);
  const [error, setError] = useState<string>();
  const [isSaving, startSaving] = useTransition();

  const exerciseIds = exercises.map((entry) => entry.exerciseId);
  const impliedMuscles = musclesOf(exerciseIds);
  const hasContent = exercises.length > 0 || muscles.length > 0;

  const toggleExercise = (exerciseId: string) =>
    setExercises((current) =>
      current.some((entry) => entry.exerciseId === exerciseId)
        ? current.filter((entry) => entry.exerciseId !== exerciseId)
        : [...current, { exerciseId, sets: [] }],
    );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Manual times come from the inputs (browser-local); timer times are exact.
    const startTime = new Date(isManual ? start : draft.start);
    const endTime = new Date(isManual ? end : draft.end);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      setError("Fill in both the start and end time.");
      return;
    }

    const logged = toLoggedExercises(exercises);
    if (!logged.ok) {
      setError(logged.error);
      return;
    }

    startSaving(async () => {
      const result = await logWorkout({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        muscles,
        exercises: logged.value,
      });
      if (result.ok) onLogged();
      else setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {isManual ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Started"
            type="datetime-local"
            required
            value={start}
            max={end}
            onChange={(event) => setStart(event.target.value)}
          />
          <Field
            label="Finished"
            type="datetime-local"
            required
            value={end}
            min={start}
            onChange={(event) => setEnd(event.target.value)}
          />
          <p className="text-xs text-steel sm:col-span-2">
            Workouts can be logged up to 24 hours after they start.
          </p>
        </div>
      ) : (
        <TimerSummary draft={draft} />
      )}

      <ExercisePicker selectedIds={exerciseIds} onToggle={toggleExercise} />
      <ExerciseList exercises={exercises} onChange={setExercises} />
      <MusclePicker value={muscles} onChange={setMuscles} implied={impliedMuscles} />
      <FormMessage tone="error">{error}</FormMessage>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSaving || !hasContent}>
          {isSaving ? "Logging…" : "Log it"}
        </Button>
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          {isManual ? "Cancel" : "Keep lifting"}
        </Button>
        {!isManual && (
          <Button variant="ghost" size="sm" onClick={onScrap} disabled={isSaving} className="ml-auto">
            Scrap session
          </Button>
        )}
      </div>
    </form>
  );
}

function TimerSummary({ draft }: { draft: SessionDraft }) {
  const start = new Date(draft.start);
  const end = new Date(draft.end);
  const minutes = Math.round((end.getTime() - start.getTime()) / MINUTE_MS);

  return (
    <p className="border-l-4 border-chalk pl-4">
      <span className="font-display text-3xl leading-none font-extrabold">
        {format(start, "h:mm a")} → {format(end, "h:mm a")}
      </span>
      <span className="block text-sm text-steel">{minutes} min on the clock</span>
    </p>
  );
}

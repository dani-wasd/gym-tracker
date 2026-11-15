import { formatDate } from "@/src/lib/dates";
import type { Session, SessionExercise } from "@/src/lib/week";

/** Most recent workouts, newest first. */
export function Logbook({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return <p className="text-sm text-steel">No workouts logged yet.</p>;
  }

  return (
    <ol className="border-t border-iron">
      {sessions.map((session) => (
        <li
          key={session.id}
          className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-iron py-3 sm:grid-cols-[9rem_14rem_5rem_1fr]"
        >
          <span className="font-display text-2xl leading-none font-extrabold uppercase">
            {formatDate(session.date, "EEE d MMM")}
          </span>
          <span className="text-right text-sm sm:text-left">
            {session.startLabel} → {session.endLabel}
          </span>
          <span className="text-sm text-steel">{session.minutes} min</span>
          <span className="text-right text-sm text-steel sm:text-left">
            {session.muscles.join(" / ")}
          </span>
          <ExerciseDetails exercises={session.exercises} />
        </li>
      ))}
    </ol>
  );
}

/** What was done in a session, folded away until asked for. */
function ExerciseDetails({ exercises }: { exercises: SessionExercise[] }) {
  if (exercises.length === 0) return null;

  return (
    <details className="col-span-full text-sm">
      <summary className="eyebrow w-fit transition-colors hover:text-chalk">
        {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"}
      </summary>
      <ul className="mt-2 mb-1 border-l-4 border-iron pl-4">
        {exercises.map((exercise) => (
          <li key={exercise.name}>
            {exercise.name}
            {exercise.sets && <span className="text-steel"> · {exercise.sets}</span>}
          </li>
        ))}
      </ul>
    </details>
  );
}

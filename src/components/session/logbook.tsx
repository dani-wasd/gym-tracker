import { formatDate } from "@/src/lib/dates";
import type { Session } from "@/src/lib/week";

/** Most recent workouts, newest first. */
export function Logbook({ sessions }: { sessions: Session[] }) {
  return (
    <section>
      <p className="eyebrow">Logbook</p>
      <h2 className="headline mt-1 text-5xl">Last lifts</h2>

      {sessions.length === 0 ? (
        <p className="mt-6 text-sm text-steel">
          Nothing logged yet. Your first session lands here.
        </p>
      ) : (
        <ol className="mt-6 border-t border-iron">
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
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

import type { MuscleCount } from "@/src/lib/stats";

/** Sessions per muscle group as horizontal bars, most-trained first. */
export function MuscleSplit({ split }: { split: MuscleCount[] }) {
  const most = Math.max(...split.map((entry) => entry.sessions), 1);

  return (
    <ul className="flex flex-col gap-3">
      {split.map(({ muscle, sessions }) => (
        <li
          key={muscle}
          className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 sm:grid-cols-[9rem_1fr_2rem]"
        >
          <span className="font-display text-xl leading-none font-bold uppercase">
            {muscle}
          </span>
          <span aria-hidden className="h-3 bg-iron/50">
            <span
              className="block h-full rounded-r-[3px] bg-chalk"
              style={{ width: `${(sessions / most) * 100}%` }}
            />
          </span>
          <span className="text-right text-sm tabular-nums">
            {sessions}
            <span className="sr-only"> sessions</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

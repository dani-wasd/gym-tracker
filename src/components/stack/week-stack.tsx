"use client";

import { useState } from "react";
import { cn } from "@/src/lib/cn";
import { formatDate, type DateString } from "@/src/lib/dates";
import type { WeekDay, WeekSummary } from "@/src/lib/week";
import { Slab, Stack, type StackSize } from "./stack";
import { STATUS_META } from "./status";

interface WeekStackProps {
  summary: WeekSummary;
  size?: StackSize;
}

/**
 * A week drawn as a weight stack: one slab per day, coloured by how the day
 * went, with the selector pin in today.
 *
 * Nothing is pulled out until the user picks: hovering previews a day while
 * the pointer is on the stack, and pressing a slab keeps it out (press again
 * to put it back). The readout shows the pulled-out day, or today otherwise.
 */
export function WeekStack({ summary, size = "lg" }: WeekStackProps) {
  // Kept as dates rather than positions, so they can't point at the wrong day
  // after the week rolls over under an open page.
  const [chosenDate, setChosenDate] = useState<DateString | null>(null);
  const [hoveredDate, setHoveredDate] = useState<DateString | null>(null);

  const activeDate = hoveredDate ?? chosenDate;
  const readoutDay =
    summary.days.find((day) => day.date === activeDate) ??
    summary.days.find((day) => day.isToday) ??
    summary.days[0];
  const compact = size === "sm";

  return (
    <div
      className={cn(
        "flex items-center",
        compact ? "mt-6 gap-5" : "mt-8 flex-col items-start gap-8 sm:flex-row sm:items-center",
      )}
    >
      {/* Leaving the whole stack (not each slab) ends the preview, so the
          small gaps between slabs don't make the readout flicker. */}
      <Stack size={size} onMouseLeave={() => setHoveredDate(null)}>
        {summary.days.map((day) => {
          const meta = STATUS_META[day.status];
          const isChosen = day.date === chosenDate;
          return (
            <Slab
              key={day.date}
              look={meta.look}
              size={size}
              label={`${day.name} ${formatDate(day.date, "d")}`}
              pinned={day.isToday}
              pulled={day.date === activeDate}
              stackOrder={day.index}
              aria-label={`${formatDate(day.date, "EEEE d MMMM")}: ${meta.label}`}
              aria-pressed={isChosen}
              onClick={() => setChosenDate(isChosen ? null : day.date)}
              onMouseEnter={() => setHoveredDate(day.date)}
            />
          );
        })}
      </Stack>
      <DayReadout day={readoutDay} compact={compact} />
    </div>
  );
}

function DayReadout({ day, compact }: { day: WeekDay; compact: boolean }) {
  const meta = STATUS_META[day.status];

  return (
    <div
      aria-live="polite"
      className={cn(
        "min-w-0 flex-1 border-l-4 pl-4 transition-colors",
        meta.rule,
        compact ? "min-h-14" : "min-h-24",
      )}
    >
      <p
        className={cn(
          "font-display leading-none font-extrabold uppercase",
          compact ? "text-xl" : "text-3xl sm:text-4xl",
        )}
      >
        {formatDate(day.date, "EEEE d MMM")}{" "}
        <span className={meta.tone}>/ {meta.label}</span>
      </p>

      <ul className={cn("mt-2 text-steel", compact ? "text-xs" : "text-sm")}>
        {day.sessions.length === 0 && <li>{meta.hint}</li>}
        {day.sessions.map((session) => (
          <li key={session.id}>
            <span className="text-chalk">
              {session.startLabel} → {session.endLabel}
            </span>{" "}
            · {session.minutes} min · {session.muscles.join(" / ")}
            {session.exercises.length > 0 && (
              <span className="block">
                {session.exercises.map((exercise) => exercise.name).join(", ")}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

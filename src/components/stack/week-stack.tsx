"use client";

import { useState } from "react";
import { cn } from "@/src/lib/cn";
import { formatDate } from "@/src/lib/dates";
import type { WeekDay, WeekSummary } from "@/src/lib/week";
import { Slab, Stack, type StackSize } from "./stack";
import { STATUS_META } from "./status";

interface WeekStackProps {
  summary: WeekSummary;
  size?: StackSize;
}

/**
 * A week drawn as a weight stack: one slab per day, coloured by how the day
 * went, with the selector pin in today. Hover, focus or tap a slab to read
 * that day out beside the stack.
 */
export function WeekStack({ summary, size = "lg" }: WeekStackProps) {
  const todayIndex = summary.days.findIndex((day) => day.isToday);
  const [selectedIndex, setSelectedIndex] = useState(Math.max(todayIndex, 0));
  const selected = summary.days[selectedIndex];
  const compact = size === "sm";

  return (
    <div
      className={cn(
        "flex items-center",
        compact ? "mt-6 gap-5" : "mt-8 flex-col items-start gap-8 sm:flex-row sm:items-center",
      )}
    >
      <Stack size={size}>
        {summary.days.map((day) => {
          const meta = STATUS_META[day.status];
          const select = () => setSelectedIndex(day.index);
          return (
            <Slab
              key={day.date}
              look={meta.look}
              size={size}
              label={`${day.name} ${formatDate(day.date, "d")}`}
              pinned={day.isToday}
              pulled={day.index === selectedIndex}
              stackOrder={day.index}
              aria-label={`${formatDate(day.date, "EEEE d MMMM")}: ${meta.label}`}
              aria-pressed={day.index === selectedIndex}
              onClick={select}
              onMouseEnter={select}
              onFocus={select}
            />
          );
        })}
      </Stack>
      <DayReadout day={selected} compact={compact} />
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

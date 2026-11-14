"use client";

import { useState } from "react";
import { cn } from "@/src/lib/cn";
import { formatDate } from "@/src/lib/dates";
import type { WeekDay, WeekSummary } from "@/src/lib/week";
import { Barbell, BarbellSlot, Plate, type BarbellSize } from "./barbell";
import { STATUS_META } from "./status";

interface WeekBarProps {
  summary: WeekSummary;
  size?: BarbellSize;
}

/**
 * A week drawn as a loaded bar: one plate per day, coloured by how the day
 * went. Hover, focus or tap a plate to read that day out underneath.
 */
export function WeekBar({ summary, size = "lg" }: WeekBarProps) {
  const todayIndex = summary.days.findIndex((day) => day.isToday);
  const [selectedIndex, setSelectedIndex] = useState(Math.max(todayIndex, 0));
  const selected = summary.days[selectedIndex];

  return (
    <div>
      <Barbell size={size}>
        {summary.days.map((day) => {
          const meta = STATUS_META[day.status];
          const select = () => setSelectedIndex(day.index);
          return (
            <BarbellSlot
              key={day.date}
              label={day.name[0]}
              caption={size === "lg" ? formatDate(day.date, "d") : undefined}
              marked={day.isToday}
            >
              <Plate
                look={meta.look}
                size={size}
                lifted={day.index === selectedIndex}
                loadOrder={day.index}
                aria-label={`${formatDate(day.date, "EEEE d MMMM")}: ${meta.label}`}
                aria-pressed={day.index === selectedIndex}
                onClick={select}
                onMouseEnter={select}
                onFocus={select}
              />
            </BarbellSlot>
          );
        })}
      </Barbell>
      <DayReadout day={selected} compact={size === "sm"} />
    </div>
  );
}

function DayReadout({ day, compact }: { day: WeekDay; compact: boolean }) {
  const meta = STATUS_META[day.status];

  return (
    <div
      aria-live="polite"
      className={cn(
        "border-l-4 pl-4 transition-colors",
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
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { savePlan } from "@/src/app/(app)/dashboard/actions";
import { Slab, Stack } from "@/src/components/stack/stack";
import { Button } from "@/src/components/ui/button";
import { FormMessage } from "@/src/components/ui/form-message";
import { cn } from "@/src/lib/cn";
import { DAYS } from "@/src/lib/definitions";
import {
  isDayPlanned,
  plannedDayNames,
  toggleDay,
  type PlanTarget,
} from "@/src/lib/week";

/** A week the user is allowed to plan right now. */
export interface PlannableWeek {
  target: PlanTarget;
  title: string;
  /** e.g. "Nov 22–28" */
  range: string;
  /** Days to start from: the saved plan, or last week's carried forward. */
  plannedDays: number;
  /** Whether a plan has already been locked in for this exact week. */
  isSaved: boolean;
}

/** Add slabs to an empty stack to plan a week, then lock it in. */
export function WeekPlanner({ weeks }: { weeks: PlannableWeek[] }) {
  const [activeTarget, setActiveTarget] = useState(weeks[0].target);
  const active = weeks.find((week) => week.target === activeTarget) ?? weeks[0];

  return (
    <section>
      <p className="eyebrow">Planner · {active.range}</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        {weeks.map((week) => (
          <button
            key={week.target}
            type="button"
            disabled={weeks.length === 1}
            aria-pressed={weeks.length > 1 ? week.target === active.target : undefined}
            onClick={() => setActiveTarget(week.target)}
            className={cn(
              "headline text-5xl transition-colors disabled:cursor-default",
              week.target === active.target ? "text-chalk" : "text-iron hover:text-steel",
            )}
          >
            {week.title}
          </button>
        ))}
      </div>

      <PlanEditor key={active.target} week={active} />
    </section>
  );
}

function PlanEditor({ week }: { week: PlannableWeek }) {
  const [plannedDays, setPlannedDays] = useState(week.plannedDays);
  const [isLocked, setIsLocked] = useState(week.isSaved);
  const [error, setError] = useState<string>();
  const [isSaving, startSaving] = useTransition();

  const dayNames = plannedDayNames(plannedDays);

  const lockIn = () =>
    startSaving(async () => {
      const result = await savePlan(week.target, plannedDays);
      if (result.ok) {
        setError(undefined);
        setIsLocked(true);
      } else {
        setError(result.error);
      }
    });

  return (
    <>
      <Stack className="mt-6 mb-4">
        {DAYS.map((day, index) => {
          const planned = isDayPlanned(plannedDays, index);
          return (
            <Slab
              key={day}
              label={day}
              // While editing, free days are dashed outlines, so it's clear they can be pressed.
              look={planned ? "solid" : isLocked ? "empty" : "ghost"}
              disabled={isLocked || isSaving}
              aria-label={`${day}: ${planned ? "planned, press to remove" : "free, press to plan"}`}
              aria-pressed={planned}
              onClick={() => setPlannedDays((mask) => toggleDay(mask, index))}
              className={cn(!isLocked && planned && "hover:opacity-70")}
            />
          );
        })}
      </Stack>

      <p className="text-sm text-steel">
        {isLocked ? "Locked in: " : "Press a day to add or remove it. "}
        <span className="text-chalk">
          {dayNames.length > 0 ? dayNames.join(" / ") : "no days"}
        </span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {isLocked ? (
          <Button variant="outline" onClick={() => setIsLocked(false)}>
            Change plan
          </Button>
        ) : (
          <Button onClick={lockIn} disabled={isSaving}>
            {isSaving ? "Locking…" : "Lock it in"}
          </Button>
        )}
        <FormMessage tone="error">{error}</FormMessage>
      </div>
    </>
  );
}

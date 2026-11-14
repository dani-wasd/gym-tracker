"use client";

import { useId } from "react";
import { cn } from "@/src/lib/cn";

interface PlateDialProps {
  /** Keeps the plate turning — used while the clock is running. */
  spinning: boolean;
  /** Big text on the hub. */
  label: string;
  /** Small text under it. */
  sublabel: string;
  onClick: () => void;
}

const RIM_TEXT = "GYM TRACKER · 25 KG · LOAD THE BAR · LIFT THE WEEK ·";

/** The start/stop control: a bumper plate seen face-on that spins while you lift. */
export function PlateDial({ spinning, label, sublabel, onClick }: PlateDialProps) {
  const rimPathId = useId();

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square w-[min(78vw,21rem)] shrink-0 rounded-full transition-transform duration-150 active:scale-[0.97]"
    >
      <svg viewBox="0 0 300 300" aria-hidden className="size-full">
        <g
          className={cn(
            "spin-origin",
            spinning
              ? "animate-plate-spin"
              : "transition-transform duration-700 ease-out group-hover:rotate-[30deg]",
          )}
        >
          <circle cx="150" cy="150" r="148" className="fill-plate-red" />
          <circle cx="150" cy="150" r="136" className="fill-none stroke-black/25" strokeWidth="2" />
          <path
            id={rimPathId}
            d="M150,150 m-110,0 a110,110 0 1,1 220,0 a110,110 0 1,1 -220,0"
            fill="none"
          />
          <text className="fill-chalk font-display font-extrabold" fontSize="27">
            <textPath href={`#${rimPathId}`} textLength="682" lengthAdjust="spacing">
              {RIM_TEXT}
            </textPath>
          </text>
          <circle cx="150" cy="150" r="92" className="fill-black/25" />
          {/* Off-centre bolts make the rotation readable. */}
          {[0, 120, 240].map((angle) => (
            <circle
              key={angle}
              cx="150"
              cy="72"
              r="5"
              className="fill-mat/70"
              transform={`rotate(${angle} 150 150)`}
            />
          ))}
        </g>
        <circle cx="150" cy="150" r="62" className="fill-mat stroke-steel" strokeWidth="4" />
      </svg>

      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="font-display text-4xl leading-none font-extrabold tabular-nums">
          {label}
        </span>
        <span className="eyebrow">{sublabel}</span>
      </span>
    </button>
  );
}

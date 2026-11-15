import * as React from "react";
import { cn } from "@/src/lib/cn";

/*
 * The building blocks of every week picture in the app — a dumbbell rack:
 *
 *   <Rack>
 *     <RackSlot label="M"><Dumbbell look="solid" /></RackSlot>
 *     …one slot per day
 *   </Rack>
 *
 * Nothing outside this folder knows how a day is drawn, so the rack can be
 * swapped for another picture without touching the pages.
 */

export type RackSize = "lg" | "sm";

const TRACK: Record<RackSize, string> = {
  lg: "mt-10 mb-14 h-14 px-[4%] sm:h-20",
  sm: "mt-5 mb-10 h-9 px-[4%]",
};

const RAIL: Record<RackSize, string> = { lg: "h-2.5", sm: "h-1.5" };
const POST: Record<RackSize, string> = { lg: "-bottom-6 w-2.5", sm: "-bottom-4 w-1.5" };
const LABEL_GAP: Record<RackSize, string> = { lg: "mt-5", sm: "mt-3" };

interface RackProps {
  size?: RackSize;
  className?: string;
  children: React.ReactNode;
}

/** A shelf rail between two uprights; the slots stand on the rail. */
export function Rack({ size = "lg", className, children }: RackProps) {
  const post = cn("absolute top-1/4 rounded-[2px] bg-iron", POST[size]);

  return (
    <div className={cn("relative flex items-end justify-between", TRACK[size], className)}>
      <span aria-hidden className={cn(post, "left-[1.5%]")} />
      <span aria-hidden className={cn(post, "right-[1.5%]")} />
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-full rounded-[2px] bg-linear-to-b from-steel to-iron",
          RAIL[size],
        )}
      />
      {children}
    </div>
  );
}

interface RackSlotProps {
  /** Match the rack's size so the label clears the rail. */
  size?: RackSize;
  /** Shown under the rail, e.g. the day letter. */
  label?: string;
  /** Shown above the slot, e.g. the day of the month. */
  caption?: string;
  /** Marks today. */
  marked?: boolean;
  children: React.ReactNode;
}

export function RackSlot({ size = "lg", label, caption, marked, children }: RackSlotProps) {
  return (
    <div className="relative z-10 flex h-full items-end justify-center">
      {caption && (
        <span aria-hidden className="absolute bottom-full mb-2 text-xs text-steel">
          {caption}
        </span>
      )}
      {children}
      {label && (
        <span
          aria-hidden
          className={cn(
            "absolute top-full border-b-2 px-0.5 font-display text-lg leading-tight font-bold",
            LABEL_GAP[size],
            marked ? "border-plate-yellow text-chalk" : "border-transparent text-steel",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/** How a dumbbell is drawn — callers map their own meaning onto these. */
export type DumbbellLook =
  | "solid"
  | "accent"
  | "alert"
  | "hatch"
  | "hollow"
  | "ghost"
  | "empty";

const LOOKS: Record<DumbbellLook, { box: string; head: string; handle: string }> = {
  solid: { box: "h-[64%]", head: "bg-chalk", handle: "bg-steel" },
  accent: { box: "h-[42%]", head: "bg-plate-blue", handle: "bg-plate-blue/60" },
  alert: {
    box: "h-[64%]",
    head: "animate-plate-pulse bg-plate-yellow",
    handle: "bg-plate-yellow/70",
  },
  hatch: {
    box: "h-[64%]",
    head: "plate-hatch border-2 border-plate-red",
    handle: "bg-plate-red/70",
  },
  hollow: { box: "h-[64%]", head: "border-2 border-steel bg-mat-raised", handle: "bg-iron" },
  // A free spot asking to be filled: a dashed outline that fills in when the
  // button around it is hovered or focused.
  ghost: {
    box: "h-[64%] group-hover:-translate-y-1 group-focus-visible:-translate-y-1",
    head: "border-2 border-dashed border-steel/50 group-hover:border-solid group-hover:border-chalk group-hover:bg-chalk/40 group-focus-visible:border-solid group-focus-visible:border-chalk group-focus-visible:bg-chalk/40",
    handle: "bg-iron group-hover:bg-steel group-focus-visible:bg-steel",
  },
  // No dumbbell: just the bare cradle it would sit in.
  empty: { box: "h-1.5", head: "rounded-none bg-iron", handle: "h-full! bg-iron" },
};

export type DumbbellSize = RackSize | "xs";

const PARTS: Record<DumbbellSize, { head: string; handle: string }> = {
  lg: {
    head: "w-[clamp(0.7rem,2.6vw,1.9rem)]",
    handle: "h-[26%] w-[clamp(0.7rem,2.8vw,2rem)]",
  },
  sm: { head: "w-2.5", handle: "h-[26%] w-2.5" },
  xs: { head: "w-1.5", handle: "h-[28%] w-1.5" },
};

interface DumbbellShapeProps {
  look: DumbbellLook;
  size?: DumbbellSize;
  /** Picked up off the rail. */
  lifted?: boolean;
  /** Position on the rack (0–6); staggers the set-down animation when set. */
  rackOrder?: number;
}

/** A dumbbell seen side-on: head, handle, head. Use directly on read-only racks. */
export function DumbbellShape({ look, size = "lg", lifted, rackOrder }: DumbbellShapeProps) {
  const { box, head, handle } = LOOKS[look];
  const parts = PARTS[size];
  const headClass = cn("h-full rounded-[3px] transition-colors duration-300", parts.head, head);

  return (
    <span
      style={rackOrder === undefined ? undefined : { animationDelay: `${rackOrder * 70}ms` }}
      className={cn(
        "flex items-center transition-[height,translate] duration-300 ease-out",
        box,
        lifted && look !== "empty" && "-translate-y-3",
        rackOrder !== undefined && "animate-rack-set",
      )}
    >
      <span className={headClass} />
      <span className={cn("transition-colors duration-300", parts.handle, handle)} />
      <span className={headClass} />
    </span>
  );
}

type DumbbellProps = DumbbellShapeProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** A dumbbell you can press. The button is wider than the shape so it's easy to hit. */
export function Dumbbell({ look, size, lifted, rackOrder, className, ...props }: DumbbellProps) {
  return (
    <button
      type="button"
      className={cn(
        "group flex h-full items-end px-0.5 disabled:cursor-default sm:px-3",
        size === "sm" && "px-1.5 sm:px-2",
        className,
      )}
      {...props}
    >
      <DumbbellShape look={look} size={size} lifted={lifted} rackOrder={rackOrder} />
    </button>
  );
}

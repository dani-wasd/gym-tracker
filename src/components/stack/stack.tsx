import * as React from "react";
import { cn } from "@/src/lib/cn";

/*
 * The building blocks of every week picture in the app — a machine's weight
 * stack, one slab per day from Sunday at the top to Saturday at the bottom:
 *
 *   <Stack>
 *     <Slab look="solid" label="Mon 16" />
 *     …one slab per day
 *   </Stack>
 *
 * Every slab is the same size, as on a real machine; only the finish differs.
 * Nothing outside this folder knows how a day is drawn, so the stack can be
 * swapped for another picture without touching the pages.
 */

export type StackSize = "lg" | "sm";

/** Width of the machine, plus room on the right for the selector pin. */
const FRAME: Record<StackSize, string> = {
  lg: "mr-12 w-[min(100%-3rem,18rem)] px-4",
  sm: "mr-7 w-36 px-2.5",
};
const UPRIGHT: Record<StackSize, string> = { lg: "w-2", sm: "w-1" };
const CROSSBAR: Record<StackSize, string> = { lg: "h-2.5", sm: "h-1.5" };
const PULLEY: Record<StackSize, string> = {
  lg: "-mt-1 size-6 border-[5px]",
  sm: "-mt-0.5 size-3.5 border-[3px]",
};
const CABLE: Record<StackSize, string> = { lg: "h-5 w-1", sm: "h-2.5 w-0.5" };
const HEAD: Record<StackSize, string> = { lg: "h-3.5 w-3/5", sm: "h-2 w-3/5" };
const SLABS: Record<StackSize, string> = { lg: "gap-[3px] pt-[3px]", sm: "gap-0.5 pt-0.5" };
const ROW: Record<StackSize, string> = { lg: "h-9 sm:h-10", sm: "h-[1.125rem]" };
const BASE: Record<StackSize, string> = { lg: "mt-[3px] h-3", sm: "mt-0.5 h-1.5" };

interface StackProps {
  size?: StackSize;
  className?: string;
  /** Fires when the pointer leaves the machine as a whole. */
  onMouseLeave?: () => void;
  children: React.ReactNode;
}

/**
 * The machine: two uprights and a crossbar, a pulley with the cable coming
 * down to the top block, the slabs riding two guide rods, and a base.
 */
export function Stack({ size = "lg", className, onMouseLeave, children }: StackProps) {
  const upright = cn("absolute inset-y-0 bg-iron", UPRIGHT[size]);
  const rod = "absolute inset-y-0 w-0.5 bg-steel/60";

  return (
    <div
      onMouseLeave={onMouseLeave}
      className={cn("relative flex shrink-0 flex-col items-center", FRAME[size], className)}
    >
      <span aria-hidden className={cn(upright, "left-0")} />
      <span aria-hidden className={cn(upright, "right-0")} />
      <span aria-hidden className={cn("absolute inset-x-0 top-0 bg-iron", CROSSBAR[size])} />

      <span
        aria-hidden
        className={cn("relative rounded-full border-steel bg-mat", PULLEY[size])}
      />
      <span aria-hidden className={cn("bg-steel", CABLE[size])} />
      <span aria-hidden className={cn("rounded-t-[3px] bg-steel", HEAD[size])} />

      <div className={cn("relative flex w-full flex-col", SLABS[size])}>
        <span aria-hidden className={cn(rod, "left-[22%]")} />
        <span aria-hidden className={cn(rod, "right-[22%]")} />
        {children}
      </div>

      <span aria-hidden className={cn("w-full bg-iron", BASE[size])} />
    </div>
  );
}

/** How a slab is finished — callers map their own meaning onto these. */
export type SlabLook = "solid" | "accent" | "alert" | "hatch" | "hollow" | "ghost" | "empty";

const LOOKS: Record<SlabLook, { slab: string; ink: string; hole: string }> = {
  solid: { slab: "bg-chalk", ink: "text-mat", hole: "bg-mat/70" },
  accent: { slab: "bg-plate-blue", ink: "text-mat", hole: "bg-mat/70" },
  alert: { slab: "animate-plate-pulse bg-plate-yellow", ink: "text-mat", hole: "bg-mat/70" },
  hatch: {
    slab: "plate-hatch border-2 border-plate-red bg-mat",
    ink: "text-chalk",
    hole: "bg-plate-red",
  },
  hollow: { slab: "border-2 border-steel bg-mat-raised", ink: "text-steel", hole: "bg-steel/70" },
  // A free spot asking to be filled: a dashed outline that fills in when the
  // button around it is hovered or focused.
  ghost: {
    slab: "border-2 border-dashed border-steel/60 bg-mat group-hover:border-solid group-hover:border-chalk group-hover:bg-chalk/40 group-focus-visible:border-solid group-focus-visible:border-chalk group-focus-visible:bg-chalk/40",
    ink: "text-steel group-hover:text-chalk group-focus-visible:text-chalk",
    hole: "bg-steel/40",
  },
  // A slab nobody is lifting: same size, dull iron.
  empty: { slab: "bg-iron", ink: "text-steel", hole: "bg-mat/60" },
};

const LABEL: Record<StackSize, string> = {
  lg: "left-3 text-lg",
  sm: "left-1.5 text-[0.6875rem] tracking-wide",
};
const HOLE: Record<StackSize, string> = { lg: "size-2", sm: "size-1" };

interface SlabShapeProps {
  look: SlabLook;
  size?: StackSize;
  /** Stamped on the slab like its weight, e.g. the day. */
  label?: string;
  /** The selector pin goes into this slab. */
  pinned?: boolean;
  /** Nudged out of the stack — the slab being read out. */
  pulled?: boolean;
  /** Position in the stack (0–6); staggers the drop-in animation when set. */
  stackOrder?: number;
}

/** One slab: its label, the pin hole, and the pin if it's in this one. Read-only. */
export function SlabShape({
  look,
  size = "lg",
  label,
  pinned,
  pulled,
  stackOrder,
}: SlabShapeProps) {
  const { slab, ink, hole } = LOOKS[look];

  return (
    <span className={cn("relative block w-full", ROW[size])}>
      <span
        style={stackOrder === undefined ? undefined : { animationDelay: `${stackOrder * 60}ms` }}
        className={cn(
          "relative flex size-full items-center justify-center rounded-[2px] transition-[translate,background-color,border-color] duration-300 ease-out",
          slab,
          pulled && "translate-x-2",
          stackOrder !== undefined && "animate-rack-set",
        )}
      >
        {label && (
          <span
            aria-hidden
            className={cn(
              "absolute font-display leading-none font-bold whitespace-nowrap uppercase transition-colors",
              LABEL[size],
              ink,
            )}
          >
            {label}
          </span>
        )}
        <span aria-hidden className={cn("rounded-full", HOLE[size], hole)} />
      </span>

      {pinned && <SelectorPin size={size} />}
    </span>
  );
}

/** The pin you push into a weight stack — here it marks today. */
function SelectorPin({ size }: { size: StackSize }) {
  const large = size === "lg";
  return (
    <span
      aria-hidden
      className={cn(
        "absolute top-1/2 left-full flex -translate-y-1/2 items-center",
        large ? "-ml-10" : "-ml-5",
      )}
    >
      <span className={cn("rounded-l-full bg-plate-yellow", large ? "h-1.5 w-20" : "h-1 w-10")} />
      <span
        className={cn(
          "rounded-full border-plate-yellow bg-mat",
          large ? "-ml-1 size-4 border-[3px]" : "-ml-0.5 size-2.5 border-2",
        )}
      />
    </span>
  );
}

type SlabProps = SlabShapeProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** A slab you can press. */
export function Slab({
  look,
  size,
  label,
  pinned,
  pulled,
  stackOrder,
  className,
  ...props
}: SlabProps) {
  return (
    <button
      type="button"
      className={cn("group relative z-10 block w-full disabled:cursor-default", className)}
      {...props}
    >
      <SlabShape
        look={look}
        size={size}
        label={label}
        pinned={pinned}
        pulled={pulled}
        stackOrder={stackOrder}
      />
    </button>
  );
}

/** A machine with nothing selected yet, for loading states. */
export function EmptyStack({ size = "lg", className }: { size?: StackSize; className?: string }) {
  return (
    <Stack size={size} className={className}>
      {Array.from({ length: 7 }, (_, index) => (
        <span key={index} className="relative z-10">
          <SlabShape look="empty" size={size} />
        </span>
      ))}
    </Stack>
  );
}

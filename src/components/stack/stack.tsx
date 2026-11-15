import * as React from "react";
import { cn } from "@/src/lib/cn";

/*
 * The building blocks of every week picture in the app — a machine's weight
 * stack, one slab per day from Sunday at the top to Saturday at the bottom:
 *
 *   <Stack>
 *     <Slab look="solid" label="Mon" />
 *     …one slab per day
 *   </Stack>
 *
 * Nothing outside this folder knows how a day is drawn, so the stack can be
 * swapped for another picture without touching the pages.
 */

export type StackSize = "lg" | "sm";

/** Room on the left for day labels and on the right for the selector pin. */
const FRAME: Record<StackSize, string> = {
  lg: "mr-12 ml-[4.5rem] w-[min(100%-7.5rem,15rem)]",
  sm: "mr-5 w-20",
};
const CABLE: Record<StackSize, string> = { lg: "h-7 w-1", sm: "h-3 w-0.5" };
const HEAD: Record<StackSize, string> = { lg: "h-3 w-[55%]", sm: "h-1.5 w-[55%]" };
const SLABS: Record<StackSize, string> = { lg: "gap-1 py-1", sm: "gap-0.5 py-0.5" };
const ROW: Record<StackSize, string> = { lg: "h-9 sm:h-10", sm: "h-2.5" };
const BASE: Record<StackSize, string> = { lg: "h-2", sm: "h-1" };

interface StackProps {
  size?: StackSize;
  className?: string;
  children: React.ReactNode;
}

/** Cable, top block, two guide rods and a base; the slabs ride the rods. */
export function Stack({ size = "lg", className, children }: StackProps) {
  const rod = "absolute inset-y-0 w-0.5 bg-iron";

  return (
    <div className={cn("flex shrink-0 flex-col items-center", FRAME[size], className)}>
      <span aria-hidden className={cn("bg-steel", CABLE[size])} />
      <span aria-hidden className={cn("rounded-t-[3px] bg-steel", HEAD[size])} />
      <div className={cn("relative flex w-full flex-col", SLABS[size])}>
        <span aria-hidden className={cn(rod, "left-1/4")} />
        <span aria-hidden className={cn(rod, "right-1/4")} />
        {children}
      </div>
      <span aria-hidden className={cn("w-[112%] rounded-[2px] bg-iron", BASE[size])} />
    </div>
  );
}

/** How a slab is drawn — callers map their own meaning onto these. */
export type SlabLook = "solid" | "accent" | "alert" | "hatch" | "hollow" | "ghost" | "empty";

const LOOKS: Record<SlabLook, string> = {
  solid: "h-[84%] w-full bg-chalk",
  // A lighter add-on plate, like the small ones that clip on top.
  accent: "h-[84%] w-[62%] bg-plate-blue",
  alert: "h-[84%] w-full animate-plate-pulse bg-plate-yellow",
  hatch: "plate-hatch h-[84%] w-full border-2 border-plate-red",
  hollow: "h-[84%] w-full border-2 border-steel bg-mat-raised",
  // A free spot asking to be filled: a dashed outline that fills in when the
  // button around it is hovered or focused.
  ghost:
    "h-[84%] w-full border-2 border-dashed border-steel/50 bg-mat group-hover:border-solid group-hover:border-chalk group-hover:bg-chalk/40 group-focus-visible:border-solid group-focus-visible:border-chalk group-focus-visible:bg-chalk/40",
  // No slab: just a thin spacer on the rods.
  empty: "h-[20%] w-full bg-iron",
};

interface SlabShapeProps {
  look: SlabLook;
  size?: StackSize;
  /** Shown to the left, e.g. the day. Large stacks only. */
  label?: string;
  /** Marks today's label. */
  marked?: boolean;
  /** The selector pin goes into this slab. */
  pinned?: boolean;
  /** Nudged out of the stack — the slab being read out. */
  pulled?: boolean;
  /** Position in the stack (0–6); staggers the drop-in animation when set. */
  stackOrder?: number;
}

/** One slab row: label, slab, and the pin if it's in this one. Read-only. */
export function SlabShape({
  look,
  size = "lg",
  label,
  marked,
  pinned,
  pulled,
  stackOrder,
}: SlabShapeProps) {
  return (
    <span className={cn("relative flex w-full items-center justify-center", ROW[size])}>
      {label && size === "lg" && (
        <span
          aria-hidden
          className={cn(
            "absolute right-full mr-3 border-b-2 font-display text-lg leading-tight font-bold whitespace-nowrap uppercase",
            marked ? "border-plate-yellow text-chalk" : "border-transparent text-steel",
          )}
        >
          {label}
        </span>
      )}

      <span
        style={stackOrder === undefined ? undefined : { animationDelay: `${stackOrder * 60}ms` }}
        className={cn(
          "block rounded-[3px] transition-[height,width,translate,background-color,border-color] duration-300 ease-out",
          LOOKS[look],
          pulled && "translate-x-2",
          stackOrder !== undefined && "animate-rack-set",
        )}
      />

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
        "absolute left-full flex items-center",
        large ? "-ml-6" : "-ml-2",
      )}
    >
      <span className={cn("rounded-l-full bg-plate-yellow", large ? "h-1.5 w-12" : "h-0.5 w-4")} />
      <span
        className={cn(
          "rounded-full border-plate-yellow bg-mat",
          large ? "-ml-1 size-4 border-[3px]" : "-ml-0.5 size-2 border-2",
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
  marked,
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
        marked={marked}
        pinned={pinned}
        pulled={pulled}
        stackOrder={stackOrder}
      />
    </button>
  );
}

/** A stack with nothing on it yet, for loading states. */
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

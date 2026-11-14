import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/cn";

/*
 * The building blocks of every bar in the app:
 *
 *   <Barbell>
 *     <BarbellSlot label="M"><Plate look="solid" /></BarbellSlot>
 *     …one slot per day
 *   </Barbell>
 */

export type BarbellSize = "lg" | "sm";

const TRACK: Record<BarbellSize, string> = {
  lg: "mt-9 mb-11 h-36 px-[9%] sm:h-52",
  sm: "mt-5 mb-8 h-14 px-[8%]",
};

const BAR: Record<BarbellSize, string> = { lg: "h-2.5", sm: "h-1.5" };
const COLLAR: Record<BarbellSize, string> = { lg: "h-7 w-2.5", sm: "h-4 w-1.5" };

interface BarbellProps {
  size?: BarbellSize;
  className?: string;
  children: React.ReactNode;
}

export function Barbell({ size = "lg", className, children }: BarbellProps) {
  const collar = cn("absolute top-1/2 -translate-y-1/2 rounded-[2px] bg-steel", COLLAR[size]);

  return (
    <div className={cn("relative flex items-center justify-between", TRACK[size], className)}>
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-linear-to-b from-steel to-iron",
          BAR[size],
        )}
      />
      <span aria-hidden className={cn(collar, "left-[3.5%]")} />
      <span aria-hidden className={cn(collar, "right-[3.5%]")} />
      {children}
    </div>
  );
}

interface BarbellSlotProps {
  /** Shown under the bar, e.g. the day letter. */
  label: string;
  /** Shown above the bar, e.g. the day of the month. */
  caption?: string;
  /** Marks today. */
  marked?: boolean;
  children: React.ReactNode;
}

export function BarbellSlot({ label, caption, marked, children }: BarbellSlotProps) {
  return (
    <div className="relative z-10 flex h-full items-center justify-center">
      {caption && (
        <span aria-hidden className="absolute bottom-full mb-2 text-xs text-steel">
          {caption}
        </span>
      )}
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute top-full mt-2 border-b-2 px-0.5 font-display text-lg leading-tight font-bold",
          marked ? "border-plate-yellow text-chalk" : "border-transparent text-steel",
        )}
      >
        {label}
      </span>
    </div>
  );
}

const plateStyles = cva(
  "block rounded-[3px] transition-[height,transform,background-color,border-color,opacity] duration-300 ease-out",
  {
    variants: {
      /** How the plate is drawn — callers map their own meaning onto these. */
      look: {
        solid: "h-full bg-chalk",
        accent: "h-[68%] bg-plate-blue",
        alert: "h-full animate-plate-pulse bg-plate-yellow",
        hatch: "plate-hatch h-full border-2 border-plate-red",
        hollow: "h-full border-2 border-steel bg-mat-raised",
        stub: "h-[18%] bg-iron",
      },
      size: {
        lg: "w-[clamp(0.9rem,3.6vw,2.1rem)]",
        sm: "w-2.5",
      },
      lifted: {
        true: "-translate-y-2",
        false: "",
      },
    },
    defaultVariants: { size: "lg", lifted: false },
  },
);

export type PlateLook = NonNullable<VariantProps<typeof plateStyles>["look"]>;

interface PlateProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof plateStyles> {
  look: PlateLook;
  /** Position on the bar (0–6); staggers the slide-on animation when set. */
  loadOrder?: number;
}

/** A plate seen edge-on. The button is wider than the plate so it's easy to hit. */
export function Plate({ look, size, lifted, loadOrder, className, ...props }: PlateProps) {
  const loadStyle =
    loadOrder === undefined
      ? undefined
      : ({
          animationDelay: `${loadOrder * 70}ms`,
          "--plate-from": loadOrder < 4 ? "-3rem" : "3rem",
        } as React.CSSProperties);

  return (
    <button
      type="button"
      className={cn(
        "flex h-full items-center px-2 disabled:cursor-default sm:px-3",
        size === "sm" && "px-1.5 sm:px-2",
        className,
      )}
      {...props}
    >
      <span
        style={loadStyle}
        className={cn(
          plateStyles({ look, size, lifted }),
          loadOrder !== undefined && "animate-plate-load",
        )}
      />
    </button>
  );
}

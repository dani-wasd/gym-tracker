import { cn } from "@/src/lib/cn";

interface SkeletonTextProps {
  /** Any CSS width; `ch` units keep it close to the text it stands in for. */
  width?: string;
  lines?: number;
  /** Set the font size here — each bar is sized to that text. */
  className?: string;
}

/**
 * Shimmering bars standing in for text that is still loading. They take the
 * font size of their surroundings, so a headline placeholder is headline-sized.
 */
export function SkeletonText({ width = "100%", lines = 1, className }: SkeletonTextProps) {
  return (
    <span aria-hidden className={cn("flex flex-col gap-[0.55em] py-[0.2em]", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <span
          key={index}
          className="skeleton block h-[0.7em] max-w-full"
          // A short last line reads as a paragraph rather than a block.
          style={{ width: lines > 1 && index === lines - 1 ? `calc(${width} * 0.6)` : width }}
        />
      ))}
    </span>
  );
}

/** Wraps a group of placeholders so assistive tech hears one "Loading". */
export function LoadingRegion({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-label={`Loading ${label}`}>
      {children}
    </div>
  );
}

import * as React from "react";
import { cn } from "@/src/lib/cn";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** A labelled input drawn as a single chalk line. */
export function Field({ label, className, ...props }: FieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="eyebrow">{label}</span>
      <input
        className={cn(
          "w-full border-b-2 border-iron bg-transparent py-2 font-mono text-base text-chalk transition-colors placeholder:text-steel/60 focus:border-chalk focus:outline-none",
          className,
        )}
        {...props}
      />
    </label>
  );
}

import * as React from "react";
import { cn } from "@/src/lib/cn";

/** The app's input look: a single chalk line. Shared by every text box and dropdown. */
export const inputStyles =
  "w-full border-b-2 border-iron bg-transparent py-2 font-mono text-base text-chalk transition-colors placeholder:text-steel/60 focus:border-chalk focus:outline-none";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** A labelled input. */
export function Field({ label, className, ...props }: FieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="eyebrow">{label}</span>
      <input className={cn(inputStyles, className)} {...props} />
    </label>
  );
}

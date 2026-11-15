import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/cn";

/** Exported so links can wear the same look: `<Link className={buttonStyles()} />`. */
export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 border-2 font-display font-extrabold uppercase leading-none tracking-[0.08em] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        solid: "border-chalk bg-chalk text-mat hover:bg-transparent hover:text-chalk",
        outline: "border-chalk text-chalk hover:bg-chalk hover:text-mat",
        danger: "border-plate-red text-plate-red hover:bg-plate-red hover:text-mat",
        ghost: "border-transparent text-steel hover:text-chalk",
      },
      size: {
        sm: "px-3 py-2 text-base",
        md: "px-5 py-3 text-xl",
        lg: "px-8 py-4 text-3xl",
        /** No horizontal padding, for buttons that sit in a line of text or links. */
        inline: "px-0 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}

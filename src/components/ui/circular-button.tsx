"use client";

import * as React from "react";
import { cn } from "@/src/components/ui/utils";
import { cva, type VariantProps } from "class-variance-authority";

const circularButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium overflow-hidden ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      size: {
        sm: "w-7 h-7",
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
      },
      bgColor: {
        none: "bg-transparent",
        primary: "bg-primary",
        secondary: "bg-secondary",
        blue: "bg-blue-500",
        green: "bg-green-500",
        white: "bg-white",
        black: "bg-black",
      },
      bgHover: {
        primary: "hover:bg-primary/90",
        secondary: "hover:bg-secondary/90",
        blue: "hover:bg-blue-600",
        green: "hover:bg-green-600",
        white: "hover:bg-gray-100",
        black: "hover:bg-gray-900",
      },
      bgActive: {
        primary: "active:bg-primary/80",
        secondary: "active:bg-secondary/80",
        blue: "active:bg-blue-700",
        green: "active:bg-green-700",
        white: "active:bg-gray-200",
        black: "active:bg-black",
      },
      outlineColor: {
        none: "",
        primary: "border-2 border-primary/50",
        blue: "border-2 border-blue-400",
        green: "border-2 border-green-400",
        white: "border-2 border-white/50",
        black: "border-2 border-black",
      },
    },
    defaultVariants: {
      size: "md",
      bgColor: "none",
      bgHover: "primary",
      bgActive: "primary",
      outlineColor: "white",
    },
  }
);

export interface CircularButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof circularButtonVariants> {
  icon?: React.ReactNode;
}

const CircularButton = React.forwardRef<HTMLButtonElement, CircularButtonProps>(
  ({ className, size, bgColor, bgHover, bgActive, outlineColor, icon, children, ...props }, ref) => {
    return (
      <button
        className={cn(circularButtonVariants({ size, bgColor, bgHover, bgActive, outlineColor, className }))}
        ref={ref}
        {...props}
      >
        {icon || children}
      </button>
    );
  }
);

CircularButton.displayName = "CircularButton";
export default CircularButton;
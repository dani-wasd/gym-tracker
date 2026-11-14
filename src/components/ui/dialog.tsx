"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/src/lib/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** `wide` suits long forms. Either way the dialog scrolls when it outgrows the screen. */
  size?: "default" | "wide";
  children: React.ReactNode;
}

/**
 * Thin wrapper over the native <dialog>: focus trap, Esc and backdrop come for
 * free. Children only mount while open, so their state resets every time.
 */
export function Dialog({ open, onClose, title, size = "default", children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={cn(
        "m-auto max-h-[92dvh] overflow-y-auto border-2 border-chalk bg-mat-raised p-6 text-chalk shadow-[0.5rem_0.5rem_0_0_var(--color-plate-red)] backdrop:bg-mat/85 backdrop:backdrop-blur-sm sm:p-8",
        size === "wide" ? "w-[min(94vw,44rem)]" : "w-[min(92vw,34rem)]",
      )}
    >
      {open && (
        <div className="flex flex-col gap-6">
          <h2 className="headline text-5xl">{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  );
}

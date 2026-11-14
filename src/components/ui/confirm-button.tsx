"use client";

import { useState } from "react";
import { Button } from "./button";

/**
 * A submit button for destructive form actions: the first press arms it,
 * the second one submits the surrounding form.
 */
export function ConfirmButton({ children }: { children: React.ReactNode }) {
  const [isArmed, setIsArmed] = useState(false);

  if (!isArmed) {
    return (
      <Button variant="ghost" size="sm" className="px-0" onClick={() => setIsArmed(true)}>
        {children}
      </Button>
    );
  }

  return (
    <span className="flex items-center gap-4">
      <Button type="submit" variant="danger" size="sm">
        Sure?
      </Button>
      <Button variant="ghost" size="sm" className="px-0" onClick={() => setIsArmed(false)}>
        Keep
      </Button>
    </span>
  );
}

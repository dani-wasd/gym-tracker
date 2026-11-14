"use client";

import { useSyncExternalStore } from "react";

function subscribe(listener: () => void) {
  const interval = setInterval(listener, 1000);
  return () => clearInterval(interval);
}

const currentSecond = () => Math.floor(Date.now() / 1000);

/** The current Unix time in whole seconds, re-rendering once a second. Null on the server. */
export function useNowSeconds(): number | null {
  return useSyncExternalStore(subscribe, currentSecond, () => null);
}

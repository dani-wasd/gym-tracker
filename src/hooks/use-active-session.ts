"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "gym-tracker:session-started-at";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener); // keeps other tabs in sync
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function write(startedAt: string | null) {
  if (startedAt) localStorage.setItem(STORAGE_KEY, startedAt);
  else localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((listener) => listener());
}

/**
 * The in-progress workout, if any. Lives in localStorage so the clock survives
 * reloads and closed tabs.
 */
export function useActiveSession() {
  const startedAt = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(STORAGE_KEY),
    () => null,
  );

  return {
    /** ISO timestamp of when the session started, or null when idle. */
    startedAt,
    start: () => write(new Date().toISOString()),
    clear: () => write(null),
  };
}

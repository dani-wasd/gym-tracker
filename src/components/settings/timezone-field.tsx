"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/src/components/ui/button";
import { inputStyles } from "@/src/components/ui/field";
import { cn } from "@/src/lib/cn";

export interface TimezoneOption {
  value: string;
  /** e.g. "Australia/Sydney (UTC+11:00)" */
  label: string;
}

interface TimezoneFieldProps {
  name: string;
  defaultValue: string;
  options: TimezoneOption[];
}

const noSubscription = () => () => {};
const deviceTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** A timezone dropdown, with a shortcut to the device's own timezone when it differs. */
export function TimezoneField({ name, defaultValue, options }: TimezoneFieldProps) {
  const [value, setValue] = useState(defaultValue);
  // Only known in the browser, so it's null while rendering on the server.
  const device = useSyncExternalStore(noSubscription, deviceTimezone, () => null);
  const canUseDevice =
    device !== null && device !== value && options.some((option) => option.value === device);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        <span className="eyebrow">Timezone</span>
        <select
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          // An opaque background keeps the open option list readable.
          className={cn(inputStyles, "bg-mat")}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <p className="text-xs text-steel">
        Decides when your day starts and ends, and which day a workout counts for.
      </p>
      {canUseDevice && (
        <Button variant="ghost" size="inline" onClick={() => setValue(device)} className="self-start">
          This device is on {device}. Use that
        </Button>
      )}
    </div>
  );
}

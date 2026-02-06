"use client";

import { useState } from "react";
import { Day } from "@/src/definitions";
import {
  GlowCard, GlowCardHeader, GlowCardContent, GlowCardFooter,
  GlowCardDescription,
} from "@/src/components/ui/glow-card";
import CircularButton from "@/src/components/ui/circular-button";
import Button from "@/src/components/ui/button";

const daysOfWeek: Day[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ScheduleSelector() {
  const [isLocked, setIsLocked] = useState(false);
  const [selectedMask, setSelectedMask] = useState(0);

  const toggleDay = (dayIndex: number) => {
    setSelectedMask(prev => prev ^ (1 << dayIndex));
  };

  const isDaySelected = (dayIndex: number) => !!(selectedMask & (1 << dayIndex));

  const toggleLockStatus = () => {
    if (!isLocked) {
      console.log("Sending to backend:", selectedMask);
      // Todo: API call with selectedMask
    }
    setIsLocked(prev => !prev);
  };

  // Todo: Maybe set max width for this card add gradient for button line
  return (
    <GlowCard className="text-center">
      <GlowCardHeader className="text-lg font-bold">Week Planner</GlowCardHeader>
      <GlowCardContent className="flex flex-col justify-center gap-2 py-4">
        <div className="flex flex-row gap-2 justify-center">
          {daysOfWeek.map((day, index) => (
            <CircularButton
              key={day}
              size="lg"
              bgColor={isDaySelected(index) ? "white" : "none"}
              bgHover="white"
              bgActive="white"
              outlineColor="black"
              className={isDaySelected(index) ? "text-black" : "text-white" + " hover:text-black"}
              disabled={isLocked}
              onClick={() => toggleDay(index)}
            >
              {day[0]}
            </CircularButton>
          ))}
        </div>
        <GlowCardDescription>Selected Dates: {daysOfWeek.filter((_, index) => isDaySelected(index)).join(", ")}</GlowCardDescription>
      </GlowCardContent>
      <GlowCardFooter className="flex justify-center pt-2">
        <Button
          variant="outline"
          size="md"
          onClick={toggleLockStatus}
          className="px-8"
        >
          {isLocked ? "Change Schedule" : "Lock In Schedule"}
        </Button>
      </GlowCardFooter>
    </GlowCard>
  );
}
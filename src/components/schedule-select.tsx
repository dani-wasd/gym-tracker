"use client";

import { useState } from "react";
import { Day } from "@/src/lib/definitions";
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
    <GlowCard className="text-center min-w-full">
      <GlowCardHeader className="text-lg font-bold pb-1">Week Planner</GlowCardHeader>
      <GlowCardContent className="flex flex-col justify-center gap-2 py-4">
        <div className="flex flex-row flex-wrap gap-2 justify-center">
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
        <style>{`
          @keyframes rotate {
            100% {
              transform: rotate(1turn);
            }
          }
      
          .animatedOutline::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background-position: 100% 50%;
            background-repeat: no-repeat;
            background-size: 50% 30%;
            filter: blur(6px);
            background-image: linear-gradient(#FFF);
            animation: rotate 4s linear infinite;
          }
        `}</style>
        <div className={`${isLocked ? "" : "animatedOutline"} relative z-0 bg-white/15 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100`} >
          <button
            onClick={toggleLockStatus}
            className="px-8 text-sm py-3 text-white rounded-full font-medium bg-gray-900/80 backdrop-blur"
          >
            {isLocked ? "Change Schedule" : "Lock In Schedule"}
          </button>
        </div>
      </GlowCardFooter>
    </GlowCard>
  );
}
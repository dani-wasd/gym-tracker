"use client";

import { GlowCard, GlowCardHeader, GlowCardContent, GlowCardDescription } from "./ui/glow-card";
import CircularButton from "@/src/components/ui/circular-button";
import { useState, useEffect } from "react";

export default function LogWorkout() {
  const [isWorkingOut, setIsWorkingOut] = useState(false);

  const toggleWorkout = () => {
    setIsWorkingOut(prev => !prev);
  }

  return (
    <GlowCard className="min-w-full text-center">
      <GlowCardHeader className="pb-0">
        {isWorkingOut ? (<WorkoutTimer/>) : ""}
      </GlowCardHeader>

      <GlowCardContent className="pt-[24px] flex flex-col justify-center items-center">
        <CircularButton 
          bgColor={isWorkingOut ? "white" : "none"}
          outlineColor={isWorkingOut ? "black" : "white"}
          className={`${isWorkingOut ? "text-black" : ""} w-50 h-50`}
          onClick={() => toggleWorkout()}
        >
          {isWorkingOut ? "End" : "Workout"}
        </CircularButton>

        <GlowCardDescription className="pt-5">
          <a>Done your workout already? Log it</a>
        </GlowCardDescription>
      </GlowCardContent>
    </GlowCard>
  )
}

function WorkoutTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-4xl font-mono font-bold text-white">
        {formatTime(seconds)}
      </div>
    </div>
  );
}
"use client";

import { GlowCard, GlowCardHeader, GlowCardContent, GlowCardDescription } from "@/src/components/ui/glow-card";
import { WorkoutTimer } from "@/src/components/timer";
import { MusclesSelection } from "@/src/components/muscles-selection";
import CircularButton from "@/src/components/ui/circular-button";
import { useState, useEffect, useRef } from "react";
import { saveWorkout } from "@/src/app/dashboard/actions";

export default function LogWorkout(userId: {userId: string}) {
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const userIdString: string = userId.userId

  // Open/Close modal
  useEffect(() => {
    if (isModalOpen) {
      dialogRef.current?.showModal();
    } 
    else {
      dialogRef.current?.close();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const isWorkingOut = localStorage.getItem("isWorkingOut");
    if (isWorkingOut === "true") {
      setIsWorkingOut(true);
    }
  }, [])

  const toggleWorkout = () => {
    const nextState = !isWorkingOut;

    setIsWorkingOut(nextState);
    localStorage.setItem("isWorkingOut", nextState.toString());

    if (nextState) {
      localStorage.setItem("startTime", new Date().toISOString());
    }
    else {
      setIsModalOpen(true);
    }
  };

  const handleFinishWorkout = async (muscles: string[]) => {
    const startTime = localStorage.getItem("startTime");
    const endTime = new Date().toISOString();

    try {
      await saveWorkout(userIdString, {
        startTime,
        endTime,
        localDate: new Date().toISOString().split("T")[0],
        recordedTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        musclesWorked: muscles,
      });
    }
    catch (error) {
      console.error("Error saving workout:", error); // TODO: Handle Error
    }

    // Cleanup
    setIsWorkingOut(false);
    setIsModalOpen(false);
    localStorage.clear();
  };

  // TODO: Finish log workout logic
  return (
    <div className="w-full items-center justfiy-center">
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
            Done your workout already? Log it
          </GlowCardDescription>
        </GlowCardContent>
      </GlowCard>

      <MusclesSelection
        ref={dialogRef}
        onConfirm={handleFinishWorkout}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
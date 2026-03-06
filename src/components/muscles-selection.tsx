import { forwardRef, useState } from "react";
import { muscleGroup } from "@/src/lib/definitions";
import CircularButton from "./ui/circular-button";

// Add interface because TypeScript oh my days
interface MusclesSelectionProps {
  onConfirm: (muscles: muscleGroup[]) => Promise<void>;
  onClose: () => void;
}

// forwardRef<Type_of_Element, Type_of_Props>
export const MusclesSelection = forwardRef<HTMLDialogElement, MusclesSelectionProps>(
  ({ onConfirm, onClose }, ref) => {
    const muscleGroups: muscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs', 'Full Body'];
    const [selectedMuscles, setSelectedMuscles] = useState<muscleGroup[]>([]);

    const toggleMuscle = (muscle: muscleGroup) => {
      setSelectedMuscles((prev) =>
        prev.includes(muscle)
          ? prev.filter((m) => m !== muscle)
          : [...prev, muscle]
      );
    };

    return (
      <dialog 
        ref={ref} 
        onClose={onClose}
        className="fixed inset-0 m-auto backdrop:bg-black/50 p-6 rounded-lg bg-zinc-900 text-white"
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold">Muscles Selection</h1>
          
          <div className="flex flex-wrap gap-2 my-3">
            {muscleGroups.map((muscle) => (
              <CircularButton
                key={muscle}
                size="lg"
                bgColor={selectedMuscles.includes(muscle) ? "white" : "none"}
                bgHover="white"
                bgActive="white"
                outlineColor="black"
                className={selectedMuscles.includes(muscle) ? "text-black" : "text-white" + " hover:text-black"}
                onClick={() => toggleMuscle(muscle)}
              >{muscle}</CircularButton>)
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button"
              onClick={onClose} 
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={() => onConfirm(selectedMuscles)}
              className="px-4 py-2 bg-white text-black rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);

// Very important for debugging in React DevTools
MusclesSelection.displayName = "MusclesSelection";
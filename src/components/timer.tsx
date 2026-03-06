import { useEffect, useState } from "react";

export function WorkoutTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const startTime = localStorage.getItem("startTime");
    if (startTime) {
      const start = new Date(startTime);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      setSeconds(Math.floor(diff / 1000));
    }

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
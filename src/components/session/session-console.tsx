"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/src/components/ui/button";
import { useActiveSession } from "@/src/hooks/use-active-session";
import { useNowSeconds } from "@/src/hooks/use-now";
import { formatElapsed } from "@/src/lib/dates";
import { HOUR_MS } from "@/src/lib/definitions";
import { LogSessionDialog, type SessionDraft } from "./log-session-dialog";
import { PlateDial } from "./plate-dial";

/** Start/stop the workout clock, or log a finished workout by hand. */
export function SessionConsole() {
  const session = useActiveSession();
  const now = useNowSeconds();
  const [draft, setDraft] = useState<SessionDraft | null>(null);

  const startedAt = session.startedAt ? new Date(session.startedAt) : null;
  const elapsed =
    startedAt && now !== null ? now - Math.floor(startedAt.getTime() / 1000) : 0;

  const handleDial = () => {
    if (!session.startedAt) {
      session.start();
      return;
    }
    setDraft({ mode: "timer", start: session.startedAt, end: new Date().toISOString() });
  };

  const openManualLog = () => {
    const end = new Date();
    setDraft({
      mode: "manual",
      start: new Date(end.getTime() - HOUR_MS).toISOString(),
      end: end.toISOString(),
    });
  };

  const handleLogged = () => {
    if (draft?.mode === "timer") session.clear();
    setDraft(null);
  };

  const handleScrap = () => {
    session.clear();
    setDraft(null);
  };

  return (
    <section className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
      <PlateDial
        spinning={startedAt !== null}
        label={startedAt ? formatElapsed(elapsed) : "Start"}
        sublabel={startedAt ? "Tap to end" : "Session"}
        onClick={handleDial}
      />

      <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
        <p className="eyebrow">Session</p>
        <h2 className="headline text-6xl">
          {startedAt ? "On the clock" : "Rack's waiting"}
        </h2>
        <p className="max-w-xs text-sm text-steel">
          {startedAt
            ? `Running since ${format(startedAt, "h:mm a")}. Hit the plate when you rack it — the clock survives closing this tab.`
            : "Hit the plate when you walk in. Hit it again when you're done and tell it what you trained."}
        </p>
        {!startedAt && (
          <Button variant="outline" size="sm" onClick={openManualLog}>
            Already lifted? Log it by hand
          </Button>
        )}
      </div>

      <LogSessionDialog
        draft={draft}
        onClose={() => setDraft(null)}
        onLogged={handleLogged}
        onScrap={handleScrap}
      />
    </section>
  );
}

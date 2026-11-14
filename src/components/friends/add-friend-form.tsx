"use client";

import { useActionState } from "react";
import { sendFriendRequest } from "@/src/app/(app)/friends/actions";
import { Button } from "@/src/components/ui/button";
import { Field } from "@/src/components/ui/field";
import { FormMessage } from "@/src/components/ui/form-message";

export function AddFriendForm() {
  const [result, formAction, isSending] = useActionState(sendFriendRequest, null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-56 flex-1">
          <Field
            label="Their email"
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="spotter@example.com"
          />
        </div>
        <Button type="submit" disabled={isSending}>
          {isSending ? "Sending…" : "Send request"}
        </Button>
      </div>

      {result?.ok === false && <FormMessage tone="error">{result.error}</FormMessage>}
      {result?.ok && <FormMessage tone="notice">{result.message}</FormMessage>}

      <p className="border-l-4 border-plate-yellow pl-3 text-xs text-steel">
        <span className="text-plate-yellow">Heads up:</span> friends see your week
        on your local clock — the days you planned, when you trained and your UTC
        offset. That narrows down roughly where in the world you are. Only add
        people you&apos;re fine sharing that with.
      </p>
    </form>
  );
}

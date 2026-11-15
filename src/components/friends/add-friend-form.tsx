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
            placeholder="friend@example.com"
          />
        </div>
        <Button type="submit" disabled={isSending}>
          {isSending ? "Sending…" : "Send request"}
        </Button>
      </div>

      {result?.ok === false && <FormMessage tone="error">{result.error}</FormMessage>}
      {result?.ok && <FormMessage tone="notice">{result.message}</FormMessage>}

      <p className="border-l-4 border-plate-yellow pl-3 text-xs text-steel">
        <span className="text-plate-yellow">Note:</span> friends can see the days
        you planned, the times you trained and your UTC offset. Together those
        show roughly where in the world you are, so only add people you&apos;re
        comfortable sharing that with.
      </p>
    </form>
  );
}

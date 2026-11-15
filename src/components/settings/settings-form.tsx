"use client";

import { useActionState } from "react";
import { Button, type ButtonProps } from "@/src/components/ui/button";
import { FormMessage } from "@/src/components/ui/form-message";
import type { ActionResult } from "@/src/lib/definitions";

interface SettingsFormProps {
  action: (previous: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
  variant?: ButtonProps["variant"];
  /** The form's fields. */
  children: React.ReactNode;
}

/** Shared frame for every settings form: fields, result message, submit button. */
export function SettingsForm({ action, submitLabel, variant, children }: SettingsFormProps) {
  const [result, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {children}
      {result?.ok === false && <FormMessage tone="error">{result.error}</FormMessage>}
      {result?.ok && <FormMessage tone="notice">{result.message}</FormMessage>}
      <Button type="submit" variant={variant} disabled={isPending} className="self-start">
        {isPending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import type { AuthFormState } from "@/src/app/(auth)/actions";
import { Button } from "@/src/components/ui/button";
import { FormMessage } from "@/src/components/ui/form-message";

interface AuthFormProps {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  submitLabel: string;
  /** Adds the browser's timezone to the submission (needed at signup). */
  includeTimezone?: boolean;
  /** The form's fields. */
  children: React.ReactNode;
}

/** Shared frame for the login and signup forms: submit, pending and error states. */
export function AuthForm({ action, submitLabel, includeTimezone, children }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  // Read at submit time, in the browser — never during server rendering.
  const submit = (formData: FormData) => {
    if (includeTimezone) {
      formData.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
    formAction(formData);
  };

  return (
    <form action={submit} className="flex flex-col gap-6">
      {children}
      <FormMessage tone="error">{state.error}</FormMessage>
      <FormMessage tone="notice">{state.notice}</FormMessage>
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "One sec…" : submitLabel}
      </Button>
    </form>
  );
}

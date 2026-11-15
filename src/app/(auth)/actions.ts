"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUser } from "@/src/lib/data/users";
import { ROUTES } from "@/src/lib/routes";
import { createClient } from "@/src/lib/supabase/server";
import { parseCredentials, parseSignup } from "@/src/lib/validation";

/** State handed back to the auth forms via `useActionState`. */
export interface AuthFormState {
  error?: string;
  notice?: string;
}

export async function login(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = parseCredentials(formData);
  if (!credentials.ok) return { error: credentials.error };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials.value);
  if (error) return { error: "Wrong email or password." };

  revalidatePath("/", "layout");
  redirect(ROUTES.dashboard);
}

export async function signup(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const input = parseSignup(formData);
  if (!input.ok) return { error: input.error };
  const { email, password, username, timezone } = input.value;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Kept on the login so the profile row can be rebuilt if the insert below fails.
    options: { data: { username, timezone } },
  });

  if (error) return { error: error.message };
  // Supabase answers a signup for an existing email with an identity-less user.
  if (!data.user || data.user.identities?.length === 0) {
    return { error: "An account with that email already exists." };
  }

  await createUser({ userId: data.user.id, email, username, timezone });

  // No session means the project requires email confirmation first.
  if (!data.session) {
    return { notice: "Check your email for a confirmation link, then sign in." };
  }

  revalidatePath("/", "layout");
  redirect(ROUTES.dashboard);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect(ROUTES.login);
}

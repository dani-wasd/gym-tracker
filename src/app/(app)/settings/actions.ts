"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/src/lib/auth";
import { deleteUser, updateUserEmail, updateUserProfile } from "@/src/lib/data/users";
import { isValidTimezone } from "@/src/lib/dates";
import type { ActionResult } from "@/src/lib/definitions";
import { ROUTES } from "@/src/lib/routes";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { createClient } from "@/src/lib/supabase/server";
import { normalizeEmail, parseNewPassword, parseUsername } from "@/src/lib/validation";

type FormAction = (previous: ActionResult | null, formData: FormData) => Promise<ActionResult>;

export const updateProfile: FormAction = async (_previous, formData) => {
  const profile = await requireProfile();

  const username = parseUsername(formData.get("username"));
  if (!username.ok) return username;
  const timezone = formData.get("timezone");
  if (!isValidTimezone(timezone)) return { ok: false, error: "Pick a timezone from the list." };

  await updateUserProfile(profile.userId, { username: username.value, timezone });

  // Keep the copy on the login in step: the profile is rebuilt from it if it's ever lost.
  const supabase = await createClient();
  await supabase.auth.updateUser({ data: { username: username.value, timezone } });

  revalidatePath("/", "layout");
  return { ok: true, message: "Saved." };
};

export const changeEmail: FormAction = async (_previous, formData) => {
  const profile = await requireProfile();

  const email = normalizeEmail(formData.get("email"));
  if (!email) return { ok: false, error: "Enter a valid email address." };
  if (email === profile.email.toLowerCase()) {
    return { ok: false, error: "That's already your email." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({ email });
  if (error) return { ok: false, error: error.message };

  // Projects without email confirmation switch straight away.
  if (data.user?.email?.toLowerCase() === email) {
    await updateUserEmail(profile.userId, email);
    revalidatePath("/", "layout");
    return { ok: true, message: "Email changed." };
  }
  return {
    ok: true,
    message: `We sent a confirmation link to ${email}. Your email changes once you open it.`,
  };
};

export const changePassword: FormAction = async (_previous, formData) => {
  const profile = await requireProfile();

  const current = formData.get("current");
  const next = parseNewPassword(formData.get("next"));
  if (typeof current !== "string" || current.length === 0) {
    return { ok: false, error: "Enter your current password." };
  }
  if (!next.ok) return next;
  if (formData.get("confirm") !== next.value) {
    return { ok: false, error: "The two new passwords don't match." };
  }

  const supabase = await createClient();
  const check = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: current,
  });
  if (check.error) return { ok: false, error: "Your current password is wrong." };

  const { error } = await supabase.auth.updateUser({ password: next.value });
  if (error) return { ok: false, error: error.message };
  return { ok: true, message: "Password changed." };
};

export const deleteAccount: FormAction = async (_previous, formData) => {
  const profile = await requireProfile();

  if (formData.get("confirm") !== profile.username) {
    return { ok: false, error: "Type your username exactly to confirm." };
  }

  // The login goes first: if that fails, nothing has been lost yet.
  const { error } = await createAdminClient().auth.admin.deleteUser(profile.userId);
  if (error) return { ok: false, error: "Couldn't delete the account. Try again." };
  await deleteUser(profile.userId);

  // The login no longer exists, so only the cookies on this device need clearing.
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });

  revalidatePath("/", "layout");
  redirect(ROUTES.home);
};

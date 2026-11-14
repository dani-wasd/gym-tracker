import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createUser, getUserById } from "@/src/lib/data/users";
import { DEFAULT_TIMEZONE } from "@/src/lib/definitions";
import { isValidTimezone } from "@/src/lib/dates";
import { ROUTES } from "@/src/lib/routes";
import type { User } from "@/src/lib/db/schemas";

/** The signed-in Supabase user, or null. Cached per request. */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
});

/**
 * The signed-in user's profile row. Redirects to login when signed out.
 * Server actions must call this instead of trusting a user id from the client.
 */
export const requireProfile = cache(async (): Promise<User> => {
  const authUser = await getAuthUser();
  if (!authUser) redirect(ROUTES.login);

  const profile = await getUserById(authUser.id);
  if (profile) return profile;

  // Signed up but the profile row never landed — rebuild it from signup metadata.
  const metadata = authUser.user_metadata ?? {};
  const email = authUser.email ?? "";
  await createUser({
    userId: authUser.id,
    email,
    username: metadata.username || email.split("@")[0] || "lifter",
    timezone: isValidTimezone(metadata.timezone)
      ? metadata.timezone
      : DEFAULT_TIMEZONE,
  });

  const created = await getUserById(authUser.id);
  if (!created) redirect("/error");
  return created;
});

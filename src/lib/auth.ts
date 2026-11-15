import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createUser, getUserById, updateUserEmail } from "@/src/lib/data/users";
import { DEFAULT_TIMEZONE } from "@/src/lib/definitions";
import { isValidTimezone } from "@/src/lib/dates";
import { ROUTES } from "@/src/lib/routes";
import type { User } from "@/src/lib/db/schemas";

interface AuthIdentity {
  id: string;
  email: string;
  metadata: Record<string, unknown>;
}

/**
 * Who is signed in, or null. Cached per request.
 * `getClaims` checks the session token's signature locally, so unlike
 * `getUser` this doesn't cost a network round trip on every page.
 */
export const getAuthIdentity = cache(async (): Promise<AuthIdentity | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims.sub) return null;

  const { sub, email, user_metadata } = data.claims;
  return { id: sub, email: email ?? "", metadata: user_metadata ?? {} };
});

/**
 * The signed-in user's profile row. Redirects to login when signed out.
 * Server actions must call this instead of trusting a user id from the client.
 */
export const requireProfile = cache(async (): Promise<User> => {
  const identity = await getAuthIdentity();
  if (!identity) redirect(ROUTES.login);

  const profile = await getUserById(identity.id);
  if (profile) {
    // A confirmed email change lands on the login first; carry it over here.
    if (identity.email && identity.email !== profile.email) {
      await updateUserEmail(profile.userId, identity.email);
      return { ...profile, email: identity.email };
    }
    return profile;
  }

  // Signed up but the profile row never landed, so rebuild it from signup metadata.
  const { username, timezone } = identity.metadata;
  await createUser({
    userId: identity.id,
    email: identity.email,
    username:
      typeof username === "string" && username
        ? username
        : identity.email.split("@")[0] || "lifter",
    timezone: isValidTimezone(timezone) ? timezone : DEFAULT_TIMEZONE,
  });

  const created = await getUserById(identity.id);
  if (!created) redirect("/error");
  return created;
});

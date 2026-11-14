import { eq, sql } from "drizzle-orm";
import { db } from "@/src/lib/db/connection";
import { users, type NewUser, type User } from "@/src/lib/db/schemas";
import { DEFAULT_TIMEZONE } from "@/src/lib/definitions";

export function timezoneOf(user: Pick<User, "timezone">): string {
  return user.timezone ?? DEFAULT_TIMEZONE;
}

export async function getUserById(userId: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.userId, userId))
    .limit(1);
  return user ?? null;
}

/** `email` must already be normalized (trimmed, lowercased). */
export async function findUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = ${email}`)
    .limit(1);
  return user ?? null;
}

export async function createUser(values: NewUser): Promise<void> {
  await db.insert(users).values(values).onConflictDoNothing();
}

export async function updateUserTimezone(
  userId: string,
  timezone: string,
): Promise<void> {
  await db.update(users).set({ timezone }).where(eq(users.userId, userId));
}

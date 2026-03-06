import { eq } from "drizzle-orm";
import { db } from "./db/connection";
import { users } from "@/src/lib/db/schemas/index";

export async function getUserPublicData(userId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.userId, userId))
    .limit(1);

  return result[0] ?? null; // results is always an array therefore result[0]
}
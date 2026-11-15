import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const friendships = pgTable(
  "friendships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // Who sent the request.
    userOneId: uuid("user_one_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    // Who received it, and the only one who can accept it.
    userTwoId: uuid("user_two_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    status: text("status").$type<"pending" | "accepted">().default("pending"),
  },
  // One row per pair, per direction.
  (table) => [uniqueIndex("unique_friendship").on(table.userOneId, table.userTwoId)],
);

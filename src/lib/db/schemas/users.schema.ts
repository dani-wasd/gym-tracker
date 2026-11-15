import { relations } from "drizzle-orm";
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { weeklySchedules } from "./weekly_schedules.schema";
import { workouts } from "./workouts.schema";

export const users = pgTable(
  "users",
  {
    // Same id as the Supabase login.
    userId: uuid("user_id").primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    timezone: text("timezone").default("UTC"),
  },
  (table) => [index("users_email_idx").on(table.email)],
);

export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
  schedules: many(weeklySchedules),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

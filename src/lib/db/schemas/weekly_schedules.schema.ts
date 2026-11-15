import { sql } from "drizzle-orm";
import { check, integer, pgTable, serial, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const weeklySchedules = pgTable(
  "weekly_schedules",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    // The Sunday that opens the week, as yyyy-MM-dd.
    weekStartDate: text("week_start_date").notNull(),
    // Planned days as a bitmask: bit 0 is Sunday, bit 6 is Saturday.
    plannedDays: integer("planned_days").notNull(),
  },
  (table) => [
    // Seven bits: anything outside 0–127 isn't a week.
    check("day_range", sql`${table.plannedDays} >= 0 AND ${table.plannedDays} <= 127`),
    uniqueIndex("user_week_idx").on(table.userId, table.weekStartDate),
  ],
);

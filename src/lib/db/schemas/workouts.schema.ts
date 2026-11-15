import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { LoggedExercise } from "../../exercises";
import { users } from "./users.schema";
import { weeklySchedules } from "./weekly_schedules.schema";

export const workouts = pgTable(
  "workouts",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    scheduleId: integer("schedule_id").references(() => weeklySchedules.id, {
      onDelete: "set null",
    }),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    // The yyyy-MM-dd date the workout counts for, in the lifter's timezone.
    localDate: text("local_date").notNull(),
    recordedTimezone: text("recorded_timezone").notNull(),
    musclesWorked: text("muscles_worked").array(),
    // Exercises and their sets, when the lifter noted them. Null on older rows.
    exercises: jsonb("exercises").$type<LoggedExercise[]>(),
  },
  (table) => [
    check("time_check", sql`${table.startTime} < ${table.endTime}`),
    index("workouts_user_date_idx").on(table.userId, table.localDate),
  ],
);

export type Workout = typeof workouts.$inferSelect;

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// USERS TABLE
export const users = pgTable(
  'users',
  {
    userId: uuid('user_id').defaultRandom().primaryKey(),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(), // hashed password
    timezone: text('timezone').notNull(),
  },
  (table) => [
    // index on email
    index('users_email_idx').on(table.email),
  ],
);

// WORKOUTS TABLE
export const workouts = pgTable(
  'workouts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    startTime: timestamp('start_time', { withTimezone: false }).notNull(),
    endTime: timestamp('end_time', { withTimezone: false }).notNull(),
    musclesWorked: text('muscles_worked').notNull(),
  },
  (table) => [
    // index to quickly find workouts by user
    index('workouts_user_id_idx').on(table.userId),
  ],
);

// RELATIONS (optional but nice for `with: { workouts: true }`)
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
}));

export const workoutsRelations = relations(workouts, ({ one }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.userId],
  }),
}));

// TYPES
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;
export type SelectWorkout = typeof workouts.$inferSelect;
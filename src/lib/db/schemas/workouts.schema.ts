import { pgTable, serial, uuid, integer, timestamp, text, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';
import { weeklySchedules } from './weekly_schedules.schema';

export const workouts = pgTable('workouts', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .references(() => users.userId, { onDelete: 'cascade' })
      .notNull(),
    scheduleId: integer('schedule_id')
      .references(() => weeklySchedules.id, { onDelete: 'set null' }),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true }).notNull(),
    localDate: text('local_date').notNull(),
    recordedTimezone: text('recorded_timezone').notNull(),
    musclesWorked: text('muscles_worked').array(),
  }, (table) => [
    check('time_check', sql`${table.startTime} < ${table.endTime}`),
    index('workouts_user_date_idx').on(table.userId, table.localDate),
  ]
);

export type Workout = typeof workouts.$inferSelect;
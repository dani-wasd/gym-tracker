import { pgTable, integer, serial, uuid, check, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';

export const weeklySchedules = pgTable('weekly_schedules', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),
  weekStartDate: text('week_start_date').notNull(), 
  plannedDays: integer('planned_days').notNull(), // Bitmask of days
}, (table) => [
  // Correct SQL for checking values inside an array
  check('day_range', sql`0 <= ALL(${table.plannedDays}) AND 6 >= ALL(${table.plannedDays})`),
  uniqueIndex('user_week_idx').on(table.userId, table.weekStartDate)
]);
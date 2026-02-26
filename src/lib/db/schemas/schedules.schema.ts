import { pgTable, integer, serial, uuid, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema';

export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.userId , { onDelete: 'cascade' })
    .notNull(),
  dayOfWeek: integer('day_of_week').notNull(), 
}, (table) => [
  // Ensures day is always 0-6 (Sunday - Saturday)
  check('day_range', sql`${table.dayOfWeek} >= 0 AND ${table.dayOfWeek} <= 6`)
]);
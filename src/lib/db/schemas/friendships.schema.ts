import { pgTable, uuid, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const friendships = pgTable('friendships', {
  id: uuid('id').defaultRandom().primaryKey(),
  userOneId: uuid('user_one_id')
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),
  userTwoId: uuid('user_two_id')
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),
  status: text('status').$type<'pending' | 'accepted'>().default('pending'),
}, (table) => [
  // Prevents duplicate friendship rows
  uniqueIndex('unique_friendship').on(table.userOneId, table.userTwoId)
]);
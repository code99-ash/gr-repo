import { createId } from '@paralleldrive/cuid2';
import { varchar, timestamp, text, serial } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

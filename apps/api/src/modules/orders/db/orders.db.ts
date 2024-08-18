import { createId } from '@paralleldrive/cuid2';
import {
  integer,
  varchar,
  timestamp,
  serial,
  jsonb,
  text,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { return_requests } from 'src/modules/return_requests/db/return_requests.db';

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  quantity: integer('quantity').notNull(),
  total_amount: integer('total_amount').notNull(),
  delivery_fee: integer('delivery_fee').notNull(),
  meta: jsonb('meta').default({}),
  return_request_uid: text('return_request_uid').references(
    () => return_requests.uid,
  ),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

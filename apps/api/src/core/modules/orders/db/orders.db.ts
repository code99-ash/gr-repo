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
import { z } from 'zod';

export const orders = pgTable('orders', {
  id: varchar('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  quantity: integer('quantity').notNull(),
  total_amount: integer('total_amount').notNull(),
  shipping_fee: integer('shipping_fee').notNull(),
  meta: jsonb('meta').default({}),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export const OrderMeta = z.object({});

// export const BaseOrder = createSelectSchema(orders, {
//   meta: OrderMeta,
// });

// export const CreateBaseOrder = createInsertSchema(orders, {
//   meta: OrderMeta,
// });

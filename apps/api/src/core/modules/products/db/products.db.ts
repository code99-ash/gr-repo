import { createId } from '@paralleldrive/cuid2';
import {
  integer,
  varchar,
  timestamp,
  text,
  jsonb,
  serial,
  pgTable,
  unique
} from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { stores } from '../../stores/db/stores.db';
import { policies } from '../../policies/db/policies.db';

export const products = pgTable('products', {
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  store_uid: varchar('store_uid').references(() => stores.uid).notNull(),
  product_id: varchar('product_id').notNull(),
  title: text('title').notNull(),
  product_type: text('product_type'),
  status: varchar('status').notNull(),
  images: jsonb('images').default([]),
  meta: jsonb('meta').default({}),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export const products_policies = pgTable('products_policies', {
  id: serial('id').primaryKey(),
  product_uid: varchar('product_uid').references(() => products.uid).notNull(),
  policy_uid: varchar('policy_uid').references(() => policies.uid).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
}, (table) => ({
  uniqueProductPolicy: unique('unique_product_policy').on(table.product_uid, table.policy_uid)
}));


export const CreateProduct = createInsertSchema(products);
  
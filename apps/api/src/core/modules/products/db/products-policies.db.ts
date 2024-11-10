import {
  varchar,
  timestamp,
  serial,
  pgTable,
  unique
} from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { policies } from '../../policies/db/policies.db';
import { products } from './products.db';

export const products_policies = pgTable('products_policies', {
  id: serial('id').primaryKey(),
  product_uid: varchar('product_uid').references(() => products.uid).notNull(),
  policy_uid: varchar('policy_uid').references(() => policies.uid).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
}, (table) => ({
  uniqueProductPolicy: unique('unique_product_policy').on(table.product_uid, table.policy_uid)
}));


export const CreateProductPolicy = createInsertSchema(products_policies);
  
import { varchar, pgTable, primaryKey } from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { policies } from '../../policies/db/policies.db';
import { products } from './products.db';

export const productsOnpolicies = pgTable('products_policies', {
  product_id: varchar('product_id').references(() => products.id, {onDelete: 'cascade'}).notNull(),
  policy_uid: varchar('policy_uid').references(() => policies.uid, {onDelete: 'cascade'}).notNull()
}, 
(t) => ({
  pk: primaryKey({ columns: [t.product_id, t.policy_uid] }),
}),
);

export const CreateProductPolicy = createInsertSchema(productsOnpolicies);
  
import {
  varchar,
  pgTable,
  primaryKey,
} from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { collections } from './collections.db';
import { products } from '../../products/db/products.db';

export const collectionOnProducts = pgTable('collections_to_products', {
  collection_id: varchar('collection_id').references(() => collections.id, {onDelete: 'cascade'}).notNull(),
  product_id: varchar('product_id').references(() => products.id, {onDelete: 'cascade'}).notNull()
},
(t) => ({
  pk: primaryKey({ columns: [t.collection_id, t.product_id] }),
}),
);

export const CreateCollectionProduct = createInsertSchema(collectionOnProducts);
import { createId } from '@paralleldrive/cuid2';
import {
  varchar,
  timestamp,
  text,
  jsonb,
  pgTable
} from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { stores } from '../../stores/db/stores.db';
import { z } from 'zod';

export const ProductMeta = z.record(z.string(), z.any()).optional()

export const products = pgTable('products', {
  id: varchar('id').primaryKey().notNull(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  store_uid: varchar('store_uid').references(() => stores.uid).notNull(),
  title: text('title').notNull(),
  status: varchar('status').notNull(),
  images: jsonb('images').default([]),
  meta: jsonb('meta')
        .$type<z.infer<typeof ProductMeta>>()
        .default({}),
  deleted_at: timestamp('deleted_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});


export const CreateProduct = createInsertSchema(products, {
  meta: ProductMeta
});
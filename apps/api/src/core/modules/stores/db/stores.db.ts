import { createId } from '@paralleldrive/cuid2';
import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { organizations } from '../../organizations/db/organizations.db';

export type store_types = 'shopify' | 'woocommerce' | 'etsy' | 'amazon' | 'custom';

export const store_type = pgEnum('store_type', ['shopify', 'woocommerce', 'etsy', 'amazon', 'custom']);


export const stores = pgTable('stores', {
  uid: varchar('uid', { length: 256 }).primaryKey().$default(createId).unique().notNull(),
  organization_uid: varchar('organization_uid').references(() => organizations.uid),
  store_name: varchar('store_name').notNull(),
  store_type: store_type('store_type').notNull(),
  api_key: jsonb('api_key').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});


export const CreateStore = createInsertSchema(stores);

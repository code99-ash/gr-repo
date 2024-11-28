import { createId } from '@paralleldrive/cuid2';
import {
  varchar,
  timestamp,
  jsonb,
  pgTable,
  pgEnum,
} from 'drizzle-orm/pg-core';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { stores } from '../../stores/db/stores.db';

export const origin = pgEnum('origin', ['internal', 'external']);

export const collections = pgTable('collections', {
    id: varchar('id').primaryKey().notNull(),
    uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
    store_uid: varchar('store_uid').references(() => stores.uid).notNull(),
    title: varchar('title').notNull(),
    origin: origin('origin').default('external').notNull(),
    meta: jsonb('meta').default({}),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()),
});

export const CollectionSchema = createSelectSchema(collections);

export const CreateCollection = createInsertSchema(collections);

export const ClientCollection = CreateCollection.omit({
    store_uid: true
})
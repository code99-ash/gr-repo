import { createId } from '@paralleldrive/cuid2';
import {
  integer,
  varchar,
  timestamp,
  text,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  images: jsonb('images').default([]),
  meta: jsonb('meta').default({}),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

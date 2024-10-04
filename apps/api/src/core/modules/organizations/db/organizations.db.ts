import { createId } from '@paralleldrive/cuid2';
import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  name: text('name').notNull(),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const CreateOrganization = createInsertSchema(organizations);
export const UpdateOrganization = CreateOrganization.omit({
  uid: true,
  created_at: true,
}).partial();

import { createId } from '@paralleldrive/cuid2';
import { varchar, timestamp, text, serial, boolean } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  middle_name: text('middle_name'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const CreateUser = createInsertSchema(users);

export const UpdateUser = CreateUser.omit({
  uid: true,
  id: true,
  created_at: true,
});

export const BaseUser = createSelectSchema(users);

export const SafeBaseUser = BaseUser.omit({
  is_deleted: true,
  deleted_at: true,
  updated_at: true,
  created_at: true,
});

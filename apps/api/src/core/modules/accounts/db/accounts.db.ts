import { createId } from '@paralleldrive/cuid2';
import {
  varchar,
  timestamp,
  text,
  serial,
  pgEnum,
  pgTable,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';
import { organizations } from '../../organizations/db/organizations.db';
import { users } from '../../users/db/users.db';
import { AccountType } from '../schemas/account.schemas';
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const type = pgEnum('type', [AccountType.ADMIN, AccountType.USER]);

export const Permissions = z.array(z.string());

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  organization_uid: text('organization_uid').references(
    () => organizations.uid,
  ),
  user_uid: text('user_uid').references(() => users.uid),
  email: text('email').notNull(),
  type: type('type').notNull(),
  permissions: jsonb('permissions')
    .$type<z.infer<typeof Permissions>>()
    .default([])
    .notNull(),
  password: text('password').notNull(),
  is_active: boolean('is_active').default(false).notNull(),
  is_deleted: boolean('is_deleted').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

// refine the json types with proper validation to improve types
export const BaseAccount = createSelectSchema(accounts, {
  permissions: Permissions,
});

export const SafeBaseAccount = BaseAccount.omit({
  password: true,
  is_deleted: true,
});

// refine the json types with proper validation to improve types
export const CreateBaseAccount = createInsertSchema(accounts, {
  permissions: Permissions,
});

export const UpdateBaseAccount = CreateBaseAccount.omit({
  password: true,
  permissions: true,
  email: true,
  is_active: true,
  is_deleted: true,
  uid: true,
  id: true,
}).partial();

export const UpdateSensitiveBaseAccount = CreateBaseAccount.pick({
  password: true,
  permissions: true,
  email: true,
  is_active: true,
  is_deleted: true,
}).partial();

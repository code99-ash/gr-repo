import { createId } from '@paralleldrive/cuid2';
import {
  varchar,
  timestamp,
  text,
  serial,
  pgEnum,
  pgTable,
} from 'drizzle-orm/pg-core';
import { organizations } from '../../organizations/db/organizations.db';
import { users } from '../../users/db/users.db';
import { AccountRoles } from '../account.schemas';

export const roles = pgEnum('role', [AccountRoles.ADMIN, AccountRoles.USER]);

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  organization_uid: text('organization_uid').references(
    () => organizations.uid,
  ),
  user_uid: text('user_uid').references(() => users.uid),
  email: text('email').notNull(),
  role: roles('role').notNull(),
  password: text('password').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

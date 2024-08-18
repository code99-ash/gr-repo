import { relations } from 'drizzle-orm';
import { users } from './users.db';
import { accounts } from 'src/modules/accounts/db/accounts.db';

export const oneUserToOneAccountRelations = relations(users, ({ one }) => ({
  account: one(accounts, {
    fields: [users.uid],
    references: [accounts.user_uid],
  }),
}));

import { relations } from 'drizzle-orm';
import { accounts } from './accounts.db';
import { organizations } from 'src/core/modules/organizations/db/organizations.db';

export const accountsRelations = relations(accounts, ({ one }) => ({
  customer: one(organizations, {
    fields: [accounts.uid],
    references: [organizations.uid],
  }),
}));

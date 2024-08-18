import { relations } from 'drizzle-orm';
import { accounts } from './accounts.db';
import { organizations } from 'src/db/schemas';

export const accountsRelations = relations(accounts, ({ one }) => ({
  customer: one(organizations, {
    fields: [accounts.uid],
    references: [organizations.uid],
  }),
}));

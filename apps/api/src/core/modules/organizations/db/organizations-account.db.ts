import { relations } from 'drizzle-orm';
import { organizations } from './organizations.db';
import { accounts } from 'src/core/modules/accounts/db/accounts.db';

export const organizationRelations = relations(organizations, ({ many }) => ({
  accounts: many(accounts),
}));

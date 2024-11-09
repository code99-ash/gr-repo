import { relations } from 'drizzle-orm';
import { organizations } from '../../organizations/db/organizations.db';
import { stores } from './stores.db';

export const storeRelations = relations(stores, ({ one }) => ({
  organization: one(organizations, {
    fields: [stores.organization_uid],
    references: [organizations.uid],
  }),
}));

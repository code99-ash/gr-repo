import { relations } from 'drizzle-orm';
import { organizations } from '../../organizations/db/organizations.db';
import { stores } from './stores.db';
import { collections } from 'src/common/db/schemas';

export const storeRelations = relations(stores, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [stores.organization_uid],
    references: [organizations.uid],
  }),

  collection: many(collections)
}));

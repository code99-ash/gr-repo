import { relations } from 'drizzle-orm';
import { policies } from './policies.db';
import { organizations } from '../../organizations/db/organizations.db';
import { users } from '../../users/db/users.db';
import { productsOnpolicies } from 'src/common/db/schemas';


export const policyRelations = relations(policies, ({one, many}) => ({
  organization: one(organizations, {
    fields: [policies.organization_uid],
    references: [organizations.uid]
  }),

  activated_by: one(users, {
    fields: [policies.activated_by],
    references: [users.uid]
  }),
}))
import { relations } from 'drizzle-orm';
import { policy_histories } from './policy_histories.db';
import { policies } from '../../policies/db/policies.db';


export const policyHistoryRelations = relations(policy_histories, ({one, many}) => ({
  policies: one(policies, {
    fields: [policy_histories.policy_uid],
    references: [policies.uid]
  })

}))
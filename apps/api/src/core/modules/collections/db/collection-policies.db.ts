import { varchar, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { collections } from './collections.db';
import { policies } from 'src/common/db/schemas';
  
export const collectionOnPolicies = pgTable('collection_to_policies', {
    collection_id: varchar('collection_id').references(() => collections.id).notNull(),
    policy_uid: varchar('policy_uid').references(() => policies.uid).notNull()
},
(t) => ({
    pk: primaryKey({ columns: [t.collection_id, t.policy_uid] }),
}),
);
  
export const CreateCollectionPolicy = createInsertSchema(collectionOnPolicies);
import {
    jsonb,
    pgTable,
    serial,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { policies } from '../../policies/db/policies.db'
import { users } from '../../users/db/users.db';
import { z } from 'zod';

import { policy_status, policy_type, PolicyFlowSchema } from 'src/common/db/schemas';
  
export const policy_histories = pgTable('policy_histories', {
    id: serial('id').primaryKey(),
    policy_uid: text('policy_uid').references(() => policies.uid).notNull(),
    policy_name: text('policy_name').notNull(),
    policy_type: policy_type('policy_type').notNull(),
    policy_flow: jsonb('policy_flow')
                    .$type<z.infer<typeof PolicyFlowSchema>>()
                    .notNull(),
    policy_status: policy_status('policy_status').notNull(),
    activated_by: text('activated_by').references(() => users.uid),
    activated_at: timestamp('activated_at'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()),
});

export const SelectPolicyHistory = createSelectSchema(policy_histories, {
    policy_flow: PolicyFlowSchema
})

// refine the json types with proper validation to improve types
export const CreatePolicyHistory = createInsertSchema(policy_histories, {
    policy_flow: PolicyFlowSchema
})
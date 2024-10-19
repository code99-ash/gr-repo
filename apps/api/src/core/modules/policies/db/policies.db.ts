import {
    jsonb,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { organizations } from '../../organizations/db/organizations.db'
import { users } from '../../users/db/users.db';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';
  
export const PolicyFlowRecord = z.object({
    options: z.array(z.number()),
    created_at: z.string(),
    title: z.string(),
    policy_history_uid: z.string(),
})

export const PolicyHistory = z.array(PolicyFlowRecord);

export const policy_type = pgEnum('option_type', ['product', 'order', 'customer', 'duration']);
export const status = pgEnum('status', ['draft', 'published', 'active']);

  
export const policies = pgTable('policies', {
    id: serial('id').primaryKey(),
    uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
    organization_uid: varchar('organization_uid').references(() => organizations.uid).notNull(),
    policy_name: text('policy_name').notNull(),
    policy_type: policy_type('policy_type').notNull(),
    current_flow: jsonb('current_flow')
                    .$type<z.infer<typeof PolicyFlowRecord>>()
                    .notNull(),
    policy_history: jsonb('policy_history')
                    .$type<z.infer<typeof PolicyHistory>>()
                    .default([]),
    status: status('status').default('draft').notNull(),
    activated_by: text('activated_by').references(() => users.uid),
    activated_at: timestamp('activated_at'),
    deleted_at: timestamp('deleted_at'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()),
});

// refine the json types with proper validation to improve types
export const CreatePolicy = createInsertSchema(policies, {
    current_flow: PolicyFlowRecord
});

export const UpdatePolicy = CreatePolicy.omit({
    uid: true,
    organization_uid: true,
    policy_type: true,
    deleted_at: true,
    created_at: true,
})
.partial()
.extend({
    policy_history: PolicyHistory.optional(),
    current_flow: PolicyFlowRecord.optional(),
});
  
export const ActivatePolicy = CreatePolicy.pick({
    status: true,
    activated_at: true,
    activated_by: true
}).extend({
    current_flow: PolicyFlowRecord,
});

export const DeletePolicy = CreatePolicy.pick({
    deleted_at: true
}).partial() // Might want to delete anyway
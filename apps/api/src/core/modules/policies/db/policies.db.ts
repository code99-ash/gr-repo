import {
    jsonb,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { organizations } from '../../organizations/db/organizations.db'
import { users } from '../../users/db/users.db';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';
  
const NodeTypeEnum = z.enum(['conditions', 'user-input', 'action']);

export const NodeRecord = z.record(z.object({
    id: z.string(),
    parent: z.string().nullable(),
    node_type: NodeTypeEnum,
    data: z.any(),
    branches: z.array(
        z.object({
            node_id: z.any(),
            label: z.string().nullable()
        })
    ),
}))

export const FlowRecord = z.object({
    policy_flow: NodeRecord,
    created_at: z.string(),
    policy_name: z.string(),
    activated_by: z.string().nullable(),
    policy_flow_uid: z.string(),
})

export const PolicyHistory = z.array(FlowRecord);

export const policy_type = pgEnum('option_type', ['product', 'order', 'customer', 'duration']);
export const status = pgEnum('status', ['draft', 'published', 'active']);

  
export const policies = pgTable('policies', {
    id: serial('id').primaryKey(),
    uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
    organization_uid: text('organization_uid').references(() => organizations.uid), // nullable for now
    policy_name: text('policy_name').notNull(),
    policy_type: policy_type('policy_type').notNull(),
    current_flow: jsonb('current_flow')
                    .$type<z.infer<typeof FlowRecord>>()
                    .notNull(),
    policy_history: jsonb('policy_history')
                    .$type<z.infer<typeof PolicyHistory>>()
                    .default([])
                    .notNull(),
    status: status('status').default('draft').notNull(),
    activated_by: text('activated_by').references(() => users.uid),
    activated_at: timestamp('activated_at'),
    deleted_at: timestamp('deleted_at'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()),
});

export const SelectPolicy = createSelectSchema(policies, {
    current_flow: FlowRecord,
    policy_history: PolicyHistory
})

// refine the json types with proper validation to improve types
export const CreatePolicy = createInsertSchema(policies, {
    current_flow: FlowRecord,
    policy_history: PolicyHistory
})

export const UnprocessedPolicyCreate = createInsertSchema(policies).omit({
    current_flow: true
})
.extend({
    policy_history: PolicyHistory.optional(),
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
    current_flow: FlowRecord.optional(),
});
  
export const ActivatePolicy = CreatePolicy.pick({
    status: true,
    activated_at: true,
    activated_by: true
}).extend({
    current_flow: FlowRecord,
});

export const DeletePolicy = CreatePolicy.pick({
    deleted_at: true
}).partial() // Might want to delete anyway
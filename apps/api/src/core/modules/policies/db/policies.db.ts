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

export const PolicyFlowSchema = z.record(z.object({
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

export const policy_type = pgEnum('policy_type', ['product', 'order', 'customer', 'duration']);
export const policy_status = pgEnum('status', ['draft', 'published', 'active']);

  
export const policies = pgTable('policies', {
    id: serial('id').primaryKey(),
    uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
    organization_uid: text('organization_uid').references(() => organizations.uid), // nullable for now
    policy_name: text('policy_name').notNull(),
    policy_type: policy_type('policy_type').notNull(),
    policy_flow: jsonb('policy_flow')
                    .$type<z.infer<typeof PolicyFlowSchema>>()
                    .notNull(),
    status: policy_status('status').default('draft').notNull(),
    activated_by: text('activated_by').references(() => users.uid),
    activated_at: timestamp('activated_at'),
    deleted_at: timestamp('deleted_at'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()),
});

export const SelectPolicy = createSelectSchema(policies, {
    policy_flow: PolicyFlowSchema
})

export const CreatePolicy = createInsertSchema(policies, {
    policy_flow: PolicyFlowSchema
})


export const UpdatePolicy = CreatePolicy.omit({
    uid: true,
    status: true,
    organization_uid: true,
    policy_type: true,
    deleted_at: true,
    created_at: true,
})
.partial()
.extend({
    policy_flow: PolicyFlowSchema.optional(),
});
  
export const ActivatePolicy = CreatePolicy.pick({
    status: true,
    activated_at: true,
    activated_by: true
})

export const UpdatePolicyStatus = CreatePolicy.pick({
    status: true
})
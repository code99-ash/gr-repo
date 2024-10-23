import { z } from 'zod';

const CATEGORY_LIST = ['Discounted orders', 'Orders without discounts', 'Order value'] as const;
const OPERATOR_LIST = ['is less than', 'is greater than'] as const;

// Define the valid node types
const NodeTypeEnum = z.enum(['conditions', 'action'] as const);
const OrderCategoryEnum = z.enum(CATEGORY_LIST);
const OperatorEnum = z.enum(OPERATOR_LIST);


// Define the schema for branches
const BranchSchema = z.object({
    node_id: z.any(),
    label: z.any().nullable(),
}).nullable()


export const OrderPolicyValidator = z.record(
    z.object({
        node_type: NodeTypeEnum,
        branches: z.array(BranchSchema),
        data: z.object({
            action_type: z.enum(['Decline', 'Approve']).optional(),
            message: z.string().optional(),
            
            category: OrderCategoryEnum.optional(),
            operator: OperatorEnum.optional(),
            value: z.number().optional(),
        })
    }).refine((node) => {
        const { node_type, branches, data } = node;

        if (node_type === 'conditions') {
            if (branches.length < 1) return false;

            
            if (!data?.category || !data?.operator || !data?.value) {
                return false;
            }
        }

        if (node_type === 'action') {
            if (!data?.action_type) {
                return false;
            }
        }

        
        return true;
    }, {
        message: 'Invalid branches or message based on node_type and action_type',
        path: ['branches', 'data'],
    })
).transform((data) => {
    // Strip properties with undefined values
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return [key, Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined))];
            }
            return [key, value];
        })
    );
});

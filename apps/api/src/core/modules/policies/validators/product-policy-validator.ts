import { z } from 'zod';

const INPUT_TYPES = ['yes_no_question', 'multiple_choice_question', 'upload'] as const;

// Define the valid node types
const NodeTypeEnum = z.enum(['conditions', 'user-input', 'action']);
const ACTIONS = [
    'Accept Exchange',
    'Accept Refund',
    'Manual Review',
    // 'AI Review',
    'Decline'
] as const;

// Define the schema for branches
const BranchSchema = z.object({
    node_id: z.any(),
    label: z.any().nullable(),
}).nullable()


export const ProductPolicyValidator = z.record(
    z.object({
        node_type: NodeTypeEnum,
        branches: z.array(BranchSchema),
        data: z.object({
            input_type: z.enum(INPUT_TYPES).optional(),
            message: z.string().optional(),
            list: z.array(z.string()).min(1).optional(),
            ruling: z.enum(['any', 'all']).optional(),
            action_type: z.enum(ACTIONS).optional(),
        })
    }).refine((node) => {
        const { node_type, branches, data } = node;


        if (node_type === 'conditions') {
            if (branches.length < 1) return false;

            const ruling = data?.ruling ?? 'any';
            if (!data?.list || data.list.length < 1 || !['any', 'all'].includes(ruling)) {
                return false;
            }
        }

        if(!data.input_type) return false;

        if (node_type === 'user-input' && INPUT_TYPES.includes(data.input_type)) {
            if (branches.length !== 2 || !data?.message) return false;
        }

      
        if (node_type === 'user-input' && data?.input_type === 'upload') {
            if (branches.length !== 1 || !data?.message) return false;
        }

        if (node_type === 'action' && !data?.action_type) {
            return false;
        }


        return true;
    }, {
        message: 'Invalid branches or data based on node_type and input_type',
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

import { z } from 'zod';
import { action_types, product_node_types } from './constants';


// Define the valid node types
const NodeTypeEnum = z.enum(product_node_types);


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
            message: z.string().optional(),
            list: z.array(z.string()).min(1).optional(),
            ruling: z.enum(['any', 'all']).optional(),
            action_type: z.enum(action_types).optional(),
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

        if (node_type === 'yes_no_question' || node_type === 'multiple_choice_question') {
            if (branches.length !== 2 || !data?.message) return false;
        }

      
        if (node_type === 'asset_upload' && !data?.message) {
            if (branches.length !== 1) return false;
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

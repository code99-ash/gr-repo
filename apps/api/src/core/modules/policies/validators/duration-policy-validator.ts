import { z } from 'zod';
import { action_types, node_types, periods } from './constants';

// Define the valid node types
const NodeTypeEnum = z.enum(node_types);
const PeriodEnum = z.enum(periods);


// Define the schema for branches
const BranchSchema = z.object({
    node_id: z.any(),
    label: z.any().nullable(),
}).nullable()


export const DurationPolicyValidator = z.record(
    z.object({
        node_type: NodeTypeEnum,
        branches: z.array(BranchSchema),
        data: z.object({
            action_type: z.enum(action_types).optional(),
            message: z.string().optional(),

            period: PeriodEnum.optional(),
            period_value: z.number().optional(),
        })
    }).refine((node) => {
        const { node_type, branches, data } = node;

        if (node_type === 'conditions') {
            if (branches.length < 1) return false;

            
            if (!data?.period || !data?.period_value) {
                return false;
            }
        }

        if (node_type === 'action' && !data?.action_type) {
            return false;
        }

        
        return true;
    }, {
        message: 'Invalid branches or data based on node_type and action_type',
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

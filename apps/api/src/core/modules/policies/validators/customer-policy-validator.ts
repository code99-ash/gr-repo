import { z } from 'zod';


const OPERATOR_LIST = ['is less than'] as const;
const PERIODS = [
    'Hours',
    'Days',
    'Weeks',
    'Months',
    'Years',
] as const;
const CUSTOMER_ACTIONS = [
    'Accept Exchange',
    'Accept Refund',
    'Decline'
] as const;

// Define the valid node types
const NodeTypeEnum = z.enum(['conditions', 'action'] as const);
const PeriodEnum = z.enum(PERIODS);
const OperatorEnum = z.enum(OPERATOR_LIST);


// Define the schema for branches
const BranchSchema = z.object({
    node_id: z.any(),
    label: z.any().nullable(),
}).nullable()


export const CustomerPolicyValidator = z.record(
    z.object({
        node_type: NodeTypeEnum,
        branches: z.array(BranchSchema),
        data: z.object({
            action_type: z.enum(CUSTOMER_ACTIONS).optional(),
            message: z.string().optional(),

            expectedPeriod: z.number().optional(),
            operator: OperatorEnum.optional(),
            period: PeriodEnum.optional(),
            periodValue: z.number().optional(),
        })
    }).refine((node) => {
        const { node_type, branches, data } = node;

        if (node_type === 'conditions') {
            if (branches.length < 1) return false;

            
            if (!data?.expectedPeriod || !data?.operator || !data?.period || !data?.periodValue) {
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

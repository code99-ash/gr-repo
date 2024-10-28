import { z } from 'zod';
import { node_types } from './constants';
import { BranchSchema as branch_schema } from './schemas/branch-schema';
import { NodeType, transformUndefinedValues, validateConditionBranch, validatePolicyRecord } from './schemas/common';
import { ActionValidator } from './schemas/action-schema';
import { OrderConditionValidator } from './schemas/order-schema';

const validatorMap = {
    conditions: OrderConditionValidator,
    action: ActionValidator,
} as const;

function getValidatorForNodeType(nodeType: keyof typeof validatorMap) {
    const validator = validatorMap[nodeType];
    if (!validator) {
        throw new Error(`Unknown node type: ${nodeType}`);
    }
    return validator;
}


export const OrderPolicyValidator = z.record(
    z.string(),
    z.object({
        node_type: z.enum(node_types),
        branches: z.array(branch_schema),
        data: z.union([
            OrderConditionValidator,
            ActionValidator,
        ]),
    }).refine(validateConditionBranch)
).transform(transformUndefinedValues)
.refine((record: Record<string, NodeType>) => validatePolicyRecord(record, getValidatorForNodeType), {
    message: "Invalid policy flow: one or more validations failed"
});
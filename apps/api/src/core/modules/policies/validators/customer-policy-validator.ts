import { z } from 'zod';
import { node_types } from './constants';
import { CustomerConditionValidator } from './schemas/customer-schema';
import { ActionValidator } from './schemas/action-schema';
import { transformUndefinedValues, validateConditionBranch } from './schemas/common';
import { BranchSchema as branch_schema } from './schemas/branch-schema';

type NodeType = {
    node_type: typeof node_types[number];
    branches: Array<{ node_id: string }>;
    data: any;
};

const validatorMap = {
    conditions: CustomerConditionValidator,
    action: ActionValidator,
} as const;

function getValidatorForNodeType(nodeType: keyof typeof validatorMap) {
    const validator = validatorMap[nodeType];
    if (!validator) {
        throw new Error(`Unknown node type: ${nodeType}`);
    }
    return validator;
}

// Define the main schema
export const CustomerPolicyValidator = z.record(

    z.object({
        node_type: z.enum(node_types),
        branches: z.array(branch_schema),
        data: z.union([
            CustomerConditionValidator,
            ActionValidator
        ]),
    }).refine(validateConditionBranch)

).transform(transformUndefinedValues)
.refine((record) => {
    const nodeIds = new Set(Object.keys(record));

    for (const [nodeId, node] of Object.entries(record)) {
        const typedNode = node as NodeType; // Type assertion

        // Ensure data meets the requirements of its validator
        const dataValidator = getValidatorForNodeType(typedNode.node_type);
        const validationResult = dataValidator.safeParse(typedNode.data);
        
        if (!validationResult.success) {
            throw new Error(`Data validation failed for node ID "${nodeId}": ${validationResult.error}`);
        }

        // Check if all branch node_ids exist in the record
        for (const branch of typedNode.branches) {
            if (!nodeIds.has(branch.node_id)) {
                throw new Error(`Branch node_id "${branch.node_id}" does not exist in the record for node ID "${nodeId}"`);
            }
        }
    }
    return true;
}, {
    message: "Invalid policy flow: one or more validations failed"
});
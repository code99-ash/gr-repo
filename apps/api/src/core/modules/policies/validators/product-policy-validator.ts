import { z } from 'zod';
import { product_node_types } from './constants';
import { BranchSchema as branch_schema } from './schemas/branch-schema';
import { ActionValidator } from './schemas/action-schema';
import { AssetUploadSchema, ProductConditionValidator, QuestionValidator } from './schemas/product-schema';
import { transformUndefinedValues, validateProductNodeBranch } from './schemas/common';

type NodeType = {
    node_type: typeof product_node_types[number];
    data: any;
    branches: Array<{ node_id: string }>;
};

const validatorMap = {
    conditions: ProductConditionValidator,
    action: ActionValidator,
    yes_no_question: QuestionValidator,
    multiple_choice_question: QuestionValidator,
    asset_upload: AssetUploadSchema,
} as const;

function fetchValidatorForNodeType(nodeType: keyof typeof validatorMap) {
    const validator = validatorMap[nodeType];
    if (!validator) {
        throw new Error(`Unknown node type: ${nodeType}`);
    }
    return validator;
}

export const ProductPolicyValidator = z.record(
    z.string(),
    z.object({
        node_type: z.enum(product_node_types),
        branches: z.array(branch_schema),
        data: z.union([
            ProductConditionValidator,
            ActionValidator,
            QuestionValidator,
            AssetUploadSchema,
        ]),
    }).refine(validateProductNodeBranch)
)
.transform(transformUndefinedValues)
.refine((record) => {
    const nodeIds = new Set(Object.keys(record));

    for (const [nodeId, node] of Object.entries(record)) {
        const typedNode = node as NodeType;
        const dataValidator = fetchValidatorForNodeType(typedNode.node_type);
        
        const validationResult = dataValidator.safeParse(typedNode.data);
        if (!validationResult.success) {
            throw new Error(`Data validation failed for node ID "${nodeId}": ${validationResult.error}`);
        }

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

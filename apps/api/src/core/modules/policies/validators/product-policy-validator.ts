import { z } from 'zod';
import { product_node_types } from './constants';
import { BranchSchema as branch_schema } from './schemas/branch-schema';
import { ActionValidator } from './schemas/action-schema';
import { AssetUploadSchema, ProductConditionValidator, QuestionValidator } from './schemas/product-schema';
import { ProductNodeType, transformUndefinedValues, validatePolicyRecord, validateProductNodeBranch } from './schemas/common';

const validatorMap = {
    conditions: ProductConditionValidator,
    action: ActionValidator,
    yes_no_question: QuestionValidator,
    multiple_choice_question: QuestionValidator,
    asset_upload: AssetUploadSchema,
} as const;

function getValidatorForNodeType(nodeType: keyof typeof validatorMap) {
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
.refine((record: Record<string, ProductNodeType>) => validatePolicyRecord(record, getValidatorForNodeType), {
    message: "Invalid policy flow: one or more validations failed"
});

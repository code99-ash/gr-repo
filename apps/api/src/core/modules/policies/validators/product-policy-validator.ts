import { z } from 'zod';
import { product_node_types } from './constants';
import { BranchSchema as branch_schema } from './schemas/branch-schema';

import { ActionValidator } from './schemas/action-schema';
import { AssetUploadSchema, ProductConditionValidator, QuestionValidator } from './schemas/product-schema';
import { transformUndefinedValues, validateProductNodeBranch } from './schemas/common';

export const ProductPolicyValidator = z.record(
    z.object({
        node_type: z.enum(product_node_types),
        branches: z.array(branch_schema),
        data: z.union([
            ProductConditionValidator,
            ActionValidator,
            QuestionValidator,
            AssetUploadSchema,
        ])
    }).refine(validateProductNodeBranch)
).transform(transformUndefinedValues);
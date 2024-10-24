import { z } from 'zod';
import { node_types } from './constants';
import { CustomerConditionValidator } from './schemas/customer-schema';
import { ActionValidator } from './schemas/action-schema';
import { transformUndefinedValues, validateConditionBranch } from './schemas/common';
import { BranchSchema as branch_schema } from './schemas/branch-schema';


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

).transform(transformUndefinedValues);
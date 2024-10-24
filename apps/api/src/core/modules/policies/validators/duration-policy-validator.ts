import { z } from 'zod';
import { node_types } from './constants';
import { DurationConditionValidator } from './schemas/duration-schema';
import { BranchSchema as branch_schema } from './schemas/branch-schema';
import { transformUndefinedValues, validateConditionBranch } from './schemas/common';
import { ActionValidator } from './schemas/action-schema';

    
export const DurationPolicyValidator = z.record(
    z.object({
        node_type: z.enum(node_types),
        branches: z.array(branch_schema),
        data: z.union([
            DurationConditionValidator,
            ActionValidator
        ])
    }).refine(validateConditionBranch)
).transform(transformUndefinedValues);

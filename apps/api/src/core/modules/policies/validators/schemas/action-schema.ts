import { z } from 'zod';
import { action_types } from '../constants';

const BaseActionSchema = z.object({
    action_type: z.enum(action_types),
    message: z.string().optional(),
})

const refineActionSchema = (schema: z.ZodType<any, z.ZodTypeDef, any>) => schema.refine((data) => {
    const { action_type } = data;

    if (!action_type) {
        return false;
    }

    return true;
}, {
    message: 'Invalid action data',
});

export const ActionValidator = refineActionSchema(BaseActionSchema);
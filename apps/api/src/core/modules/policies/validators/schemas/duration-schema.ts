import { z } from 'zod';
import { periods } from '../constants';

const refineDurationConditionSchema = (schema: z.ZodType<any, z.ZodTypeDef, any>) => schema.refine((data) => {
    const { period, period_value } = data;

    if (!period || !period_value) {
        return false;
    }
    return true;
}, {
    message: 'Invalid duration condition data',
});

export const DurationConditionValidator = refineDurationConditionSchema(z.object({
    period: z.enum(periods),
    period_value: z.number(),
}));
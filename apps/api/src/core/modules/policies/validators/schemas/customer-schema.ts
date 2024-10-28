import { z } from 'zod';
import { condition_operators, periods } from '../constants';


const refineCustomerConditionSchema = (schema: z.ZodType<any, z.ZodTypeDef, any>) => schema.refine((data) => {
    const { expected_period, operator, period, period_value } = data;

    if (!expected_period || !operator || !period || !period_value) {
        return false;
    }
    return true;
}, {
    message: 'Invalid condition data',
});

export const CustomerConditionValidator = refineCustomerConditionSchema(z.object({
    expected_period: z.number(),
    operator: z.enum(condition_operators.customer),
    period: z.enum(periods),
    period_value: z.number(),
}));
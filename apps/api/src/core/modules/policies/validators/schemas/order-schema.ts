import { z } from 'zod';
import { condition_operators, order_category } from '../constants';

const refineOrderConditionSchema = (schema: z.ZodType<any, z.ZodTypeDef, any>) => schema.refine((data) => {
    const { category, operator, value } = data;

    if (!category || !operator || !value) {
        return false;
    }
    return true;
}, {
    message: 'Invalid order condition data',
}); 

export const OrderConditionValidator = refineOrderConditionSchema(z.object({
    category: z.enum(order_category),
    operator: z.enum(condition_operators.order),
    value: z.number(),
}));
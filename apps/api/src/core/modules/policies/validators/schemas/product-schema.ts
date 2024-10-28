import { z } from 'zod';

const refineProductConditionSchema = (schema: z.ZodType<any, z.ZodTypeDef, any>) => schema.refine((data) => {
    const { list, ruling } = data;

    if (!list || list.length === 0 || !ruling) {
        return false;
    }
    return true;
}, {
    message: 'Invalid product condition data',
});

const refineQuestionSchema = (schema: z.ZodType<any, z.ZodTypeDef, any>) => schema.refine((data) => {
    const { message } = data;

    if (!message) {
        return false;
    }
    return true;
});

export const ProductConditionValidator = refineProductConditionSchema(z.object({
    list: z.array(z.string()).min(1, { message: 'List must contain at least one item' }),
    ruling: z.enum(['any', 'all']),
}));

export const QuestionValidator = refineQuestionSchema(z.object({
    message: z.string().min(1, { message: 'Message is required' }),
}));

export const AssetUploadSchema = z.object({
    message: z.string().optional(),
});


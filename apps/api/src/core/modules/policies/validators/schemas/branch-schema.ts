import { z } from 'zod';

export const BranchSchema = z.object({
    node_id: z.any(),
    label: z.any().nullable(),
}).nullable()
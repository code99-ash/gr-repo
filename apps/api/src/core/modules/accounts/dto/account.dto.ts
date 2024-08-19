import { z } from 'zod';

export const ToggleActiveAccountState = z.object({
  uid: z.string(),
  is_active: z.boolean(),
});

import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { CreateAdminAccount } from '../schemas/account.schema';

export class CreateAdminAccountDto extends createZodDto(
  extendApi(CreateAdminAccount),
) {}

export const ToggleActiveAccountState = z.object({
  uid: z.string(),
  is_active: z.boolean(),
});

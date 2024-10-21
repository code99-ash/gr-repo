import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { DeletePolicy } from '../db/policy_histories.db';

export class DeletePolicyDto extends createZodDto(
  extendApi(DeletePolicy),
) {}

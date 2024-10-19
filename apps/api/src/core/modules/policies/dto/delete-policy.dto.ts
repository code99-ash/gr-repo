import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { DeletePolicy } from '../db/policies.db';

export class DeletePolicyDto extends createZodDto(
  extendApi(DeletePolicy),
) {}

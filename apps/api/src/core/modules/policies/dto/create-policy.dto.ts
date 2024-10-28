import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { CreatePolicy } from '../db/policies.db';

export class CreatePolicyDto extends createZodDto(
  extendApi(CreatePolicy),
) {}

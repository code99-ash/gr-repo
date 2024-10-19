import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { ActivatePolicy } from '../db/policies.db';

export class ActivatePolicyDto extends createZodDto(
  extendApi(ActivatePolicy),
) {}

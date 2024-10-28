import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { UpdatePolicyStatus } from '../db/policies.db';

export class UpdatePolicyStatusDto extends createZodDto(
  extendApi(UpdatePolicyStatus),
) {}

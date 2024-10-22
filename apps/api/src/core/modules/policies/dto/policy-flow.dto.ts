import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { PolicyFlowSchema } from '../db/policies.db';

export class PolicyFlowDto extends createZodDto(
  extendApi(PolicyFlowSchema),
) {}

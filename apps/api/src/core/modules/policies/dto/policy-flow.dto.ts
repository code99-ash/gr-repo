import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { PolicyHistory, PolicyFlowRecord } from '../db/policies.db';

export class PolicyHistoryDto extends createZodDto(
  extendApi(PolicyHistory),
) {}

export class PolicyFlowRecordDto extends createZodDto(
  extendApi(PolicyFlowRecord),
) {}

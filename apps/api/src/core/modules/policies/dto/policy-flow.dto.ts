import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { PolicyHistory, FlowRecord } from '../db/policies.db';

export class PolicyHistoryDto extends createZodDto(
  extendApi(PolicyHistory),
) {}

export class FlowRecordDto extends createZodDto(
  extendApi(FlowRecord),
) {}

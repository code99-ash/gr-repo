import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { PolicyHistory, FlowRecord, NodeRecord } from '../db/policy_histories.db';

export class PolicyHistoryDto extends createZodDto(
  extendApi(PolicyHistory),
) {}

export class FlowRecordDto extends createZodDto(
  extendApi(FlowRecord),
) {}

export class NodeRecordDto extends createZodDto(
  extendApi(NodeRecord)
) {}

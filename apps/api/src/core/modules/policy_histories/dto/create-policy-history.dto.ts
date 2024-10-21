import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { CreatePolicyHistory } from '../db/policy_histories.db';

export class CreatePolicyHistoryDto extends createZodDto(
  extendApi(CreatePolicyHistory),
) {}



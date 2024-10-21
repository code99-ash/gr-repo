import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { CreatePolicy, UnprocessedPolicyCreate } from '../db/policy_histories.db';

export class CreatePolicyDto extends createZodDto(
  extendApi(CreatePolicy),
) {}

export class UnprocessedPolicyCreateDto extends createZodDto(
  extendApi(UnprocessedPolicyCreate),
) {}

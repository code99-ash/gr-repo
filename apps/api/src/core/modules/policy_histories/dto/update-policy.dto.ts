import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { UpdatePolicy} from '../db/policy_histories.db';

export class UpdatePolicyDto extends createZodDto(
  extendApi(UpdatePolicy),
) {}

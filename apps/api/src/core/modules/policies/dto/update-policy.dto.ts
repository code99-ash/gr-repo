import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { UpdatePolicy} from '../db/policies.db';

export class UpdatePolicyDto extends createZodDto(
  extendApi(UpdatePolicy),
) {}

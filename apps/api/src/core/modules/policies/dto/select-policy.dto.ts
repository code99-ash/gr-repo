import { SelectPolicy } from '../db/policies.db';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

export class SelectPolicyDto extends createZodDto(
    extendApi(SelectPolicy)
) {}

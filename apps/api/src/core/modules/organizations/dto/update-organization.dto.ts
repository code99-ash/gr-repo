import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { UpdateOrganization } from '../db/organizations.db';

export class UpdateOrganizationDto extends createZodDto(
  extendApi(UpdateOrganization),
) {}

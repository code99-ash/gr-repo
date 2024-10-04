import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { CreateOrganization } from '../db/organizations.db';

export class CreateOrganizationDto extends createZodDto(
  extendApi(CreateOrganization),
) {}

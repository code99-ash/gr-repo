import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { CreateCollectionPolicy } from '../db/collection-policies.db';

export class CollectionPolicyDto extends createZodDto(extendApi(CreateCollectionPolicy)) {}
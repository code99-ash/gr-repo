import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { CreateStore } from '../db/stores.db';

export class CreateStoreDto extends createZodDto(extendApi(CreateStore)) {}

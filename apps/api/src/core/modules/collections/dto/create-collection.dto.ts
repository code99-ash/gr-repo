import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { ClientCollection, CreateCollection } from '../db/collections.db';
import { CreateCollectionProduct } from '../db/collections-products.db';

export class CreateCollectionDto extends createZodDto(extendApi(CreateCollection)) {}

export class ClientCollectionDto extends createZodDto(extendApi(ClientCollection)) {}

export class CreateCollectionProductDto extends createZodDto(extendApi(CreateCollectionProduct)) {}
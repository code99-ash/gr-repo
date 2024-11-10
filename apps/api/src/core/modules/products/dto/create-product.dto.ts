import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { CreateProduct } from '../db/products.db';

export class CreateProductDto extends createZodDto(extendApi(CreateProduct)) {}

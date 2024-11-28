import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { CreateProductPolicy } from '../db/products-policies.db';

export class ProductPolicyDto extends createZodDto(extendApi(CreateProductPolicy)) {}
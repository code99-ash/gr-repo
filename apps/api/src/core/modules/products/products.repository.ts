import { Inject, Injectable } from '@nestjs/common';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { products } from './db/products.db';
import { eq } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DB) private db: Database) {}

  async create(data: CreateProductDto[]) {
    return await this.db.insert(products).values(data)
  }

  async list(key: keyof typeof products._.columns, value: string | number) {
    return await this.db.query.products.findMany({
      where: eq(products[key], value)
    });
  }
}

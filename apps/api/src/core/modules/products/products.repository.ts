import { Inject, Injectable } from '@nestjs/common';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { products } from './db/products.db';
import { and, eq, inArray } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';
import { productsOnpolicies } from './db/products-policies.db';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DB) private db: Database) {}

  async create(data: CreateProductDto[]) {
    return await this.db.insert(products).values(data)
  }

  async list(config: any) {
    return await this.db.query.products.findMany(config);
  }

  async assignPolicy(product_id: string, payload: string[]) {
    return this.db.insert(productsOnpolicies).values(
      payload.map(policy_uid => ({product_id, policy_uid}))
    ).returning();
  }

  async unassignPolicy(product_id: string, payload: string[]) {
    return this.db.delete(productsOnpolicies)
          .where(and(
            eq(productsOnpolicies.product_id, product_id),
            inArray(productsOnpolicies.policy_uid, payload),
          ))
          .returning()
  }
}

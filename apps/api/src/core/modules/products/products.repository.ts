import { Inject, Injectable } from '@nestjs/common';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { products } from './db/products.db';
import { and, eq, inArray } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';
import { productsOnpolicies } from './db/products-policies.db';
import { ProductPolicyDto } from './dto/product-policy.dto';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DB) private db: Database) {}

  async list(config: any) {
    return await this.db.query.products.findMany(config);
  }

  async find(config: any) {
    return await this.db.query.products.findFirst(config);
  }

  async create(data: CreateProductDto[]) {
    return await this.db.insert(products).values(data)
  }

  async update(data: CreateProductDto, store_uid: string) {
    return await this.db.update(products)
                        .set(data)
                        .where(and(
                          eq(products.id, data.id),
                          eq(products.store_uid, store_uid),
                        )).returning()
  }

  async softDelete(product_id: any, store_uid: string) {
    return await this.db.update(products)
                        .set({deleted_at: new Date()})
                        .where(and(
                          eq(products.id, product_id),
                          eq(products.store_uid, store_uid)
                        )).returning({id: products.id})
  }

  async remove(product_id: any, store_uid: string) {
    return await this.db.delete(products)
                        .where(and(
                          eq(products.id, product_id),
                          eq(products.store_uid, store_uid)
                        )).returning({id: products.id})
  }

  async assignPolicy(product_id: string, payload: string[]) {
    return this.db.insert(productsOnpolicies).values(
      payload.map(policy_uid => ({product_id, policy_uid}))
    ).returning();
  }

  async assignManytoMany(payload: ProductPolicyDto[]) {
    return this.db.insert(productsOnpolicies)
                  .values(payload)
                  .onConflictDoNothing({
                    target: [productsOnpolicies.product_id, productsOnpolicies.policy_uid]
                  });
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

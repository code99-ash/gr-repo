import { Inject, Injectable } from '@nestjs/common';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { and, eq } from 'drizzle-orm';
import { collections } from './db/collections.db';
import { CreateCollectionDto, CreateCollectionProductDto } from './dto/create-collection.dto';
import { collectionOnProducts } from './db/collections-products.db';
import { collectionOnPolicies } from './db/collection-policies.db';
import { CollectionPolicyDto } from './dto/collection-policy.dto';

@Injectable()
export class CollectionsRepository {
  constructor(@Inject(DB) private db: Database) {}

  async find(key: keyof typeof collections._.columns, value: string) {
    const store = await this.db.query.collections.findFirst({
      where: eq(collections[key], value)
    });

    return store ?? null;
  }

  async list(key: 'store_uid'|'uid', value: string) {
    const data = await this.db.query.collections.findMany({
      where: eq(collections[key as keyof typeof collections._.columns], value),
      with: {
        collection_products: {
          with: {
            products: {
              columns: { 
                meta: false 
              }
            },
          }
        },
        collection_policies: {
          columns: {
            collection_id: false
          }
        }
      }
    })

    return data;
  }

  async createCollection(payload: CreateCollectionDto[]) {
    return await this.db.insert(collections).values(payload).returning();
  }

  async createCollectProductPairs(payload: CreateCollectionProductDto[]) {
    return await this.db.insert(collectionOnProducts).values(payload).returning();
  }

  async assignPolicy(payload: CollectionPolicyDto) {
    return this.db.insert(collectionOnPolicies).values(payload).returning();
  }

  async unassignPolicy(payload: CollectionPolicyDto) {
    return this.db.delete(collectionOnPolicies)
          .where(and(
            eq(collectionOnPolicies.collection_id, payload.collection_id),
            eq(collectionOnPolicies.policy_uid, payload.policy_uid),
          )).returning()
  }
  
}

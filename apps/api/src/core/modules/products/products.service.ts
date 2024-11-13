import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { BroadcastStoreCreated } from '../stores/store.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { STORE_CREATED } from '../stores/stores.service';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { products } from './db/products.db';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  async fetch(store_uid: string) {
    try {
      const response = await this.productsRepository.list({
        where: eq(products.store_uid, store_uid),
        columns: {
          meta: false,
        },
        with: {
          product_policies: {
            with: {
              policy: {
                columns: {
                  id: false,
                  policy_flow: false,
                  created_at: false,
                  updated_at: false,
                  deleted_at: false,
                  activated_at: false,
                  activated_by: false,
                }
              }
            }
          }
        }
      })

      return response;

    }catch(error) {
      throw new InternalServerErrorException('Unable to fetch products')
    } 
  }

  inArray(array: any[], prop: string, value: any) {
    return array.some(each => each[prop] === value)
  }

  @OnEvent(STORE_CREATED)
  async asyncFetch(payload: BroadcastStoreCreated) {
    const url = `https://${payload.store_name}/admin/api/2024-01/products.json`;
      try {
        const { data } = await axios.get(url, {
          headers: {
            'X-Shopify-Access-Token': payload.access_token
          }
        });
        
        this.create(data.products, payload.store_uid);

      } catch(error) {
          console.error('Error fetching products:', error);
          throw new InternalServerErrorException('Error fetching store products');
      }
  }

  async create(payload: any[], store_uid: string) {
    try {

      this.productsRepository.create(payload.map(each => ({
        ...each,
        store_uid,
        created_at: each.created_at? new Date(each.created_at) : new Date(),
        updated_at: each.updated_at? new Date(each.updated_at) : new Date(),
        meta: {
          variants: each.variants 
        }
      })));

    }catch(error) {
      console.log(error)
    }
  }

  async assignPolicy(product_id: string, payload: string[]) {
    return await this.productsRepository.assignPolicy(product_id, payload)
  }

  async unassignPolicy(product_id: string, payload: string[]) {
    return await this.productsRepository.unassignPolicy(product_id, payload)
  }

}

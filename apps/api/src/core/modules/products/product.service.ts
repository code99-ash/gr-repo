import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { BroadcastStoreCreated } from '../stores/store.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { STORE_CREATED } from '../stores/stores.service';
import axios from 'axios';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

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

}

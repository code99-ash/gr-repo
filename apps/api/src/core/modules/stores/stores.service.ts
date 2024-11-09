import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { CreateStoreDto } from './dto/create-store.dto';
import { env } from 'src/common/env/env.schema';
import axios from 'axios';
import * as crypto from 'crypto';
import { store_types } from './db/stores.db';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BroadcastStoreCreated } from './store.interface';

const STORE_CREATED = 'store.created'

@Injectable()
export class StoresService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly storesRepository: StoresRepository,
  ) {}


  encryptData(data: string): string {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc', 
      Buffer.from(env.ENCRYPTION_KEY),
      Buffer.from(env.ENCRYPTION_IV)
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }


  decryptData(data: string): string {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc', 
      Buffer.from(env.ENCRYPTION_KEY), 
      Buffer.from(env.ENCRYPTION_IV)
    );
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  sendStoreCreateEvent(data: BroadcastStoreCreated) {
    this.eventEmitter.emit(STORE_CREATED, {
      store_name: data.store_name,
      store_uid: data.store_uid,
      access_token: data.access_token,
      store_type: data.store_type
    })
  }

  async createStore(store: CreateStoreDto) {
    const data = await this.storesRepository.createStore(store);
    
    this.sendStoreCreateEvent({
      store_name: store.store_name,
      store_uid: data[0].uid,
      access_token: (store.api_key as { access_token?: string })?.access_token || '',
      store_type: store.store_type
    });

    return data;
  }

  async authorizeStore(store_type: store_types, store_domain: string) {
    const store = await this.storesRepository.findStore('store_name', store_domain);
    if(store) {
      throw new BadRequestException('Store already exists');
    }

    if(store_type === 'shopify') {
      return encodeURI(`https://${store_domain}/admin/oauth/authorize?client_id=${env.SHOPIFY_CLIENT_ID}&scope=${env.SHOPIFY_SCOPES}&redirect_uri=${env.SHOPIFY_REDIRECT_URL}`);
    }

    throw new BadRequestException('Invalid store type');
  }

  async authorizeCallback(store_domain: string, code: string) {
    try {
      console.log('store_domain', store_domain)

      const shopifyOAuthUri = `https://${store_domain}/admin/oauth/access_token?client_id=${env.SHOPIFY_CLIENT_ID}&client_secret=${env.SHOPIFY_CLIENT_SECRET}&code=${code}`;

      const { data } = await axios.post(shopifyOAuthUri);

      return data;

    } catch(error) {
      
      throw new InternalServerErrorException('Error authorizing store');
    }
  }
}

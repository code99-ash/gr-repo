import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { CollectionsRepository } from './collections.repository';
import { 
    ClientCollectionDto, 
    CreateCollectionDto, 
    CreateCollectionProductDto 
} from './dto/create-collection.dto';
import { BroadcastStoreCreated } from '../stores/store.interface';

@Injectable()
export class CollectionsService {

    constructor(
        private readonly collectionsRepository: CollectionsRepository,
    ) {}

    async fetch(store_uid: string) {
        return await this.collectionsRepository.list('store_uid', store_uid);
    }

    async asyncFetchCollection(payload: BroadcastStoreCreated) {
        const url = `https://${payload.store_name}/admin/api/2024-01/custom_collections.json`;
        
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'X-Shopify-Access-Token': payload.access_token
                    }
                }
            );
            
            const collections = data.custom_collections;

            this.smartCreateCollection(collections, payload.store_uid);

        } catch(error) {
            console.error('Error fetching store collections:', error);
            throw new InternalServerErrorException('Error fetching store collections');
        }
    }

    async asyncFetchCollect(payload: BroadcastStoreCreated) {
        const url = `https://${payload.store_name}/admin/api/2024-01/collects.json`;
        
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'X-Shopify-Access-Token': payload.access_token
                    }
                }
            );
            
            const collects = data.collects;

            this.createCollectionProduct(collects);

        } catch(error) {
            throw new InternalServerErrorException('Error fetching store collection-product pairs');
        }
    }

    async smartCreateCollection( payload: ClientCollectionDto[], store_uid: string) {
        const data = payload.map(each => ({ 
            ...each, 
            store_uid, 
            created_at: each.created_at? new Date(each.created_at) : new Date(),
            updated_at: each.updated_at? new Date(each.updated_at) : new Date() 
        }))
        return await this.createCollection(data);
    }

    async createCollection(payload: CreateCollectionDto[]) {
        return await this.collectionsRepository.createCollection(payload);
    }

    async createCollectionProduct(payload: CreateCollectionProductDto[]) {
        return await this.collectionsRepository.createCollectProductPairs(payload);
    }

}

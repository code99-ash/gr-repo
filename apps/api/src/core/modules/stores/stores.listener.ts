import { OnEvent } from "@nestjs/event-emitter";
import { STORE_CREATED } from "./stores.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { BroadcastStoreCreated } from "./store.interface";
import axios from "axios";
import { ProductsService } from "../products/products.service";
import { CollectionsService } from "../collections/collections.service";
import { env } from "src/common/env/env.schema";


interface WebhookReqData {
    topic: string, 
    address: string, 
    format: string
}

@Injectable()
export class StoresListener {

    constructor(
        private readonly productsService: ProductsService,
        private readonly collectionsService: CollectionsService,
    ){}

    async getWebhooks(store_domain: string, access_token: string) {
        const response = await axios.get(
            `https://${store_domain}/admin/api/2024-01/webhooks.json`,
            {
                headers: {
                    'X-Shopify-Access-Token': access_token,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.webhooks
    }

    async createWebhook(store_payload: BroadcastStoreCreated, webhook: WebhookReqData) {
        const response = await axios.post(
            `https://${store_payload.store_name}/admin/api/2024-01/webhooks.json`, 
            {
                webhook: {
                    topic: webhook.topic,
                    address: webhook.address,
                    format: webhook.format,
                },
            },
            {
                headers: {
                'X-Shopify-Access-Token': store_payload.access_token,
                'Content-Type': 'application/json',
                },
            }
        );

        return response.data
    }

    filterUnregistered(existing_topics: string[], to_register: WebhookReqData[]) {
        return to_register.filter((webhook: WebhookReqData) => (
            !existing_topics.includes(webhook.topic)
        ));
    }
    
    @OnEvent(STORE_CREATED)
    async registerShopifyWebhooks(payload: BroadcastStoreCreated) {
        
        const environment = process.env.NODE_ENV || 'development';
        const WEBHOOK_BASE_URL = environment === 'development'? env.WEBHOOK_BASE_URL : payload.request_host

        const base_url = `${WEBHOOK_BASE_URL}/api/v1`;

        const webhooks = [
            { 
                topic: 'products/create', 
                address: `${base_url}/products/created/${payload.store_uid}`, 
                format: 'json' 
            },
            { 
                topic: 'products/update', 
                address:`${base_url}/products/updated/${payload.store_uid}`, 
                format: 'json' 
            },
            { 
                topic: 'products/delete', 
                address: `${base_url}/products/deleted/${payload.store_uid}`,  
                format: 'json' 
            },
            { 
                topic: 'orders/create',   
                address: `${base_url}/orders/created/${payload.store_uid}`, 
                format: 'json' 
            },
            { 
                topic: 'orders/updated',  
                address:`${base_url}/orders/updated/${payload.store_uid}`,
                format: 'json' 
            }
        ];

        try {
            
            const existingWebhooks = await this.getWebhooks(payload.store_name, payload.access_token);

           
            const existingWebhookTopics = existingWebhooks.map(
                (webhook:WebhookReqData) => webhook.topic
            );
            
            const newWebhooks = this.filterUnregistered(existingWebhookTopics, webhooks)
           
            const responses = await Promise.all(newWebhooks.map(async (webhook) => {
                return await this.createWebhook(payload, webhook)
            }));

        
            console.log('Webhooks registered:', responses);
          } catch (error: any) {
            console.error('Error registering webhooks:', error.response.data);
          }
    }

    @OnEvent(STORE_CREATED)
    async syncStoreData(payload: BroadcastStoreCreated) {
        try {
            await this.collectionsService.asyncFetchCollection(payload)
            await this.productsService.asyncFetch(payload)
            await this.collectionsService.asyncFetchCollect(payload)
        }catch(err) {
            throw new InternalServerErrorException('Unable to complete data fetch')
        }
    }
}
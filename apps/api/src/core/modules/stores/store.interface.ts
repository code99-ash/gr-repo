import { store_types } from "./db/stores.db";

export interface BroadcastStoreCreated {
    store_name: string, 
    store_uid: string, 
    access_token: string,
    store_type: store_types,
    request_host?: string
}
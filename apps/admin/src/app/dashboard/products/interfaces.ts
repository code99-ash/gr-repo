export interface Product {
    id: string;
    uid: string;
    store_uid: string;
    title: string;
    status: string;
    images: any[];
    created_at: string;
    updated_at: string;
}

export interface CollectionProduct {
    collection_id: string;
    product_id: string;
    products: Product
}

export interface CollectionGroupItem {
    id: string;
    uid: string;
    store_uid: string;
    title: string;
    origin: "external" | "internal";
    meta?: any;
    created_at: string;
    updated_at: string;
    collection_products: CollectionProduct[]
}
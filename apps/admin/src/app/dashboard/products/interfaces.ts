import { PolicyStatus } from "@/store/policies/policy-form";

export interface ProductPolicy {
    policy_uid: string;
    product_id: string;
    policy: {
        uid: string;
        organization_uid: string | null;
        policy_name: string;
        policy_type: string;
        policy_status: PolicyStatus;
    }
}

export interface Product {
    id: string;
    uid: string;
    store_uid: string;
    title: string;
    status: string;
    images: {
        id: string;
        src: string;
    }[];
    product_policies: ProductPolicy[];
    created_at: string;
    updated_at: string;
}

export interface CollectionProduct {
    collection_id: string;
    product_id: string;
    product: Product
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
    collection_policies: { policy_uid: string }[]
}
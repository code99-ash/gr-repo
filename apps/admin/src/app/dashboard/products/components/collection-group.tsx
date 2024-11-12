"use client"

import React, { useState, createContext } from 'react'
import { CollectionGroupItem as ItemProp, ProductPolicy } from '../interfaces';
import { RadioGroup } from "@/components/ui/radio-group"
import CollectionGroupItem from './collection-item'
import { Card } from '@/components/ui/card'
import PageHeader from './page-header'

interface SelectedProp {
    selected: any,
    collections: ItemProp[],
    setSelected: (uid: any) => void;
    assignPolicy: (id: string, policy_uid: string) => void,
    unassignPolicy: (id: string, policy_uid: string) => void,
    updateProductPolicy: (
        collection_id: string, 
        product_id: string, 
        product_policies: ProductPolicy[]
    ) => void
}

export const SelectedCtx = createContext<SelectedProp>({
    selected: null, 
    collections: [],
    setSelected: () => {}, 
    assignPolicy: () => {},
    unassignPolicy: () => {},
    updateProductPolicy: () => {}
});

interface CollectionGroupProp {
    data: ItemProp[]
}

export default function CollectionGroup({ data }: CollectionGroupProp) {
    const [selected, setSelected] = useState<string|null>(null)
    const [collections, setCollections] = useState(data);

    const assignPolicy = (collection_id: string, policy_uid: string) => {

        setCollections((prevData: ItemProp[]) => {
            const data = prevData.map(each => each.id === collection_id? {
                ...each,
                collection_policies: [...each.collection_policies, {policy_uid}]
            } : each );
            return data;
        })
        
    }

    const unassignPolicy = (collection_id: string, policy_uid: string) => {

        setCollections((prevData: ItemProp[]) => {
            const data = prevData.map(each => each.id === collection_id? {
                ...each,
                collection_policies: each.collection_policies.filter(each => each.policy_uid !== policy_uid)
            } : each );

            return data;
        })
    }

    const updateProductPolicy = (collection_id: string, product_id: string, product_policies: ProductPolicy[]) => {
        setCollections((prev_collections) => {
            return prev_collections.map(collection => {
                if(collection.id === collection_id) {
                    collection.collection_products.map(collection_product => {
                        if(collection_product.product_id === product_id) {
                            const product = collection_product.product;
                            product.product_policies = product_policies
                        }
                        return collection_product
                    })
                }
                return collection
            })
        })
    }

    return (
        <SelectedCtx.Provider value={{
            selected, 
            setSelected, 
            collections, 
            assignPolicy, 
            unassignPolicy,
            updateProductPolicy
        }}>

            <section className='space-y-5'>
                <PageHeader />
                
                <Card className="rounded-xl shadow-none">
                    <RadioGroup onValueChange={(value) => setSelected(value)}>
                    {
                        collections.map((collection) => (
                            <CollectionGroupItem collection={collection} key={collection.id} />
                        ))
                    }
                    </RadioGroup>
                </Card>
            </section>
        </SelectedCtx.Provider>
    )
};


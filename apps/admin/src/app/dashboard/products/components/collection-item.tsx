"use client";

import React from 'react'
import { Table } from '@/components/ui/table';
import { CardContent, CardTitle } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { CollectionGroupItem as ItemProp } from '../interfaces';
import ProductItem from './product-item-v2';

export default function CollectionGroupItem({collection}: {collection: ItemProp}) {
    const policy_length = collection.collection_policies.length

    return (
        <CardContent className='py-3 px-0'>
            <div className='flex items-center gap-2 mb-2 px-3'>
                <RadioGroupItem value={collection.id} id={collection.uid} />
                <CardTitle className='text-primary satoshi-medium capitalize w-full flex gap-2 justify-between'>
                    {collection.title}
                    <span className='text-foreground text-xs md:text-sm'>
                        {policy_length? `${policy_length} Policies` :  `No Policy`}
                    </span>
                </CardTitle>
            </div>
            <Table className="w-full">
            {collection.collection_products.map((each, index) => (
                <ProductItem key={index} product={each.product} collection_id={collection.id} />
            ))}
            </Table>
        </CardContent>
    )
}

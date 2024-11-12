"use client";

import React, { useContext, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2Icon } from 'lucide-react';
import { Product, ProductPolicy } from '../interfaces';
import Image from 'next/image';
import PolicyAssignment from './products/policy-assignment';
import { SelectedCtx } from './collection-group';

export default function ProductItem({product, collection_id}: {product: Product, collection_id: string}) {
    const [policies, setPolicies] = useState(product.product_policies);
    const { updateProductPolicy } = useContext(SelectedCtx)

    const updatePolicies = (to_assign: string[], to_unassign: string[]) => {
        setPolicies((prev: ProductPolicy[]) => {

            const updated = prev.filter(each => !to_unassign.includes(each.policy_uid));

            const newPolicies = to_assign
                .filter(each => !prev.some(policy => policy.policy_uid === each))
                .map((each: string) => ({product_id: product.id, policy_uid: each}));
            
            
            updateProductPolicy(collection_id, product.id, [...updated, ...newPolicies])
            return [...updated, ...newPolicies];
        })

    }

  return (
    <Card className='p-2 border-0 border-b grid grid-cols-1 items-center md:grid-cols-5 gap-2 shadow-none rounded-none'>
        <CardContent className='p-0 px-6 col-span-5 md:col-span-3'>
            <div className='flex items-center gap-2'>
                <Checkbox />
                <Image 
                    src={product.images[0].src}
                    width={35}
                    height={35}
                    alt=""
                    className="rounded-full"
                />
                <h3 className='satoshi-medium'>
                    {product.title}
                </h3>
            </div>
        </CardContent>
        <CardContent className='p-0 px-6 col-span-5 md:col-span-2'>
            <div className='flex items-center justify-between gap-x-10'>
                <PolicyAssignment 
                    product_policies={policies} 
                    product_id={product.id}
                    updatePolicies={updatePolicies}
                />
                <Trash2Icon 
                    role='button'
                    width={18}
                    height={18}
                />
            </div>
        </CardContent>
    </Card>
  )
}

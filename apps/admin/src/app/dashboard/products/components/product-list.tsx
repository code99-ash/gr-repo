"use client";

import React, { createContext, useState } from 'react'
import { Product } from '../interfaces';
import ProductItem from './product-item';
import PageHeader from './page-header';
import { Card, CardContent } from '@/components/ui/card';
import './products.css'

interface SelectionCtx {
    selected_products: string[],
    selected_policies: string[],
    toggleProductSelection: (product_id: string) => void;
    togglePolicySelection: (policy_uid: string) => void;
}

export const SelectionContext = createContext<SelectionCtx>({
    selected_products: [],
    selected_policies: [],
    toggleProductSelection: () => {},
    togglePolicySelection: () => {},
})

export default function ProductList({data}: {data: Product[]}) {
    const [selected_products, setSelectedProducts] = useState<string[]>([]);
    const [selected_policies, setSelectedPolicies] = useState<string[]>([]);

    const toggleProductSelection = (product_id: string) => {

        const included = selected_products.includes(product_id);
        if(included) {
            setSelectedProducts(prev => {
                return prev.filter(id => id !== product_id);
            })
        }else {
            setSelectedProducts([...selected_products, product_id])
        }
    }

    const togglePolicySelection = (policy_uid: string) => {

        const included = selected_policies.includes(policy_uid);
        if(included) {
            setSelectedPolicies(prev => {
                return prev.filter(id => id !== policy_uid);
            })
        }else {
            setSelectedPolicies([...selected_policies, policy_uid])
        }
    }

    return (
        <SelectionContext.Provider value={{
            selected_products, 
            selected_policies, 
            toggleProductSelection,
            togglePolicySelection
        }}>
            <section className='px-0 md:px-6'>
                <PageHeader />

                <Card className="overflow-hidden rounded-md">
                    <Card className='product-item satoshi-medium'>
                        <CardContent className='p-0 px-6 col-span-4'>
                            Product
                        </CardContent>
                        <CardContent className='p-0 px-6 col-span-2'>
                            Policies
                        </CardContent>
                    </Card>
                    {data.map(product => (
                        <ProductItem 
                            key={product.id} 
                            product={product}
                        />
                    ))}
                </Card>
            </section>
        </SelectionContext.Provider>
    )
}

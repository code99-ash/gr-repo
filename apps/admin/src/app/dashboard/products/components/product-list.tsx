"use client";

import React from 'react'
import { Product } from '../interfaces';
import ProductItem from './product-item';
import PageHeader from './page-header';
import { Card, CardContent } from '@/components/ui/card';
import './products.css'

export default function ProductList({data}: {data: Product[]}) {
  return (
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
            {data.map(product => <ProductItem key={product.id} product={product} />)}
        </Card>
    </section>
  )
}

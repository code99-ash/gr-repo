"use client";

import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2Icon } from 'lucide-react';
import { Product } from '../interfaces';
import Image from 'next/image';

export default function ProductItem({product}: {product: Product}) {
    
    return <>
        <Card className='product-item'>
            <CardContent className='p-0 md:px-6 col-span-4'>
                <div className='flex items-center gap-3'>
                    <Checkbox />
                    {
                        product?.images[0] ?
                        <Image 
                            src={product.images[0].src}
                            width={35}
                            height={35}
                            alt=""
                            className="rounded-full"
                        /> :
                        <div className='placeholder-img'></div>
                    }
                    <h3 className='satoshi-medium text-sm md:text-base'>
                        {product.title}
                    </h3>
                </div>
            </CardContent>
            <CardContent className='p-0 px-6 col-span-2'>
                <div className='flex items-center justify-between gap-x-10'>
                    {product.product_policies.length}
                    <Trash2Icon 
                        role='button'
                        width={18}
                        height={18}
                    />
                </div>
            </CardContent>
        </Card>
    </>
}

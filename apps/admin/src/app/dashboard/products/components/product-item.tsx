"use client";

import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2Icon } from 'lucide-react';
import { Product } from '../interfaces';
import Image from 'next/image';

export default function ProductItem({product}: {product: Product}) {
  return (
    <Card className='p-2 border-b grid grid-cols-1 items-center md:grid-cols-5 gap-2 shadow-none rounded-none'>
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
                <h3 className='satoshi-medium'>{product.title}</h3>
            </div>
        </CardContent>
        <CardContent className='p-0 px-6 col-span-5 md:col-span-2'>
            <div className='flex items-center justify-between gap-x-10'>
                <span>0 Policies</span>
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

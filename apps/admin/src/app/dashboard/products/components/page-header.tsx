"use client";
import React from 'react'
import { Button } from '@/components/ui/button';
import AssignToManyProducts from './products/many/assign-many';


export default function PageHeader() {
    
    return (
        <header className="flex items-center justify-between gap-2 md:px-3 pb-3 border-b border-neutral-200">
            <h1 className="text-foreground text-xl md:text-2xl satoshi-bold">
                Product Catalog
            </h1>

            <div className='flex items-center gap-x-3'>
                <Button variant="outline" className="border border-primary text-primary bg-transparent">
                    Update Products
                </Button>

                <AssignToManyProducts />
                
            </div>
        </header>
  )
}
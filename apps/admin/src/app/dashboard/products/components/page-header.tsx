"use client";
import React, { useContext } from 'react'
import { SelectedCtx } from './collection-group';
import AssignPolicyTrigger from './collections/assign-policy-trigger'
import UnassignPolicyTrigger from './collections/unassign-policy-trigger';
import { Button } from '@/components/ui/button';



export default function PageHeader() {
    const { selected } = useContext(SelectedCtx)
    
    return (
        <header className="flex items-center justify-between gap-2 md:px-3 pb-3 border-b border-neutral-200">
            <h1 className="text-foreground text-xl md:text-2xl satoshi-bold">
                Product Catalog
            </h1>

            <div className='flex items-center gap-x-3'>
                <Button variant="outline" className="border border-primary text-primary bg-transparent">
                    Update Products
                </Button>
                <Button className="bg-[#333] opacity-50 text-white">
                    Assign Policy
                </Button>
            </div>

            {selected && (
                <div className="flex items-center gap-2 satoshi-medium">
                    <AssignPolicyTrigger />
                    <UnassignPolicyTrigger />
                </div>
            )}
        </header>
  )
}
"use client";
import React, { useContext } from 'react'
import { SelectedCtx } from './collection-group';
import AssignPolicyTrigger from './assign-policy-trigger'
import UnassignPolicyTrigger from './unassign-policy-trigger';



export default function PageHeader() {
    const { selected } = useContext(SelectedCtx)
    
    return (
        <header className="flex items-center justify-between gap-2 md:px-3 pb-3 border-b border-neutral-200">
            <h1 className="text-foreground text-xl md:text-2xl satoshi-bold">
                Product Catalogue
            </h1>

            {selected && (
                <div className="flex items-center gap-2 satoshi-medium">
                    <AssignPolicyTrigger />
                    <UnassignPolicyTrigger />
                </div>
            )}
        </header>
  )
}
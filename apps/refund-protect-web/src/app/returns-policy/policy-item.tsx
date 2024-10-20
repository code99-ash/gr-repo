'use client';
import { PolicyListType } from '@/store/policies/policy-store';
import React, { useMemo } from 'react'

function formatDate(timestamp: string) {
    const date = new Date(timestamp);
  
    const options: {[key: string]: string} = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
  
    return date.toLocaleDateString('en-US', options).replace(',', '.');
}

export default function PolicyItem({policy}: {policy: PolicyListType}) {
    // const variantBorder = policy.status === 'draft'? "border-[#2A9E69]" : "border-[#FDB747]"
    // const variantText = policy.status === 'draft'? "text-[#2A9E69]" : "text-[#FDB747]"

    const date = useMemo(() => formatDate(policy.updated_at), [policy])

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-1 bg-card p-3 rounded shadow-sm hover:border hover:border-border'>
            <section className='space-y-2'>
                <h1 className="text-primary satoshi-medium">{policy.policy_name}</h1>
                <p className="text-foreground text-xs uppercase">{policy.policy_type}</p>
            </section>
            <section className="grid grid-cols-5 gap-3">
                <div className="flex items-center justify-between col-span-2">
                    <button className="px-4 py-2 text-foreground bg-accent text-sm rounded">0 items</button>
                    <button 
                        className={`px-4 py-2 capitalize bg-accent text-foreground text-sm rounded`}
                    >{policy.status}</button>
                </div>
                <div className="flex items-center justify-between col-span-3">
                    <button className="px-4 py-2 text-foreground text-sm rounded">
                        {date}
                    </button>
                    <button className="px-4 py-2 text-sm text-foreground bg-accent text-sm rounded group">
                        <span className="material-symbols-outlined group-hover:text-destructive">delete</span>
                    </button>
                </div>
            </section>
        </div>
    )
}

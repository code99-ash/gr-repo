'use client';
import { PolicyListType } from '@/store/policies/policy-store';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import { formatDate } from '@/lib/utils'
import ConfirmDelete from './confirm-delete';


export default function PolicyItem({policy}: {policy: PolicyListType}) {
    const router = useRouter()
    
    const variantText = policy.policy_status === 'draft'? "text-[#2A9E69]" : "text-[#FDB747]"

    const date = useMemo(() => formatDate(policy.updated_at), [policy])

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-1 bg-card p-3 rounded shadow-sm hover:border hover:border-border group'>
            <section className='space-y-2'>
                <h1 
                    className="text-primary satoshi-medium group-hover:underline cursor-pointer w-max"
                    onClick={() => router.push(`/dashboard/returns-policy/build/${policy.policy_type}/${policy.uid}`)}
                >{policy.policy_name}</h1>
                <p className="text-foreground text-xs uppercase">{policy.policy_type}</p>
            </section>
            <section className="grid grid-cols-5 gap-3">
                <div className="flex items-center justify-around col-span-2">
                    <button className="px-4 py-2 text-foreground bg-accent text-sm rounded">0 items</button>
                    <button 
                        className={`px-4 py-2 capitalize bg-accent text-sm rounded mx-auto ${variantText}`}
                    >{policy.policy_status}</button>
                </div>
                <div className="flex items-center justify-between col-span-3">
                    <button className="px-4 py-2 text-foreground text-sm rounded">
                        {date}
                    </button>
                    <ConfirmDelete policy_name={policy.policy_name} policy_id={policy.uid} />
                    {/* <button className="px-4 py-2 text-sm text-foreground bg-accent text-sm rounded group">
                        <span className="material-symbols-outlined group-hover:text-destructive">delete</span>
                    </button> */}
                </div>
            </section>
        </div>
    )
}

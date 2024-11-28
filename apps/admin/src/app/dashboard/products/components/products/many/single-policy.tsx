"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { PolicyListType } from '@/store/policies/policy-store';
import React, { useContext } from 'react'
import { SelectionContext } from '../../product-list';

interface ItemProp {
    policy: PolicyListType
}

export default function SinglePolicy({ policy }: ItemProp) {
    const { selected_policies, togglePolicySelection } = useContext(SelectionContext)
    
    const selected = selected_policies.includes(policy.uid);


    return (
        <div className='flex items-center gap-2 p-2'>
            <Checkbox
                id={policy.uid} 
                checked={selected}
                onCheckedChange={() => togglePolicySelection(policy.uid)}
            />
            <label htmlFor={policy.uid} className='text-sm'>
                {policy.policy_name}    
            </label>
        </div>
    )
}

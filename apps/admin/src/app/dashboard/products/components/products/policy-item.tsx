"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { PolicyListType } from '@/store/policies/policy-store';
import React, { useState } from 'react'

interface ItemProp {
    policy: PolicyListType
    to_assign: string[];
    to_unassign: string[];
    initialCheck?: (policy_uid: string) => boolean;
    addToAssign: (policy_uid: string) => void;
    addToUnassign: (policy_uid: string) => void;
    removeFromAssign: (policy_uid: string) => void;
    removeFromUnassign: (policy_uid: string) => void;
}

export default function PolicyItem({
    policy, 
    initialCheck,
    to_assign, 
    to_unassign,
    addToAssign,
    addToUnassign,
    removeFromAssign,
    removeFromUnassign
}: ItemProp) {
    
    const was_assigned = initialCheck ? initialCheck(policy.uid) : false;

    const [checked, setChecked] = useState(was_assigned);


    const handleChange = (is_checked: boolean) => {

        setChecked(is_checked);

        if(is_checked) {

            if(!was_assigned && !to_assign.includes(policy.uid)) {
                addToAssign(policy.uid)
            }

            if(to_unassign.includes(policy.uid)) {
                removeFromUnassign(policy.uid)
            }
        }

        if(!is_checked) {
            if(to_assign.includes(policy.uid)) {
                removeFromAssign(policy.uid)
            }

            if(was_assigned && !to_unassign.includes(policy.uid)) {
                addToUnassign(policy.uid)
            }
        }
   
    }


    return (
        <div className='flex items-center gap-2 p-2'>
            <Checkbox
                id={policy.uid} 
                checked={checked}
                onCheckedChange={handleChange}
            />
            <label htmlFor={policy.uid} className='text-sm'>
                {policy.policy_name}    
            </label>
        </div>
    )
}

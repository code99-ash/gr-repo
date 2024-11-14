'use-client'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { usePolicyForm } from '@/store/policies/policy-form';
import { useSearchParams } from 'next/navigation';
import { usePolicyStore } from '@/store/policies/policy-store';

export default function EdittableTitle() {
    const policy_name = usePolicyForm(state => state.policy_name)
    const policies = usePolicyStore(state => state.policies)
    const setPolicyName = usePolicyForm(state => state.setPolicyName)
    const [name, setName] = useState(policy_name)
    const [edit, setEdit] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchParams = useSearchParams()


    // Focus on the input when editing starts
    useEffect(() => {
        if (edit && inputRef.current) {
            inputRef.current.focus()
        } else if (!edit && inputRef.current) {
            inputRef.current.blur()
        }
    }, [edit])

    // Update the name in the global store when it's valid and non-empty
    useEffect(() => {
        setPolicyName(name)
    }, [name])

    const handleBlur = () => {
        // If user kept the input empty, return back to initial name
        if(name.trim()) {
            setEdit(false)
        }

    }


    // Modify
    const policyUID = searchParams?.get('uid');
    
    useEffect(() => {
        if(!policyUID) return;

        const policy = policies.find(each => each.uid === policyUID);

        if(!policy) return;

        // Set policy title
        setName(policy.policy_name)


    }, [policyUID])

    return (
        <div className="flex items-center gap-1">
            {
                edit ? (
                    <Input 
                        className={`w-full h-full py-2 pr-1 text-base satoshi-bold text-foreground ${!name.trim()? 'border-destructive':'border-border'}`} 
                        onChange={(e) => setName(e.target.value)} 
                        value={name}
                        ref={inputRef}
                        onBlur={handleBlur}
                    />
                ) : (
                    <h1 className='text-lg satoshi-bold text-foreground'>{policy_name}</h1>
                )
            }
            
            {
                !edit && (
                    <span
                        className="material-symbols-outlined text-primary"
                        role='button' style={{ fontSize: '18px' }}
                        onClick={() => setEdit(true)}
                    >edit_square</span>
                )
            }

            {
                !name.trim() && <span 
                    className="material-symbols-outlined bg-destructive report rounded-full"
                >report</span>
            }
        </div>
    )
}

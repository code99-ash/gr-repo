'use client';
import React, { useContext, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { SelectionCtx } from '../page';
import useResponse from '@/hooks/use-response';
import { usePolicyStore, PolicyStatus } from '@/store/policies/policy-store';


interface Option {
    label: string;
    value: PolicyStatus;
}

const options: Option[] = [
    {
        label: 'Draft',
        value: 'draft'
    },
    {
        label: 'Active',
        value: 'active'
    },
    {
        label: 'Published',
        value: 'published'
    },
];

export default function ChangePolicyStatus() {
    const {selected, policies} = useContext(SelectionCtx)
    const [loading, setLoading] = useState(false)
    const { errorResponse, defaultResponse } = useResponse()
    const updateStatus = usePolicyStore(state => state.updateStatus);

    const [currentStatus, setCurrentStatus] = useState('Change')

    useEffect(() => {
        const policy = policies.find(each => each.uid === selected);
        setCurrentStatus(policy?.policy_status || 'Change')
    }, [selected, policies])

    const switchStatus = async(policy_status: 'draft' | 'active' | 'published') => {
        try {
            setLoading(true)
            
            const response = await fetch('/api/policies/change-status', {
                method: 'POST',
                body: JSON.stringify({policy_status, policy_uid: selected})
            })
            if(!response.ok) {
                const data = await response.json()
                return errorResponse({description: data.message}, true)
            }
            await response.json();
            updateStatus({uid: selected, status: policy_status});

            defaultResponse({description: 'Successfully updated status'})

        }catch(error: any) {
            errorResponse({description: error.data}, true)
        }finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger disabled={loading}>
                <Button 
                    variant="outline" disabled={loading}
                    className="w-[120px] capitalize hover:bg-white hover:text-primary border-primary text-foreground"
                >
                    {currentStatus} Status { loading && <LoaderCircle width={15} height={15} className="animate-spin ml-1 text-foreground" /> }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className='bg-white w-[120px] border shadow-xl'>
                    {options.map(option => (
                        <DropdownMenuItem className="hover:bg-primary p-0">
                            <Button 
                                onClick={() => switchStatus(option.value)}
                                className='bg-white text-foreground shadow-none px-3 rounded-none w-full flex items-center justify-between hover:bg-primary hover:text-white'
                            >
                                {option.label}
                            </Button>
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

"use client";

import React, { useContext, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button';
import { PolicyListType } from '@/store/policies/policy-store';
import { SelectedCtx } from './collection-group';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import useResponse from '@/hooks/use-response';
import { LoaderCircle } from 'lucide-react';

export default function AssignPolicyTrigger() {
    const { errorResponse } = useResponse()
    const {selected, collections, assignPolicy} = useContext(SelectedCtx)
    const [chosen, setChosen] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    const [policies, setPolicies] = useState<{policy_uid: string}[]>([]);

    const [filtered, setFiltered] = useState<PolicyListType[]>([])

    useEffect(() => {
        if(!open) return;
        
        fetchFilteredPolicies()

    }, [open])

    useEffect(() => {

        const collection = collections.find(each => each.id === selected);
        setPolicies(collection?.collection_policies || []);

    }, [collections])

    const openDialog = (cmd: any) => {
        setOpen(cmd)
    }

    const fetchFilteredPolicies = async() => {
        try {
            if(!selected) return;

            setLoading(true)
            const response = await fetch('/api/policies/not-in-array', {
                cache: 'no-store',
                method: 'POST',
                body: JSON.stringify(policies.map(each => each.policy_uid))
            })

            if(!response.ok) {
                return errorResponse({description: 'Unable to fetch policies'})
            }

            const data = await response.json()

            setFiltered(data)

        }catch(error) {
            errorResponse({description: 'Unable to fetch policies'})
        }finally {
            setLoading(false)
        }
    }

    const assign2Collection = async() => {
        try {
            if(!chosen) return;

            setLoading(true)
            const response = await fetch('/api/collection/assign-policy', {
                method: 'PUT',
                body: JSON.stringify({
                    collection_id: selected,
                    policy_uid: chosen
                })
            })

            await response.json()
            assignPolicy(selected, chosen)

            setOpen(false)

        }catch(error) {
            errorResponse({description: 'Failed to assign policy'})
        }finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={openDialog}>
            <DialogTrigger asChild>
                <Button 
                    className="bg-primary hover:bg-primary hover:saturate-50 text-white"
                    onClick={() => setOpen(true)}
                >
                    Assign Policy
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign policy</DialogTitle>
                    <DialogDescription>These are policies that are yet to be assigned to your selection</DialogDescription>
                </DialogHeader>

                {
                    loading? (
                        <div className='flex items-center justify-center'>
                            <LoaderCircle width={50} height={50} className='text-primary animate-spin' />
                        </div>
                    ) : (
                        <RadioGroup defaultValue={chosen} onValueChange={(value) => setChosen(value)}>
                            {
                                filtered.map(policy => (
                                    <Card key={policy.uid} className='shadow-none rounded-md cursor-pointer'>
                                        <div className='flex gap-2 p-2 items-center'>
                                            <RadioGroupItem value={policy.uid} id={policy.uid} />
                                            <h1 className={`text-sm ${chosen===policy.uid}?'text-primary':'text-foregound'`}>
                                                {policy.policy_name}
                                            </h1>
                                        </div>
                                    </Card>
                                ))
                            }
                        </RadioGroup>
                    )
                }

                <DialogFooter>
                    <Button 
                        type="submit" disabled={loading}
                        className='hover:bg-primary hover:saturate-50'
                        onClick={assign2Collection}
                    >
                        Assign {loading && <LoaderCircle width={15} height={15} className='ml-1 animate-spin' />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

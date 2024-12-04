"use client";

import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import useResponse from '@/hooks/use-response';
import { LoaderCircle } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { PolicyListType } from '@/store/policies/policy-store';
import SinglePolicy from './single-policy';
import { SelectionContext } from '../../product-list';

export default function AssignToManyProducts() {
    const { selected_products, selected_policies } = useContext(SelectionContext)
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [policies, setPolicies] = useState<PolicyListType[]>([]);
    const { errorResponse } = useResponse();

    const fetchAllPolicies = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/policies/fetch');
            if (!response.ok) {
                errorResponse({ description: 'Error fetching policies' });
                return;
            }
            const data = await response.json();
            setPolicies(data.filter((each: PolicyListType) => each.policy_status !== "draft"));
        } catch (error) {
            errorResponse({ description: 'Error fetching policies' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchAllPolicies();
        }
    }, [open, fetchAllPolicies]);

   

    const assignPolicies = async() => {
        try {
            if(!selected_policies.length || !selected_products.length) return;

            setLoading(true);

            const response = await fetch('/api/products/assign-policies', {
                method: 'POST',
                body: JSON.stringify({
                    policy_uids: selected_policies,
                    product_ids: selected_products
                })
            })

            const data = await response.json();
            if(!response.ok) {
                return errorResponse({description: data.message}, true);
            }

            window.location.reload()

        }catch(error: any) {
            errorResponse({description: "Error assigning policies"}, true);
        }finally {
            setLoading(false);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    className={`text-white ${selected_products.length? 'bg-primary hover:bg-primary':'bg-[#333] opacity-50'}`}
                >
                    Assign Policy
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Policies</DialogTitle>
                    <DialogDescription>Check to manage policy assignment to selected products</DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className='flex items-center justify-center'>
                        <LoaderCircle width={50} height={50} className='text-primary animate-spin' />
                    </div>
                ) : (
                    <div>
                        {policies.length > 0 ? (
                            policies.map(policy => (
                                <SinglePolicy key={policy.uid} policy={policy} />
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground">No policies available</p>
                        )}
                    </div>
                )}

                <DialogFooter>
                    
                    <Button 
                        type="button"
                        disabled={loading}
                        onClick={assignPolicies}
                        className='hover:bg-primary hover:saturate-50'
                    >
                        Update Assignment 
                        {loading && <LoaderCircle width={15} height={15} className='ml-1 animate-spin' />}
                    </Button>
                    
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

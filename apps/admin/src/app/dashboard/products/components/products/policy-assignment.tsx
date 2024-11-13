"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import React, { useEffect, useState } from 'react'
import { PolicyListType } from '@/store/policies/policy-store';
import { ProductPolicy } from '../../interfaces';
import PolicyItem from './policy-item';

interface PropType {
    product_policies: ProductPolicy[],
    product_id: string,
    updatePolicies: (to_assign: string[], to_unassign: string[]) => void;
    button?: React.ReactNode
}

export default function PolicyAssignment({ 
    product_policies, 
    product_id, 
    updatePolicies, 
    button 
}: PropType) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [policies, setPolicies] = useState<PolicyListType[]>([]);
    const { errorResponse } = useResponse();

    const [to_assign, setToAssign] = useState<string[]>([]);
    const [to_unassign, setToUnAssign] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            fetchAllPolicies();
        }
    }, [open]);

    const fetchAllPolicies = async () => {
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
    };

    const initialCheck = (policy_uid: string): boolean => {
        return product_policies.some(each => each.policy_uid === policy_uid);
    }

    const addToAssign = (policy_uid: string) => {
        setToAssign([...to_assign, policy_uid]);
    }

    const addToUnassign = (policy_uid: string) => {
        setToUnAssign([...to_unassign, policy_uid]);
    }

    const removeFromAssign = (policy_uid: string) => {
        setToAssign((prev) => {
            return prev.filter(uid => uid !== policy_uid)
        })
    }
    const removeFromUnassign = (policy_uid: string) => {
        setToUnAssign((prev) => {
            return prev.filter(uid => uid !== policy_uid)
        })
    }

    

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/products/assign-policy?product_id=${product_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to_assign, to_unassign })
            });
            if (!response.ok) {
                errorResponse({ description: 'Failed to update policy assignments' });
                return;
            }
            
            setOpen(false);
            updatePolicies(to_assign, to_unassign);

            setToAssign([])
            setToUnAssign([])


        } catch (error) {
            errorResponse({ description: 'Failed to update policy assignments' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    button ?? 
                    <Button 
                        variant="ghost"
                        className="text-primary"
                        onClick={() => setOpen(true)}
                    >
                        {product_policies.length} Policies
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Policies</DialogTitle>
                    <DialogDescription>Check to manage policy assignment to product</DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className='flex items-center justify-center'>
                        <LoaderCircle width={50} height={50} className='text-primary animate-spin' />
                    </div>
                ) : (
                    <div>
                        {policies.length > 0 ? (
                            policies.map(policy => (
                                <PolicyItem
                                    key={policy.uid}
                                    policy={policy}
                                    initialCheck={initialCheck}
                                    to_assign={to_assign}
                                    to_unassign={to_unassign}
                                    addToAssign={addToAssign}
                                    addToUnassign={addToUnassign}
                                    removeFromAssign={removeFromAssign}
                                    removeFromUnassign={removeFromUnassign}
                                />
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground">No policies available</p>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={loading}
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

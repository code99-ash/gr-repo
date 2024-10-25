'use client';
import React, { useEffect, useState } from 'react';
import { usePolicyStore } from '@/store/policies/policy-store';
import EmptyData from './empty-data';
import PolicyList from './policy-list';
import PageHeader from './page-header';
import axiosInstance from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export default function ReturnPolicy() {
    const { toast } = useToast()
    const setPolicies = usePolicyStore(state => state.setPolicies)
    const policies = usePolicyStore(state => state.policies)
    const fetched = usePolicyStore(state => state.fetched)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(fetched) return;

        fetchPolicies()
    }, [fetched])

    const fetchPolicies = async() => {
        try {
            setLoading(true)
            const resp = await axiosInstance.get('/policies')
            // console.log(resp)
            setPolicies(resp.data);

            toast({
                title: "Success Alert",
                description: "Successfully fetched policies",
            })
            
        }catch(err: any) {
            toast({
                variant: "destructive",
                title: "An error occured",
                description: err?.response.data ?? 'An error occured, please try again',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="space-y-5">
            <PageHeader />

            <main>
                {policies.length < 1? <EmptyData /> : <PolicyList policies={policies} />}
            </main>
        </section>
    );
}

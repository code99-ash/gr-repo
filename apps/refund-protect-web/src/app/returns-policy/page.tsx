'use client';
import React, { useEffect, useState } from 'react';
import { usePolicyStore } from '@/store/policies/policy-store';
import EmptyData from './empty-data';
import PolicyList from './policy-list';
import PageHeader from './page-header';
import axiosInstance from '@/lib/axios';

interface AwaitResponse {
    loading: boolean;
    error: any;
}

export default function ReturnPolicy() {
    const setPolicies = usePolicyStore(state => state.setPolicies)
    const policies = usePolicyStore(state => state.policies)
    const fetched = usePolicyStore(state => state.fetched)

    const [response, setResponse] = useState<AwaitResponse>({
        loading: false,
        error: null
    })

    useEffect(() => {
        if(fetched) return;

        fetchPolicies()
    }, [fetched])

    const fetchPolicies = async() => {
        try {
            setResponse(prev => ({...prev, loading: true}))
            const resp = await axiosInstance.get('/policies')
            console.log(resp)
            setPolicies(resp.data);
    
        }catch(err) {
            setResponse(prev => ({...prev, error: err}))
        } finally {
            setResponse(prev => ({...prev, loading: false}))
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

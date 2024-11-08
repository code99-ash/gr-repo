'use client';
import React, { useEffect, useState } from 'react';
import { usePolicyStore } from '@/store/policies/policy-store';
import EmptyData from './components/empty-data';
import PolicyList from './components/policy-list';
import PageHeader from './components/page-header';

export default function ReturnPolicy() {
    const [loading, setLoading] = useState(false)
    const policies = usePolicyStore(state => state.policies)
    const fetched = usePolicyStore(state => state.fetched)
    const setPolicies = usePolicyStore(state => state.setPolicies);

    const fetchPolicies = async() => {
        try {
            setLoading(true)
            const response = await fetch(`/api/policies/fetch`);
            
            if(!response.ok) {
                console.warn('Unable to fetch policy list');
                return;
            }

            const data = await response.json();
            console.log('policices', data);

            setPolicies(data)

        }catch(err) {
            console.log(err)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(fetched) return;

        fetchPolicies();
    }, [fetched])


    return (
        <section className="space-y-5">
            <PageHeader />

            <main>
                {policies.length < 1? <EmptyData /> : <PolicyList policies={policies} />}
            </main>
        </section>
    );
}

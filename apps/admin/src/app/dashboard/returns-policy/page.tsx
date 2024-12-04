'use client';
import React, { useEffect, useState } from 'react';
import { usePolicyStore } from '@/store/policies/policy-store';
import EmptyData from './components/empty-data';
import PolicyList from './components/policy-list';
import PageHeader from './components/page-header';
import useResponse from '@/hooks/use-response';
import { SelectionCtx } from '@/contexts/policy-selection-context';



export default function ReturnPolicy() {
    const [loading, setLoading] = useState(false)
    const policies = usePolicyStore(state => state.policies)
    const fetched = usePolicyStore(state => state.fetched)
    const setPolicies = usePolicyStore(state => state.setPolicies);
    const { errorResponse } = useResponse()

    const [selected, setSelected] = useState(null);

    const fetchPolicies = React.useCallback(async() => {
        try {
            setLoading(true)
            const response = await fetch(`/api/policies/fetch`);
            
            if(!response.ok) {
                return;
            }

            const data = await response.json();

            setPolicies(data)

        }catch(err: any) {
            errorResponse({description: err.data ?? 'An error occured, please try again'})
        }finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if(fetched) return;

        fetchPolicies();
    }, [fetched, fetchPolicies])


    return (
        <SelectionCtx.Provider value={{selected, policies}}>
            <section className="space-y-5">

                <PageHeader />

                <main>
                    {policies.length < 1? <EmptyData /> : <PolicyList policies={policies} setSelected={setSelected} />}
                </main>
            </section>
        </SelectionCtx.Provider>
    );
}

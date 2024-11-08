'use client';
import React from 'react';
import { usePolicyStore } from '@/store/policies/policy-store';
import EmptyData from './components/empty-data';
import PolicyList from './components/policy-list';
import PageHeader from './components/page-header';

export default function ReturnPolicy() {
    const policies = usePolicyStore(state => state.policies)


    return (
        <section className="space-y-5">
            <PageHeader />

            <main>
                {policies.length < 1? <EmptyData /> : <PolicyList policies={policies} />}
            </main>
        </section>
    );
}

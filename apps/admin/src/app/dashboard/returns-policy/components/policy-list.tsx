import React from 'react'
import PolicyItem from './policy-item'
import { PolicyListType } from '@/store/policies/policy-store';

export default function PolicyList({policies}: {policies: PolicyListType[]}) {
  return <section className='space-y-3'>
    {
      policies.map(policy => <PolicyItem key={policy.id} policy={policy} />)
    }
  </section>
}

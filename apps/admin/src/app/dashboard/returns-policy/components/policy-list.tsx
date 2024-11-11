"use client";
import React from 'react'
import PolicyItem from './policy-item'
import { PolicyListType } from '@/store/policies/policy-store';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PolicyListProp {
  policies: PolicyListType[];
  setSelected: (value: any) => void;
}

export default function PolicyList({policies, setSelected}: PolicyListProp) {

  const onSelect = (value: any) => {
    setSelected(value)
  }


  return <section className='space-y-3'>
    <RadioGroup onValueChange={onSelect}>
      { policies.map(policy => (
        <div className="bg-white flex items-center pl-2 gap-2">
          <RadioGroupItem value={policy.uid} id={policy.uid} />
          <PolicyItem key={policy.id} policy={policy} />
        </div>
      )) }
    </RadioGroup>
  </section>
}

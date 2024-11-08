'use client';
import React from 'react'
import { usePolicyForm } from '@/store/policies/policy-form';
import ProductConditionPanel from './product-cond-panel';
import OrderConditionPanel from './order-cond-panel';
import CustomerConditionPanel from './customer-cond-panel';
import DurationConditionPanel from './duration-cond-panel';

export default function RootConditionPanel() {
    const policy_type = usePolicyForm(state => state.policy_type)
    const selectedNode = usePolicyForm(state => state.selectedNode)

    
    const activePanel = {
        product: <ProductConditionPanel />,
        order: <OrderConditionPanel />,
        customer: <CustomerConditionPanel />,
        duration: <DurationConditionPanel />
    }[policy_type]

    return (
        <div>
            {selectedNode && activePanel}
        </div>
    )
}

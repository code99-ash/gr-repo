import { usePolicyForm } from '@/store/policies/policy-form'
import React from 'react'

interface PropType {
    children: React.ReactNode, 
    node_id?: string, 
    muted?: boolean // determines if we can interract with node_wrapper
}

export default function NodeWrapper({children, node_id, muted}: PropType) {


    const {selectNode, policy_flow, incomplete_nodes} = usePolicyForm(state => state)

    const handleClick = () => {
        if(!node_id) return;

        selectNode(policy_flow[node_id])
    }
    return (
        <section className={`node-wrapper relative group ${node_id && incomplete_nodes.includes(node_id)? 'border-destructive':''}`}>
            {
                !muted &&
                <div className='node-wrapper-option opacity-0 group-hover:opacity-100' >
                    <span 
                        className="material-symbols-outlined"
                        role='button' onClick={handleClick}
                    >edit_square</span>
                </div>
            }
            {children}
        </section>
  )
}

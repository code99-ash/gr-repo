import React, { useMemo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useReactflowStore } from '@/store/react-flow/reactflow-store'
import { usePolicyForm } from '@/store/policies/policy-form'
import ProductConditionNode from './product-cond-node'
import OrderConditionNode from './order-cond-node'
import CustomerConditionNode from './customer-cond-node'
import DurationConditionNode from './duration-cond-node'
import NodeWrapper from '../node-wrapper'


export default function RootConditionNode({data}: { data: any }) {
    const edges = useReactflowStore(state => state.edges)
    const policy_type = usePolicyForm(state => state.policy_type)
  
    const nodeEdge = useMemo(() => edges.find(edge => edge.source === data.node_id), [edges, data.node_id])

    const conditionData = useMemo(() => {
        switch (policy_type) {
            case 'order':
                return <OrderConditionNode data={data} />        
            case 'customer':
                return <CustomerConditionNode data={data} />        
            case 'duration':
                return <DurationConditionNode data={data} />        
            default:
                return <ProductConditionNode data={data} />  ;
        }
    }, [policy_type, data])

    return (
        <NodeWrapper node_id={data.node_id ?? 'head'}>
            {conditionData}
            <Handle 
                position={Position.Right} 
                type="source"
                target={nodeEdge?.target || null}
                isConnectableStart={!nodeEdge}
                isConnectableEnd={false}
            />
        </NodeWrapper>
    )
}

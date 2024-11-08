import React, { useMemo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useReactflowStore } from '@/store/react-flow/reactflow-store'
import { PolicyTypes, usePolicyForm } from '@/store/policies/policy-form'
import ProductConditionNode from './product-cond-node'
import OrderConditionNode from './order-cond-node'
import CustomerConditionNode from './customer-cond-node'
import DurationConditionNode from './duration-cond-node'
import NodeWrapper from '../node-wrapper'


export default function RootConditionNode({data}: { data: any }) {
    const edges = useReactflowStore(state => state.edges)
    const policy_type = usePolicyForm(state => state.policy_type)
  
    const nodeEdge = edges.find(edge => edge.source === data.node_id)

    const conditionData = {

        product: <ProductConditionNode data={data} />,
        order: <OrderConditionNode data={data} />,
        customer: <CustomerConditionNode data={data} />,
        duration: <DurationConditionNode data={data} />

    }[policy_type as PolicyTypes]                 


    return (
        <NodeWrapper node_id={data.node_id ?? 'head'}>
            {conditionData}
            <Handle 
                position={Position.Right} 
                type="source"
                isConnectableStart={!nodeEdge}
                isConnectableEnd={false}
            />
        </NodeWrapper>
    )
}

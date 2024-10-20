import React, { useMemo } from 'react'
import { Handle, Position } from '@xyflow/react'
import NodeWrapper from './node-wrapper'
import { useReactflowStore } from '@/store/react-flow/reactflow-store'
import { usePolicyForm } from '@/store/policies/policy-form'


export default function ConditionNode({data}: { data: any }) {
    const edges = useReactflowStore(state => state.edges)
    const selectedNode = usePolicyForm(state => state.selectedNode)
  
    const nodeEdge = useMemo(() => edges.find(edge => edge.source === data.node_id), [edges, data.node_id])

    return (
        <NodeWrapper node_id={data.node_id ?? 'head'}>
            <h1 className="text-primary text-[10px] satoshi-bold capitalize">Condition</h1>
            <div className="w-full grow border rounded p-2 space-y-1">
                <header className="flex items-center gap-1 capitalize text-[7px]">
                    <span 
                        className="material-symbols-outlined"
                        style={{fontSize: '8px'}}    
                    >autorenew</span>
                    Category
                </header>
                <p className="text-[7px]">
                    {data?.list?.length > 0 ? (
                    <>
                        {data.list[0]}
                        {data.list.length > 1 && `, +${data.list.length - 1} more`}
                    </>
                    ) : (
                    'No conditions specified'
                    )}
                </p>
            </div>
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

'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Edge, Handle, Position } from '@xyflow/react';
import NodeWrapper from '../node-wrapper';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { usePolicyForm } from '@/store/policies/policy-form';
import { ProductDataType } from '@/interfaces/product.interface';
import { useIncompleteNodes } from '@/hooks/use-incomplete';

const MAX_BRANCHES = 2;

export default function YesNoQuestionNode({ data }: { data: any }) {
    const edges = useReactflowStore(state => state.edges);
    const policy_flow = usePolicyForm(state => state.policy_flow);
    const {validateNode} = useIncompleteNodes()
    
    const flowNode = policy_flow[data.node_id] as ProductDataType

    const [nodeEdge, setNodeEdge] = useState<Edge | null>(null)
    const [helper, setHelper] = useState({
        branchLength: 0,
        isConnectable: false
    })
    
    useEffect(() => {
        
        const edge = edges.find(each => each.source === data.node_id);
        setNodeEdge(edge || null)

    }, [edges, data.node_id])

    useEffect(() => {
        if(!flowNode) return;

        const branchLength = flowNode.branches.length;
        const edgeCount = edges.filter(each => each.source === data.node_id).length;

        const isConnectable = edgeCount < MAX_BRANCHES

        setHelper({ branchLength, isConnectable })
        
    }, [flowNode, edges])
    
    
    useEffect(() => {
        validateNode(data.node_id, helper.branchLength === MAX_BRANCHES && data.message.trim())
    }, [helper, data])

    return (
        <NodeWrapper node_id={data.node_id}>
          
            <Handle 
                position={Position.Left} 
                type="target"
                isConnectable={!nodeEdge?.source}
                isConnectableEnd={true}
                isConnectableStart={false}
            />
    
 
            <h1 className="text-primary text-[10px] satoshi-bold capitalize">User Input</h1>
            <div className="w-full grow border rounded p-2 space-y-1">
                <header className="flex items-center gap-1 capitalize text-[7px]">
                    <span 
                        className="material-symbols-outlined"
                        style={{ fontSize: '8px' }}
                    >
                        help
                    </span>
                    Yes/No Question
                </header>
                <p className="text-[7px]">{data.message || 'Please type in a message'}</p>
            </div>
    

            <Handle 
                position={Position.Right} 
                type="source"
                id={`${data.node_id}-right`}
                isConnectable={helper.isConnectable}
                isConnectableStart={true}
                isConnectableEnd={false}
            />
        </NodeWrapper>
    );
}
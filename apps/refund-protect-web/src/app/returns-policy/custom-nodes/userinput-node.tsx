'use client';
import React, { useEffect, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from './node-wrapper';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { usePolicyForm } from '@/store/policies/policy-form';

export default function UserInputNode({ data }: { data: any }) {
    const edges = useReactflowStore(state => state.edges);
    const policy_flow = usePolicyForm(state => state.policy_flow);
    const updateIncomplete = usePolicyForm(state => state.updateIncomplete);
    const incomplete_nodes = usePolicyForm(state => state.incomplete_nodes);

    // Memoize filtered edges for the node to avoid unnecessary recalculations
    const nodeEdges = useMemo(() => edges.filter(each => each.source === data.node_id), [edges, data.node_id]);

    const nodeEdge = useMemo(() => nodeEdges.find(edge => edge.source === data.node_id), [nodeEdges]);

    const flowNode = useMemo(() => policy_flow[data.node_id], [policy_flow, data.node_id]);

    useEffect(() => {
        if (!flowNode) return;

        const branchLength = flowNode.branches.length;
        const expectedLength = flowNode.data.input_type === 'upload' ? 1 : 2;
        const alreadyIdle = incomplete_nodes.includes(data.node_id);

        // Update incomplete nodes if branch length is less than expected
        if (branchLength < expectedLength) {
            if (!alreadyIdle) {
                updateIncomplete([...incomplete_nodes, data.node_id]);
            }
        } else {
            // Remove node from incomplete nodes if branch length is sufficient
            if (alreadyIdle) {
                updateIncomplete(incomplete_nodes.filter(node => node !== data.node_id));
            }
        }
    }, [flowNode, incomplete_nodes, updateIncomplete, data.node_id]);

    return (
        <NodeWrapper node_id={data.node_id}>
            {/* Target Handle */}
            <Handle 
                position={Position.Left} 
                type="target"
                isConnectable={!nodeEdge?.source}
                isConnectableEnd={true}
                isConnectableStart={false}
            />
    
            {/* Node Content */}
            <h1 className="text-primary text-[10px] satoshi-bold capitalize">User Input</h1>
            <div className="w-full grow border rounded p-2 space-y-1">
                <header className="flex items-center gap-1 capitalize text-[7px]">
                    <span 
                        className="material-symbols-outlined"
                        style={{ fontSize: '8px' }}
                    >
                        help
                    </span>
                    {data.input_type}
                </header>
                <p className="text-[7px]">{data.message || 'Please type in a message'}</p>
            </div>
    
            {/* Source Handle */}
            <Handle 
                position={Position.Right} 
                type="source"
                id={`${data.node_id}-right`}
                isConnectable={nodeEdges?.length < 2}
                isConnectableStart={true}
                isConnectableEnd={false}
            />
        </NodeWrapper>
    );
}

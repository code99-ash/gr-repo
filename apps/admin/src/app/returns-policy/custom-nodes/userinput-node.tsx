'use client';
import React, { useEffect, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from './node-wrapper';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { usePolicyForm } from '@/store/policies/policy-form';
import { ProductDataType } from '@/interfaces/product.interface';

const nodeTypeMap = {
    'yes_no_question': 'Yes/No Question',
    'multiple_choice_question': 'Multiple Choice Question',
    'asset_upload': 'Asset Upload'
}

export default function UserInputNode({ data }: { data: any }) {
    const edges = useReactflowStore(state => state.edges);
    const policy_flow = usePolicyForm(state => state.policy_flow);
    const updateIncomplete = usePolicyForm(state => state.updateIncomplete);
    const incomplete_nodes = usePolicyForm(state => state.incomplete_nodes);

    const nodeEdge = useMemo(() => {
        const findAll = edges.filter(each => each.source === data.node_id);
        const findEdge = findAll.find(edge => edge.source === data.node_id);

        return findEdge;
    }, [edges, data.node_id])

    
    const flowNode = useMemo(() => policy_flow[data.node_id], [policy_flow, data.node_id]) as ProductDataType

    const helper = useMemo(() => {
        if(!flowNode) {
            console.log('No flow node found')
            return {
                isQuestion: false,
                branchLength: 0,
                expectedLength: 0,
                isConnectable: false
            };
        }

        const question_types = ['yes_no_question', 'multiple_choice_question'];

        const isQuestion = question_types.includes(flowNode.node_type)
        const branchLength = flowNode.branches.length;
        const expectedLength = !isQuestion ? 1 : 2;

        const edgeCount = edges.filter(each => each.source === data.node_id).length;

        const isConnectable = flowNode.node_type !== 'multiple_choice_question'? edgeCount < expectedLength : true;

        return { isQuestion, branchLength, expectedLength, isConnectable }

    }, [flowNode, edges, data.node_id])

    useEffect(() => {

        const { isQuestion, branchLength, expectedLength } = helper;
        const alreadyIdle = incomplete_nodes.includes(data.node_id);

        
        if (branchLength < expectedLength || (isQuestion && !flowNode.data.message?.trim())) {
            if (!alreadyIdle) {
                updateIncomplete([...incomplete_nodes, data.node_id]);
            }
        } else {
           
            if (alreadyIdle) {
                updateIncomplete(incomplete_nodes.filter(node => node !== data.node_id));
            }
        }

    }, [flowNode, incomplete_nodes, updateIncomplete, data.node_id]);

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
                    {
                        flowNode? nodeTypeMap[flowNode.node_type as keyof typeof nodeTypeMap] : 'User Input'
                    }
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

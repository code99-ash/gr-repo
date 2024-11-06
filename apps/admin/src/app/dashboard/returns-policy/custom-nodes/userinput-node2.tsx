'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from './node-wrapper';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { usePolicyForm } from '@/store/policies/policy-form';
import { ProductDataType } from '@/interfaces/product.interface';

const node_type_map = {
    'yes_no_question': 'Yes/No Question',
    'multiple_choice_question': 'Multiple Choice Question',
    'asset_upload': 'Asset Upload'
}

const question_types = ['yes_no_question', 'multiple_choice_question'];

export default function UserInputNode({ data }: { data: any }) {
    const edges = useReactflowStore(state => state.edges);
    const policy_flow = usePolicyForm(state => state.policy_flow);
    const updateIncomplete = usePolicyForm(state => state.updateIncomplete);
    const incomplete_nodes = usePolicyForm(state => state.incomplete_nodes);

    const flowNode = policy_flow[data.node_id] as ProductDataType

    const [helper, setHelper] = useState({
        isQuestion: false,
        branchLength: 0,
        expectedLength: 0,
        isConnectable: false
    })

    // fetching everytime there is a slight change in the flow, useMemo is necessary
    const nodeEdge = useMemo(() => {
        const findAll = edges.filter(each => each.source === data.node_id);
        const findEdge = findAll.find(edge => edge.source === data.node_id);

        return findEdge;
    }, [edges, data.node_id])

    useEffect(() => {
        if(!flowNode) return;

        const isQuestion = question_types.includes(flowNode.node_type)
        const branchLength = flowNode.branches.length;
        const expectedLength = !isQuestion ? 1 : 2;

        const edgeCount = edges.filter(each => each.source === data.node_id).length;

        const isConnectable = flowNode.node_type !== 'multiple_choice_question'? edgeCount < expectedLength : true;

        setHelper({
            isQuestion,
            branchLength,
            expectedLength,
            isConnectable
        })
        
    }, [flowNode, edges, data.node_id])


    useEffect(() => {
        if(!flowNode) return;
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

    }, [helper, incomplete_nodes, updateIncomplete]);

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
                        flowNode? node_type_map[flowNode.node_type as keyof typeof node_type_map] : 'User Input'
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
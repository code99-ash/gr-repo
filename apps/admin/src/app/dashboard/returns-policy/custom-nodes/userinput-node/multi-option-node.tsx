'use client';
import React, { useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useIncompleteNodes } from '@/hooks/use-incomplete';
import NodeWrapper from '../node-wrapper';
import { useNodeEdge } from '@/hooks/use-node-edge';
import { useBranchwatch } from '@/hooks/use-branch-watch';

const MIN_BRANCHES = 2;

export default function MultiChoiceQuestion({ data }: { data: any }) {
    const { nodeEdge } = useNodeEdge(data.node_id)
    const { branch_length } = useBranchwatch(data.node_id, { 
        threshold: MIN_BRANCHES, 
        operator: '<' 
    })
    const { validateNode } = useIncompleteNodes()


    useEffect(() => {

        validateNode(
            data.node_id, 
            branch_length >= MIN_BRANCHES && data.message.trim()
        )

    }, [branch_length, data])


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
                    Multiple Choice Question
                </header>
                <p className="text-[7px]">{data.message || 'Please type in a message'}</p>
            </div>
    

            <Handle 
                position={Position.Right} 
                type="source"
                id={`${data.node_id}-right`}
                isConnectable={true}
                isConnectableStart={true}
                isConnectableEnd={false}
            />
        </NodeWrapper>
    );
}
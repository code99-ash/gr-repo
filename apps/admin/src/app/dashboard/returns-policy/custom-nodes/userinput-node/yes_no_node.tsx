'use client';
import React, { useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from '../node-wrapper';
import { useIncompleteNodes } from '@/hooks/use-incomplete';
import { useNodeEdge } from '@/hooks/use-node-edge';
import { useBranchwatch } from '@/hooks/use-branch-watch';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

const MAX_BRANCHES = 2;

export default function YesNoQuestionNode({ data }: { data: any }) {
    const { nodeEdge } = useNodeEdge(data.node_id)
    const { branch_length, is_connectable } = useBranchwatch(data.node_id, { 
        threshold: MAX_BRANCHES, 
        operator: '<' 
    })
    const { validateNode } = useIncompleteNodes()
   
    
    useEffect(() => {

        validateNode(
            data.node_id, 
            branch_length === MAX_BRANCHES && data.message.trim()
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
            <div className="w-full grow border rounded p-2 space-y-1 bg-accent">
                <header className="flex items-center gap-1 satoshi-medium capitalize text-[7px]">
                    <QuestionMarkCircledIcon width={10} height={10} />
                    Yes/No Question
                </header>
                <p className="text-[7px]">{data.message || 'Please type in a message'}</p>
            </div>
    

            <Handle 
                position={Position.Right} 
                type="source"
                id={`${data.node_id}-right`}
                isConnectable={is_connectable}
                isConnectableStart={true}
                isConnectableEnd={false}
            />
        </NodeWrapper>
    );
}
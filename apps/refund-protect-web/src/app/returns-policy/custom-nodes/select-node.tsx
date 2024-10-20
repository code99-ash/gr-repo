import React, { useCallback, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from './node-wrapper';
import { Button } from '@/components/ui/button';
import { usePolicyForm } from '@/store/policies/policy-form';

export default function SelectNode({ data }: { data: any }) {
    const policy_flow = usePolicyForm(state => state.policy_flow)

    const handleReplaceNode = useCallback((newType: string) => {
        data.onCreateNode(
            data.node_id,
            newType, 
            data.position, 
            data.parentId
        );
    }, [data]);

    // User input (Upload) can only have action
    const isUpload = useMemo(() => {
        if(!data.parentId) return;

        const node = policy_flow[data.parentId];
        return node.node_type === 'user-input' && node.data?.input_type === 'upload';
    }, [data])


    return (
        <NodeWrapper muted={true}>
            <Handle 
                position={Position.Left} 
                type="target" 
                id={`${data.node_id}-a`}
            />
            
            {/* <h1 className="text-green text-[10px] satoshi-bold capitalize">Select Option</h1> */}
            <div className="w-full flex flex-col">
                <Button variant='outline'
                    className={`text-sm ${isUpload? 'opacity-20':''}`}
                    onClick={() => handleReplaceNode('user-input')}
                    disabled={isUpload}
                >
                    User Input
                </Button>
                <Button variant='outline'
                    className="text-sm"
                    onClick={() => handleReplaceNode('action')}
                >
                    Action
                </Button>
            </div>
        </NodeWrapper>
    );
}

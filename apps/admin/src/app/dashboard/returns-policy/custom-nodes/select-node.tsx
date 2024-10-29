import React, { useCallback, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from './node-wrapper';
import { Button } from '@/components/ui/button';
import { INodeTypes, usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { SwitchNodeCtx } from '../build/[policy_type]/build-option';

export default function SelectNode({ data }: { data: any }) {
    const { onCreateNode } = React.useContext(SwitchNodeCtx)

    const { policy_type, policy_flow } = usePolicyForm()

    const { edges, setEdges } = useReactflowStore()

    const handleReplaceNode = useCallback((new_type: INodeTypes, label: string |null) => {
        
        const { node_id, position, parentId: parent_id } = data;
        onCreateNode({ 
            node_id, 
            new_type, 
            position, 
            parent_id, 
            label 
        });

    }, [data, onCreateNode]);

    const label = useMemo(() => {
     
        const parent_node = policy_flow[data.parentId];
        let edgeLabel = 'Yes';

        if(!(parent_node.node_type === 'user-input' && parent_node.data.input_type === 'question')) {
            return null;
        }

        // get edges connected to this parent in reactflow-render-store
        const parent_edges = edges.filter(edge => edge.source === data.parentId);


        if(parent_edges.length > 1) {
            edgeLabel = 'No'
        }

        const newEdgeRender = edges.map(each => {
            if(each.source === data.parentId && each.target === data.node_id) {
                each = {
                    ...each, 
                    label: edgeLabel, 
                    data: { label: edgeLabel }
                }
            }

            return each;
        })

        setEdges(newEdgeRender)

        return edgeLabel;

    }, [data])


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
            
            <h1 className="text-green text-[10px] satoshi-bold capitalize">Select Option</h1>
            <div className="w-full flex flex-col gap-y-1">
                {
                    policy_type === 'product' && (
                        <Button variant='outline'
                            className={`select-node-btn ${isUpload? 'opacity-20':''}`}
                            onClick={() => handleReplaceNode('user-input', label)}
                            disabled={isUpload}
                        >
                            <span className="material-symbols-outlined" style={{fontSize: '13px'}}>
                                help
                            </span> User Input
                        </Button>
                    )
                }
                <Button variant='outline'
                    className="select-node-btn"
                    onClick={() => handleReplaceNode('action', label)}
                >
                    <span className="material-symbols-outlined" style={{fontSize: '13px'}}>autorenew</span>
                    Action
                </Button>
            </div>
        </NodeWrapper>
    );
}

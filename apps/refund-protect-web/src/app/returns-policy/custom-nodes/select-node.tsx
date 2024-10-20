import React, { useCallback, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from './node-wrapper';
import { Button } from '@/components/ui/button';
import { usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';

export default function SelectNode({ data }: { data: any }) {
    const policy_flow = usePolicyForm(state => state.policy_flow)
    const policy_type = usePolicyForm(state => state.policy_type)

    const nodes = useReactflowStore(state => state.nodes)
    const edges = useReactflowStore(state => state.edges)
    const setEdges = useReactflowStore(state => state.setEdges)

    const handleReplaceNode = useCallback((newType: string, label: string |null) => {

        data.onCreateNode(
            data.node_id,
            newType, 
            data.position, 
            data.parentId,
            label
        );
    }, [data, policy_flow]);

    const label = useMemo(() => {
        const parent_node = policy_flow[data.parentId];
        let edgeLabel = 'Yes';

        if(!(parent_node.node_type === 'user-input' && parent_node.data.input_type === 'question')) {
            return null;
        }

        // get edges connected to this parent in reactflow-render-store
        const parent_edges = edges.filter(edge => edge.source === data.parentId);
        console.log(parent_edges);

        if(parent_edges.length > 1) { // If there is an edge already, its predicted label is Yes
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
                {
                    policy_type === 'product' && (
                        <Button variant='outline'
                            className={`text-sm ${isUpload? 'opacity-20':''}`}
                            onClick={() => handleReplaceNode('user-input', label)}
                            disabled={isUpload}
                        >
                            User Input
                        </Button>
                    )
                }
                <Button variant='outline'
                    className="text-sm"
                    onClick={() => handleReplaceNode('action', label)}
                >
                    Action
                </Button>
            </div>
        </NodeWrapper>
    );
}

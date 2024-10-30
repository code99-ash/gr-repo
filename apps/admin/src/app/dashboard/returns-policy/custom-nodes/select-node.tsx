import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Edge, Handle, Position } from '@xyflow/react';
import NodeWrapper from './node-wrapper';
import { Button } from '@/components/ui/button';
import { INodeTypes, usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { SwitchNodeCtx } from '../build/[policy_type]/build-option';

const generateUniqueLabel = (existing_labels: string[], length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let label;
  
    do {
      label = Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join('');
    } while (existing_labels.includes(label));
  
    return {label, updated: [...existing_labels, label]};
};

const getYesNoQuestionLabel = (parent_id: string, edges: Edge[]) => {

    const parent_edges = edges.filter(edge => edge.source === parent_id);


    const getOppositeOption = (option: string) => {
        return (!option || option === 'No')? 'Yes' : 'No';
    }

    if(parent_edges.length <= 1) {
        return 'Yes';
    }else {
        return getOppositeOption(parent_edges[0].label as string);
    }

}

export default function SelectNode({ data }: { data: any }) {
    const { onCreateNode } = React.useContext(SwitchNodeCtx)
    const policy_flow = usePolicyForm(state => state.policy_flow)
    const policy_type = usePolicyForm(state => state.policy_type)
    const edges = useReactflowStore(state => state.edges)
    const setEdges = useReactflowStore(state => state.setEdges)

    const [is_upload, setIsUpload] = useState(false);

    useEffect(() => {

        const parent_node = policy_flow[data.parentId];
        setIsUpload(parent_node?.node_type === 'asset_upload')
        
    }, [policy_flow, data])

   

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

        if(!parent_node) return null

        const node_type = parent_node.node_type;

        let edgeLabel = null; 
        
        if(node_type === 'yes_no_question') {
            edgeLabel = getYesNoQuestionLabel(data.parentId, edges);
        }

        if(node_type === 'multiple_choice_question') {
            const existing_labels = edges.filter(edge => edge.source === data.parentId)
                                        .map(edge => edge.label)
                                        .filter(label => label !== null) as string[];

            const { label } = generateUniqueLabel(existing_labels)
            edgeLabel = label;
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

    }, [policy_flow, data])


    return (
        <NodeWrapper muted={true}>
            <Handle 
                position={Position.Left} 
                type="target" 
                id={`${data.node_id}-a`}
            />
            
            <h1 className="text-xs text-primary satoshi-medium">Select Node</h1>
            <div className="w-full flex flex-col gap-y-1">
                {
                    policy_type === 'product' && (
                        <Button variant='outline'
                            className={`select-node-btn ${is_upload? 'opacity-20':''}`}
                            onClick={() => handleReplaceNode('yes_no_question', label)}
                            disabled={is_upload}
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

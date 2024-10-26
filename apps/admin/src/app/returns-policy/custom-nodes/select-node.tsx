import React, { useCallback, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from './node-wrapper';
import { Button } from '@/components/ui/button';
import { usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';

const generateUniqueLabel = (existing_labels: string[], length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let label;
  
    // Generate a unique label not in the existing labels
    do {
      label = Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join('');
    } while (existing_labels.includes(label));
  
    return {label, updated: [...existing_labels, label]};
};

export default function SelectNode({ data }: { data: any }) {
    const policy_flow = usePolicyForm(state => state.policy_flow)
    const policy_type = usePolicyForm(state => state.policy_type)
    const edges = useReactflowStore(state => state.edges)
    const setEdges = useReactflowStore(state => state.setEdges)


    const getYesNoQuestionLabel = (parent_id: string) => {

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

    const handleReplaceNode = useCallback((newType: string, label: string |null) => {

        data.onCreateNode(
            data.node_id,
            newType, 
            data.position, 
            data.parentId,
            label
        );
    }, [data, policy_flow]);

    const helper = useMemo(() => {
        if(!data.parentId) return;

        const parent_node = policy_flow[data.parentId];
        const node_type = parent_node.node_type;
        const isYesNoQuestion = node_type === 'yes_no_question';
        const isUpload = node_type === 'asset_upload';
        const isMultipleChoice = node_type === 'multiple_choice_question';

        return { isYesNoQuestion, isUpload, node_type, parent_node, isMultipleChoice };

    }, [data])

    const label = useMemo(() => {

        let edgeLabel = null;

        if(!helper) return edgeLabel;

        const { isYesNoQuestion, isMultipleChoice } = helper;
 
        
        if(isYesNoQuestion) {
            edgeLabel = getYesNoQuestionLabel(data.parentId);
        }

        if(isMultipleChoice) {
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

    }, [data])


    return (
        <NodeWrapper muted={true}>
            <Handle 
                position={Position.Left} 
                type="target" 
                id={`${data.node_id}-a`}
            />
            
            
            <div className="w-full flex flex-col">
                {
                    policy_type === 'product' && (
                        <Button variant='outline'
                            className={`text-sm ${helper?.isUpload? 'opacity-20':''}`}
                            onClick={() => handleReplaceNode('yes_no_question', label)}
                            disabled={helper?.isUpload}
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

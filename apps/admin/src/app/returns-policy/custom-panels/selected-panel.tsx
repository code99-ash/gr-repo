import React, { createContext, useMemo } from 'react'
import RootConditionPanel from './condition-panel/root-cond-panel';
import UserInputPanel from './userinput-panel';
import ActionPanel from './action-panel';
import { Button } from '@/components/ui/button';
import { NodeTypes, usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';

// Define the type for updateNode function
interface UpdateNodeContextType {
    updateNode: (updatedNode: UpdatedNodeType) => void;
}

// Define the type for updatedNode
interface UpdatedNodeType {
    id: string;
    node_type?: NodeTypes;
    data: any; // You can replace `any` with the specific type if you have a defined shape for node data
}

// Create the context with a default value (an empty function)
export const UpdateNodeCtx = createContext<UpdateNodeContextType>({ updateNode: () => {} });

export default function SelectedPanel() {
    const { updateNode: renderUpdate } = useReactflowStore(state => state);
    const { modifyNode, selectedNode, selectNode } = usePolicyForm();

    const closePanel = () => {
        selectNode(null);
    }

    const updateNode = (updatedNode: UpdatedNodeType) => {
        // Update rendered flow
        renderUpdate({
            ...updatedNode,
            data: {
                ...updatedNode.data,
                node_id: updatedNode.id, // For interaction on rendered flow
            }
        });

        // Update original data
        modifyNode(updatedNode.id, updatedNode.data, updatedNode.node_type);
    }

    const activePanel = useMemo(() => {
        switch (selectedNode?.node_type) {
            case 'yes_no_question':
            case 'multiple_choice_question':
            case 'asset_upload':
                return <UserInputPanel />;
            case 'action':
                return <ActionPanel />;
            default:
                return <RootConditionPanel />;
        }
    }, [selectedNode]);

    return (
        <div className='relative p-3'>
            <span
                className="material-symbols-outlined absolute top-2 right-2 text-foreground"
                role='button' onClick={closePanel}
            >close</span>
            {selectedNode ? (
                <UpdateNodeCtx.Provider value={{ updateNode }}>
                    {activePanel}
                </UpdateNodeCtx.Provider>
            ) : null}
        </div>
    );
}

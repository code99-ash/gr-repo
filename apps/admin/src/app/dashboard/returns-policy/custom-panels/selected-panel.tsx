import React, { createContext, useMemo } from 'react'
import RootConditionPanel from './condition-panel/root-cond-panel';
import UserInputPanel from './userinput-panel';
import ActionPanel from './action-panel';
import { usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';


interface UpdateNodeContextType {
    updateNode: (updatedNode: UpdatedNodeType) => void;
}


interface UpdatedNodeType {
    id: string;
    data: any;
}


export const UpdateNodeCtx = createContext<UpdateNodeContextType>({ updateNode: () => {} });

export default function SelectedPanel() {
    const { updateNode: renderUpdate } = useReactflowStore(state => state);
    const { modifyNode, selectedNode, selectNode } = usePolicyForm();

    const closePanel = () => {
        selectNode(null);
    }

    const updateNode = (updatedNode: UpdatedNodeType) => {
        
        renderUpdate({
            ...updatedNode,
            data: {
                ...updatedNode.data,
                node_id: updatedNode.id,
            }
        });

   
        modifyNode(updatedNode.id, updatedNode.data);
    }

    const activePanel = useMemo(() => {
        switch (selectedNode?.node_type) {
            case 'user-input':
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

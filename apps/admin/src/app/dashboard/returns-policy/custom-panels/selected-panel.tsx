import React, { createContext } from 'react'
import RootConditionPanel from './condition-panel/root-cond-panel';
import ActionPanel from './action-panel';
import { INodeTypes, usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import RootInputPanel from './userinput-panel/root-panel';


interface UpdateNodeContextType {
    updateNode: (updatedNode: UpdatedNodeType) => void;
}


interface UpdatedNodeType {
    id: string;
    node_type?: INodeTypes;
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

     
        modifyNode(updatedNode.id, updatedNode.data, updatedNode.node_type);
    }

    if(!selectedNode) return null;

    const activePanel = {
        asset_upload: <RootInputPanel />,
        yes_no_question: <RootInputPanel />,
        multiple_choice_question: <RootInputPanel />,
        action: <ActionPanel />,
        conditions: <RootConditionPanel />
    }[selectedNode.node_type]

    

    return (
        <div className='relative p-3'>
            <span
                className="material-symbols-outlined absolute top-2 right-2 text-foreground"
                role='button' onClick={closePanel}
            >close</span>
            
            <UpdateNodeCtx.Provider value={{ updateNode }}>
                {activePanel}
            </UpdateNodeCtx.Provider>
          
        </div>
    );
}

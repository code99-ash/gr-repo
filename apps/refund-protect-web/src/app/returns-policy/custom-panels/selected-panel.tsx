'use client';
import React, { useEffect, useMemo } from 'react'
import RootConditionPanel from './condition-panel/root-cond-panel';
import UserInputPanel from './userinput-panel';
import ActionPanel from './action-panel';
import { Button } from '@/components/ui/button';
import { usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';


export default function SelectedPanel() {
    const {updateNode: renderUpdate} = useReactflowStore(state => state);
    const {modifyNode, selectedNode, selectNode} = usePolicyForm()
    // const option_flow = useNewPolicy(state => state.option_flow)

    const closePanel = () => {
        selectNode(null)
    }

    const updateNode = (updatedNode: any) => {
        // // update rendered flow 
        renderUpdate({
            ...updatedNode,
            data: {
                ...updatedNode.data,
                node_id: updatedNode.id // For interraction on rendered flow
            }
        })

        // // update original data
        modifyNode(updatedNode.id, updatedNode.data)
    }

    // useEffect(() => {
    //     if(option_flow && selectedNode) {
    //         console.log(option_flow[selectedNode.id]['data'])
    //     }
    // }, [option_flow])

    const activePanel = useMemo(() => {
        switch (selectedNode?.node_type) {
            case 'user-input':
                return <UserInputPanel node={selectedNode} updateNode={updateNode} />
            case 'action':
                return <ActionPanel node={selectedNode} updateNode={updateNode} />
            default:
                return <RootConditionPanel />
        }
    }, [selectedNode])

    return (
        <div className='relative p-3'>
            <span
                className="material-symbols-outlined absolute top-2 right-2 text-foreground"
                role='button' onClick={closePanel}
            >close</span>
            { selectedNode? activePanel : null }
        </div>
    )
}

'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { usePolicyForm } from '@/store/policies/policy-form';
import { ProductDataType } from '@/interfaces/product.interface';
import { UpdateNodeCtx } from '../selected-panel';
import { CameraIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import SwitchInputType from './switch-input-type';
import YesNoBranches from './yes-no-branches';
import MultpleChoiceBranches from './multiple-choice-branches';
import DeleteNodeConfirm from '../delete-node-confirm';


export default function RootInputPanel() {
  const { updateNode } = useContext(UpdateNodeCtx)
  const removeNode = usePolicyForm(state => state.removeNode);
  const selectNode = usePolicyForm(state => state.selectNode)
  const selectedNode = usePolicyForm(state => state.selectedNode) as ProductDataType
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [node_message, setNodeMessage] = useState<string>('');

  useEffect(() => {
    
    setNodeMessage(selectedNode.data.message)

  }, [selectedNode])


  const handleMessageChange = (value: string) => {
    setNodeMessage(value)
    updateNode({ ...selectedNode, data: { message: value } })
  }

  const deleteAnyway = () => {
    removeNode(selectedNode.id)
    setConfirmDelete(false)
    selectNode(null)
  }

  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        {
          selectedNode.node_type === 'asset_upload'?
          <CameraIcon width={20} height={20} /> :
          <QuestionMarkCircledIcon width={20} height={20} />
        }
        User Input
      </header>

      <DeleteNodeConfirm
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        deleteAnyway={deleteAnyway}
      />

      <main className='border rounded-xl p-3 space-y-1'>
        <SwitchInputType />

        <section className='space-y-1 py-1'>
          <h4 className='text-grey text-sm'>Message</h4>
          <Textarea 
            placeholder="Type your message here." 
            className='w-full'
            value={node_message}
            onChange={(e) => handleMessageChange(e.target.value)}
          />
        </section>      
      </main>

      {
        selectedNode.node_type === 'yes_no_question'? <YesNoBranches /> : <MultpleChoiceBranches />
      }

    </div>
  );
}

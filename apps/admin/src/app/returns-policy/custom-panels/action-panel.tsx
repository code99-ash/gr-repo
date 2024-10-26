'use client';
import { ActionType } from '@/interfaces/common.interface';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import DeleteNodeConfirm from './delete-node-confirm';
import { usePolicyForm } from '@/store/policies/policy-form';
import { UpdateNodeCtx } from './selected-panel';


const baseActions = [
  {
    value: 'accept_exchange',
    label: 'Accept Exchange'
  },
  {
    value: 'accept_refund',
    label: 'Accept Refund'
  },
  {
    value: 'manual_review',
    label: 'Manual Review'
  },
  {
    value: 'decline',
    label: 'Decline'
  }
];

const customerActions = [
  {
    value: 'accept_exchange',
    label: 'Accept Exchange'
  },
  {
    value: 'accept_refund',
    label: 'Accept Refund'
  },
  {
    value: 'decline',
    label: 'Decline'
  }
]

const durationActions = [
  {
    value: 'decline',
    label: 'Decline'
  }
]

export default function ActionPanel() {
  const { updateNode } = useContext(UpdateNodeCtx)
  const policy_type = usePolicyForm(state => state.policy_type)
  const [action, setAction] = useState('Decline')
  const [message, setMessage] = useState('')
  const selectedNode = usePolicyForm(state => state.selectedNode) as ActionType
  const selectNode = usePolicyForm(state => state.selectNode)

  const removeNode = usePolicyForm(state => state.removeNode);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const actions = useMemo(() => {
    switch (policy_type) {
      case 'duration':
        return durationActions;
      case 'customer':
        return customerActions
      default:
        return baseActions
    }
  }, [policy_type])

  useEffect(() => {
    setAction(selectedNode.data.action_type)
    setMessage(selectedNode.data?.message || '')
  }, [selectedNode])

  const setActionType = (value: string) => {
    setAction(value)

    const newNode = {
      ...selectedNode,
      data: { action_type: value, message}
    }

    updateNode(newNode)
  }

  const setActionMessage = (e: any) => {
    setMessage(e.target.value)

    const newNode = {
      ...selectedNode,
      data: { action_type: action, message: e.target.value }
    }

    updateNode(newNode)
  }

  const deleteAnyway = () => {
    removeNode(selectedNode.id)
    setConfirmDelete(false)
    selectNode(null)
  }



  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        <span className='material-symbols-outlined'>autorenew</span>
        Action
      </header>

      {
        policy_type !== "duration" && ( // No node can be deleted on duration flow
          <DeleteNodeConfirm
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
            deleteAnyway={deleteAnyway}
          />
        )
      }

      <main className='border rounded-xl p-3 space-y-3'>

        <section className='space-y-1 py-5'>
          <h4 className='text-grey text-sm'>Category</h4>

          <div className="w-full">
            <Select
              value={action}
              onValueChange={(value) => setActionType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                {actions.map(action => (
                  <SelectItem 
                    value={action.value}
                  >
                    {action.label}
                  </SelectItem>
                ))} 
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </section>
        <section className='space-y-1 py-5'>
          <h4 className='text-grey text-sm'>Message</h4>
          <Textarea 
            className='w-full'
            value={message}
            onChange={setActionMessage}
          />
        </section>

        
      </main>
    </div>
  );
}

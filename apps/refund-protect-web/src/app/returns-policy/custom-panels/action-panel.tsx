'use client';
import { ActionType } from '@/interfaces/policies.types';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import DeleteNodeConfirm from './delete-node-confirm';
import { usePolicyForm } from '@/store/policies/policy-form';


const baseActions: string[] = [
  'Accept Exchange',
  'Accept Refund',
  'Manual Review',
  'AI Review',
  'Decline'
];

const customerActions: string[] = [
  'Accept Exchange',
  'Accept Refund',
  'Decline'
]

interface PropType {
    node: ActionType,
    updateNode: (node: any, node_id?: string) => void
}

export default function ActionPanel({node, updateNode}: PropType) {
  const policy_type = usePolicyForm(state => state.policy_type)
  const [action, setAction] = useState('Decline')
  const [message, setMessage] = useState('')

  const removeNode = usePolicyForm(state => state.removeNode);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const actions = useMemo(() => policy_type === 'customer'? customerActions : baseActions, [policy_type])

  useEffect(() => {
    setAction(node.data.action_type)
    setMessage(node.data?.message || '')
  }, [node])

  const setActionType = (value: string) => {
    setAction(value)

    const newNode = {
      ...node,
      data: { action_type: value, message}
    }

    updateNode(newNode)
  }

  const setActionMessage = (e: any) => {
    setMessage(e.target.value)

    const newNode = {
      ...node,
      data: { action_type: action, message: e.target.value }
    }

    updateNode(newNode)
  }

  const deleteAnyway = () => {
    removeNode(node.id)
    setConfirmDelete(false)
  }



  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        <span className='material-symbols-outlined'>autorenew</span>
        Action
      </header>

      <DeleteNodeConfirm
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        deleteAnyway={deleteAnyway}
      />

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
                    value={action}
                  >
                    {action}
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

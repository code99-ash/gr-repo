'use client';
import React, { useEffect, useState } from 'react';
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
import { Button } from "@/components/ui/button"
import DeleteNodeConfirm from './delete-node-confirm';
import { UserInputType } from '@/interfaces/product.interface';
import { usePolicyForm } from '@/store/policies/policy-form';


const categories = [
  {key: 'question', label: 'Yes/No Question'},
  {key: 'upload', label: 'Asset Upload'},
];

interface FormType {
  input_type: 'question'|'upload';
  message: string
}

interface PropType {
  node: UserInputType,
  updateNode: (node: any) => void
}

export default function UserInputPanel({node, updateNode}: PropType) {
  const removeNode = usePolicyForm(state => state.removeNode);
  const clearUploadChildren = usePolicyForm(state => state.clearUploadChildren);
  const incomplete_nodes = usePolicyForm(state => state.incomplete_nodes);
  const updateIncomplete = usePolicyForm(state => state.updateIncomplete);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<FormType>({
    input_type: 'question',
    message: '',
  });

  useEffect(() => {
    setForm({
      input_type: node.data.input_type,
      message: node.data.message
    })
  }, [node])

  useEffect(() => {
    if(form.input_type === 'upload') {
      clearUploadChildren(node.id)

      // since it will have no branch, add to incomplete nodes
      updateIncomplete([...incomplete_nodes, node.id]);
    }
  }, [form.input_type])

  const updateNodeValue = (value: any, prop: any, dataProp: string) => {
    let newNode = {
      ...node,
      data: {...form, [dataProp]: value}
    }

    setForm({...form, [prop]: value})

    updateNode(newNode)
  }

  const deleteAnyway = () => {
    removeNode(node.id)
    setConfirmDelete(false)
  }

  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        <span className='material-symbols-outlined'>help</span>
        User Input
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
              value={form.input_type}
              onValueChange={(value) => {
                updateNodeValue(value, 'input_type', 'input_type')
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                {categories.map(category => (
                  <SelectItem 
                    value={category.key}
                  >
                    {category.label}
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
            placeholder="Type your message here." 
            className='w-full'
            value={form.message}
            onChange={(e) => {
              const value = e.target.value;
              updateNodeValue(value, 'message', 'message')
            }}
          />
        </section>

        
      </main>
    </div>
  );
}

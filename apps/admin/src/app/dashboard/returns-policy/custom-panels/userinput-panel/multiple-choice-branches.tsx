"use client";
import React, { useEffect, useState } from 'react'
import { usePolicyForm } from '@/store/policies/policy-form'
import { Label } from '@radix-ui/react-label'
import { useNodeEdge } from '@/hooks/use-node-edge';
import { BranchType } from '@/interfaces/common.interface';
import { Edit2Icon, X as CancelIcon, Forward } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MultpleChoiceBranches() {
  const selected_node = usePolicyForm(state => state.selectedNode)
  const updateBranchLabel = usePolicyForm(state => state.updateBranchLabel)
  const { flow_node } = useNodeEdge(selected_node?.id || '')

  const updateLabel = (branch_id: string, label: string) => {
    updateBranchLabel(selected_node?.id ?? '', branch_id, label)
  }

  return (
    <section className="flex flex-col gap-3">
      {
        flow_node.branches.map(branch => (
          <BranchLabel branch={branch} updateLabel={updateLabel} branches={flow_node.branches} />
        ))
      }
    </section>
  )
}

interface BranchLabelProp {
  branch: BranchType,
  updateLabel: (branch_id: string, label: string) => void;
  branches: BranchType[]
}

const BranchLabel = ({ branch, updateLabel, branches }: BranchLabelProp ) => {
  const [label, setLabel] = useState('');
  const [edit, setEdit] = useState(false);

  const onLabelChange = (value: string) => {
    setLabel(value);
  }

  useEffect(() => {
      
    setLabel(branch.label || '');

  }, [edit])

  const update = () => {
    if(!label) return;

    if(branches.some(each => each.label === label)) {
      alert('Branch label already exists');
      return;
    }

    updateLabel(branch.node_id, label)
    setEdit(false)
  }

  return (
    <div className='flex items-center gap-2 border p-1 rounded group'>
      {
        edit? <>
          <CancelIcon 
            width={15} height={15} 
            role='button' 
            className='group-hover:text-destructive' 
            onClick={() => setEdit(false)}
          />
          <EditBranchLabel onLabelChange={onLabelChange} label={label} />
          <Forward 
            width={20} height={20} 
            role='button' 
            className='group-hover:text-primary' 
            onClick={update}
          />
        </>
        : 
        <>
          <Edit2Icon 
            width={15} height={15} 
            role='button' 
            className='group-hover:text-primary' 
            onClick={() => setEdit(true)}
          />
          <Label className='text-sm'>{branch.label}</Label>
        </>
      }
    </div>
  ) 
}

interface EditBranchProp {
  onLabelChange: (value: any) => void,
  label: string
}

const EditBranchLabel = ({ onLabelChange, label }: EditBranchProp) => {
  return (
    <Input 
      value={label} 
      onChange={(e) => onLabelChange(e.target.value)}
    />
  )
}

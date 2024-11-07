"use client";
import React from 'react'
import { usePolicyForm } from '@/store/policies/policy-form'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@radix-ui/react-label'
import { useNodeEdge } from '@/hooks/use-node-edge';
import { BranchType } from '@/interfaces/common.interface';

export default function YesNoBranches() {
  const selected_node = usePolicyForm(state => state.selectedNode)
  const { flow_node } = useNodeEdge(selected_node?.id || '')

  const filterOption = (branch: BranchType, option: string) => {
    return branch.label?.toLowerCase() === option && !!branch.node_id;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className='flex items-center gap-2'>
        <Checkbox 
          disabled={true} id="yes" 
          checked={flow_node.branches.some(each => filterOption(each, 'yes'))}
        />
        <Label htmlFor='yes'>Yes</Label>
      </div>
      <div className='flex items-center gap-2'>
        <Checkbox 
          disabled={true} id="no" 
          checked={flow_node.branches.some(each => filterOption(each, 'no'))}
        />
        <Label htmlFor='no'>No</Label>
      </div>
    </section>
  )
}

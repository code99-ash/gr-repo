"use client";
import React, { useEffect } from 'react'
import { usePolicyForm } from '@/store/policies/policy-form'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@radix-ui/react-label'
import { useNodeEdge } from '@/hooks/use-node-edge';
import { BranchType } from '@/interfaces/common.interface';

export default function YesNoBranches() {
  const selected_node = usePolicyForm(state => state.selectedNode)
  const { flow_node } = useNodeEdge(selected_node?.id || '')
  const updateBranchLabel = usePolicyForm(state => state.updateBranchLabel)

  const filterOption = (branch: BranchType, option: string) => {
    return branch.label?.toLowerCase() === option && !!branch.node_id;
  }

  useEffect(() => {
    if(!selected_node) return;

    // Automatically assign Yes or No
    if(selected_node.branches.length > 0) {

      const branches = selected_node.branches;
      const accepted = ['Yes', 'No']

      let current_index = 0;

      while(current_index < branches.length) {
        if(!accepted.includes(branches[current_index].label ?? '')) {

          const hasYes = branches.some(branch => branch.label === 'Yes');

          const assigned_label = hasYes? 'No' : 'Yes';

          updateBranchLabel(selected_node.id, branches[current_index]['node_id'], assigned_label)
        }

        current_index += 1;
      }
    }

  }, [selected_node])

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

"use client";
import React, { useEffect, useState } from 'react'
import { usePolicyForm } from '@/store/policies/policy-form'
import { Label } from '@radix-ui/react-label'
import { useNodeEdge } from '@/hooks/use-node-edge';
import { BranchType } from '@/interfaces/common.interface';
import { Edit2Icon, X as CancelIcon, Forward } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BranchLabel from './branch-label';

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
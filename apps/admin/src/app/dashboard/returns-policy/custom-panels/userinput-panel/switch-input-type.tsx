"use client";
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INodeTypes, usePolicyForm } from '@/store/policies/policy-form';
import { ProductDataType } from '@/interfaces/product.interface';
import { input_types } from './utils';
import { useIncompleteNodes } from '@/hooks/use-incomplete';



export default function SwitchInputType() {
  const selected_node = usePolicyForm(state => state.selectedNode) as ProductDataType;
  const selectNode = usePolicyForm(state => state.selectNode);
  const changeNodeType = usePolicyForm(state => state.changeNodeType);
  const clearUploadChildren = usePolicyForm(state => state.clearUploadChildren);
  const { recordAsIncomplete } = useIncompleteNodes()

  const [node_type, setNodeType] = useState(selected_node.node_type);

  const handleNodeTypeChange = (value: INodeTypes) => {
    setNodeType(value);

    changeNodeType(selected_node.id, value)

    selectNode({...selected_node, node_type: value})

    if(value === 'asset_upload') {
        clearUploadChildren(selected_node.id)
        recordAsIncomplete(selected_node.id);
    }

  }

  return (
    <section className='space-y-1 py-5'>
      <h4 className='text-grey text-sm'>Category</h4>

      <div className="w-full">
        <Select
          value={node_type}
          onValueChange={handleNodeTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
            {input_types.map(input_type => (
              <SelectItem 
                value={input_type.key}
              >
                {input_type.label}
              </SelectItem>
            ))} 
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}

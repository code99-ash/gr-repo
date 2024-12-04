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

const type_branch_limit: Record<INodeTypes, number> = {
  "yes_no_question": 2,
  "asset_upload": 1,
  "action": 0,
  "conditions": 0,
  "multiple_choice_question": Infinity
}


export default function SwitchInputType() {
  const selected_node = usePolicyForm(state => state.selectedNode) as ProductDataType;
  const selectNode = usePolicyForm(state => state.selectNode);
  const changeNodeType = usePolicyForm(state => state.changeNodeType);

  const [node_type, setNodeType] = useState(selected_node.node_type);

  const handleNodeTypeChange = (value: INodeTypes) => {
    setNodeType(value);

    changeNodeType(selected_node.id, value, type_branch_limit[value])

    selectNode({...selected_node, node_type: value})
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
            {input_types.map((input_type, index) => (
              <SelectItem 
                value={input_type.key}
                key={index}
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

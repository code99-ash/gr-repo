'use client';
import React, { useContext, useEffect, useState } from 'react';
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
import { INodeTypes, usePolicyForm } from '@/store/policies/policy-form';
import { UpdateNodeCtx } from './selected-panel';
import { ProductDataType } from '@/interfaces/product.interface';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { BranchType } from '@/interfaces/common.interface';
import { Edge } from '@xyflow/react';


const categories = [
  {key: 'yes_no_question', label: 'Yes/No Question'},
  {key: 'multiple_choice_question', label: 'Multiple Choice Question'},
  {key: 'asset_upload', label: 'Asset Upload'},
];

const validateOption = (label_in_use: string[], label: string = 'Yes') => {

  const options = ['Yes', 'No'];

  const opposite: { [key: string]: string } = {
    'Yes': 'No',
    'No': 'Yes'
  }

  let label_to_use = !options.includes(label)? 'Yes' : label;

  // If the label is already in use, switch to its opposite
  if (label_in_use.includes(label_to_use)) {
    label_to_use = opposite[label_to_use];
  }

  label_in_use.push(label_to_use);

  return { current: label_to_use, labels: label_in_use };
}

const getYesNoUpdatedBranches = (branches: BranchType[]) => {
  let label_in_use: string[] = new Array()

  return branches.slice(0, 2).map((branch) => {
    
    const { current, labels } = validateOption(label_in_use, branch.label as string)
    label_in_use = labels

    return {
      ...branch, 
      label: current
    }
  })
}

const getYesNoUpdatedEdges = (edges: Edge[]) => {
  let label_in_use: string[] = new Array()

  return edges.slice(0, 2).map((edge) => {
    
    const { current, labels } = validateOption(label_in_use, edge.label as string)
    label_in_use = labels

    return {
      ...edge, 
      label: current,
      data: { label: current }
    }
  })
}

export default function UserInputPanel() {
  const { updateNode } = useContext(UpdateNodeCtx)
  const removeNode = usePolicyForm(state => state.removeNode);
  const clearUploadChildren = usePolicyForm(state => state.clearUploadChildren);
  const incomplete_nodes = usePolicyForm(state => state.incomplete_nodes);
  const updateIncomplete = usePolicyForm(state => state.updateIncomplete);
  const selectedNode = usePolicyForm(state => state.selectedNode) as ProductDataType
  const selectNode = usePolicyForm(state => state.selectNode)
  const modifyNodeBranches = usePolicyForm(state => state.modifyNodeBranches)
  const edges = useReactflowStore(state => state.edges)

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [node_type, setNodeType] = useState<INodeTypes>('yes_no_question');
  const [node_message, setNodeMessage] = useState<string>('');

  useEffect(() => {
    
    setNodeType(selectedNode.node_type)
    setNodeMessage(selectedNode.data.message)

  }, [selectedNode])

  useEffect(() => {
    if(node_type === 'asset_upload') {
      
      clearUploadChildren(selectedNode.id)

      updateIncomplete([...incomplete_nodes, selectedNode.id]);

    }

    const newNode = {
      ...selectedNode,
      data: { message: node_message },
      node_type
    }

    console.log('node type changed', node_type)
    updateNode(newNode)

  }, [node_type, node_message])

  const handleNodeTypeChange = (new_type: string) => {

    const renderedEdges = edges.filter(each => each.source === selectedNode.id);
    
    if(new_type === 'yes_no_question') {

      const newEdges = getYesNoUpdatedEdges(renderedEdges)
      const branches = getYesNoUpdatedBranches(selectedNode.branches)
      
      modifyNodeBranches(selectedNode.id, branches, newEdges, true)
    }

    else if(new_type === 'multiple_choice_question') {

      const branches = selectedNode.branches.map((branch, index) => {
        return { ...branch, label: `Option ${index + 1}` }
      })

      const newEdges = renderedEdges.map((edge, index) => {
        return { 
          ...edge, 
          label: `Option ${index + 1}`,
          data: { label: `Option ${index + 1}` }
        }
      })

      modifyNodeBranches(selectedNode.id, branches, newEdges)

    }  

    setNodeType(new_type as INodeTypes)
  }

  const deleteAnyway = () => {
    removeNode(selectedNode.id)
    setConfirmDelete(false)
    selectNode(null)
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
              value={node_type}
              onValueChange={(value) => handleNodeTypeChange(value)}
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
            value={node_message}
            onChange={(e) => {
              const value = e.target.value;
              setNodeMessage(value)
            }}
          />
        </section>

        
      </main>
    </div>
  );
}

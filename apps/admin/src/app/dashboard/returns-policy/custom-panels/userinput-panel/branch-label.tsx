"use client";
import { useEffect } from "react";
import { BranchType } from "@/interfaces/common.interface";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Edit2Icon, Forward, X as CancelIcon } from "lucide-react";
import EditBranchLabel from "./edit-branch-label";

interface BranchLabelProp {
    branch: BranchType,
    updateLabel: (branch_id: string, label: string) => void;
    branches: BranchType[]
  }
  
export default function BranchLabel({ branch, updateLabel, branches }: BranchLabelProp ) {
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
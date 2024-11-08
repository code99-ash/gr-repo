"use client";
import { Input } from "@/components/ui/input"

interface EditBranchProp {
    onLabelChange: (value: any) => void,
    label: string
}
  
export default function EditBranchLabel({ onLabelChange, label }: EditBranchProp) {
    return (
      <Input 
        value={label} 
        onChange={(e) => onLabelChange(e.target.value)}
      />
    )
}
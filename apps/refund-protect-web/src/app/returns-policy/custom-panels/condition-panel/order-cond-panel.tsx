'use client';
import React, { useContext, useEffect, useState } from 'react'
import { UpdateNodeCtx } from '../selected-panel'
import { OrderCategoryType, OrderConditionData, OrderConditionType, OrderConstraint } from '@/interfaces/order.interface';
import { usePolicyForm } from '@/store/policies/policy-form';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories: OrderCategoryType[] = [
  'Discounted orders',
  'Orders without discounts',
  'Order value'
]

const constraints: OrderConstraint[] = [
  'is less than',
  'is greater than'
]

export default function OrderConditionPanel() {
  const { updateNode } = useContext(UpdateNodeCtx)
  const [form, setForm] = useState<OrderConditionData>({
    category: 'Discounted orders',
    operator: 'is less than',
    value: 5
  })

  const selectedNode = usePolicyForm(state => state.selectedNode) as OrderConditionType
  
  useEffect(() => {
    const {data} = selectedNode;
    setForm({
      category: data.category,
      operator: data.operator,
      value: data.value,
    })
  }, [selectedNode]);

  const categoryChanged = (value: OrderCategoryType) => {
    setForm((prev) => ({
      ...prev,
      category: value
    }))
  }
  const operatorChanged = (value: OrderConstraint) => {
    setForm((prev) => ({
      ...prev,
      operator: value
    }))
  }
  const valueChanges = (value: number) => {
    setForm((prev) => ({ ...prev, value }))
  }

  useEffect(() => {

    updateNode({...selectedNode, data: form})

  }, [form])

  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        <span className='material-symbols-outlined'>autorenew</span>
        Condition
      </header>

      <header className='flex items-center justify-between mt-5 mb-2'>
        <h4 className='text-grey text-base'>Categories</h4>
      </header>
        <main className='border rounded-xl p-3 space-y-5'>

          <div className='flex flex-col gap-y-2 py-2 space-y-3'>
            <Label className='capitalize'>Order type</Label>
            <Select value={form.category} onValueChange={(value: OrderCategoryType) => categoryChanged(value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {
                  categories.map((category, i) => (
                    <SelectItem value={category} key={i}>{category}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-y-2 py-2 space-y-3'>
            <Label className='capitalize'>Constraint</Label>
            <Select value={form.operator} onValueChange={(value: OrderConstraint) => operatorChanged(value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {
                  constraints.map((constraint, i) => (
                    <SelectItem value={constraint} key={i}>{constraint}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-y-2 py-2 space-y-3'>
            <Label className='capitalize'>Value</Label>
            <Input 
              type='number'
              min={0}
              className='border-border w-full h-full py-2 pr-1 text-sm' 
              placeholder="10000" 
              onChange={(e) => valueChanges(Number(e.target.value))} 
              value={form.value}
            />
          </div>

      </main>
    </div>
  )
}

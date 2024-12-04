'use client';
import React, { useContext, useEffect, useState } from 'react'
import { UpdateNodeCtx } from '../selected-panel'
import { usePolicyForm } from '@/store/policies/policy-form';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { CustomerConditionType } from '@/interfaces/customer.interface';
import { PERIODS } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const constraints = [
  {
    value: 'is_less_than',
    label: 'is less than'
  }
]

export default function CustomerConditionPanel() {
  const { updateNode } = useContext(UpdateNodeCtx)
  const selectedNode = usePolicyForm(state => state.selectedNode) as CustomerConditionType
  
  const [form, setForm] = useState({
    expected_period: 5,
    operator: 'is less than',
    period: 'days',
    period_value: 2
  })

  useEffect(() => {
    const {data} = selectedNode;
    setForm({
      expected_period: data.expected_period,
      operator: data.operator,
      period: data.period,
      period_value: data.period_value,
    })
  }, [selectedNode]);

  const onperiod_valueChange = (value: number) => {
    setForm((prev) => ({...prev, period_value: value}))
  }

  const onExpectedValueChange = (value: number) => {
    setForm((prev) => ({...prev, expected_period: value}))
  }

  const operatorChanged = (value: string) => {
    setForm((prev) => ({...prev, operator: value}))
  }

  const onPeriodChanged = (value: string) => {
    setForm((prev) => ({...prev, period: value}))
  }

  useEffect(() => {

    updateNode({...selectedNode, data: form})

  }, [form, selectedNode, updateNode])


  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        <span className='material-symbols-outlined'>autorenew</span>
        Condition
      </header>

        <main className='border rounded-xl p-3'>
          <header className='flex items-center justify-between mb-5'>
            <h4 className='text-grey text-base'>Customer&apos;s Returns count</h4>
          </header>

          <div className="main space-y-3">
            <div className='flex flex-col gap-y-2 py-2'>
              <Label className='capitalize text-xs'>Constraint</Label>
              <Select value={form.operator} onValueChange={(value: string) => operatorChanged(value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Choose constraint" />
                </SelectTrigger>
                <SelectContent>
                  {
                    constraints.map((constraint, i) => (
                      <SelectItem value={constraint.value} key={i}>{constraint.label}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className='flex flex-col gap-y-2 py-2'>
              <Label className='capitalize text-xs'>Expected period</Label>
              <Input 
                className='border-border w-full h-full py-2 pr-1 text-sm' 
                placeholder="Custom category" 
                id="period-value"
                type='number'
                min={1}
                onChange={(e) => onExpectedValueChange(Number(e.target.value))} 
                value={form.expected_period}
              />
            </div>

            <div className='flex flex-col gap-y-2 py-2'>
              <Label className='capitalize text-xs'>Period Value</Label>
              <Input 
                className='border-border w-full h-full py-2 pr-1 text-sm' 
                placeholder="Custom category" 
                id="period-value"
                type='number'
                min={1}
                onChange={(e) => onperiod_valueChange(Number(e.target.value))} 
                value={form.period_value}
              />
            </div>

            <div className='flex flex-col gap-y-2 py-2'>
              <Label className='capitalize text-xs'>Period</Label>
              <Select value={form.period} onValueChange={(value: string) => onPeriodChanged(value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  {
                    PERIODS.map((period, i) => (
                      <SelectItem value={period.toLowerCase()} key={i}>{period}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

      </main>
    </div>
  )
}

'use client';
import React, { useContext, useEffect, useState } from 'react';

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { usePolicyForm } from '@/store/policies/policy-form';
import { UpdateNodeCtx } from '../selected-panel';
import { DurationConditionData, DurationConditionType } from '@/interfaces/duration.interface';


const periods = [
  'Hours',
  'Days',
  'Weeks',
  'Months',
  'Years',
];

type PeriodType = 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years'

export default function DurationConditionPanel() {
  const { updateNode } = useContext(UpdateNodeCtx)
  const selectedNode = usePolicyForm(state => state.selectedNode) as DurationConditionType

  const [form, setForm] = useState<DurationConditionData>({
    period: 'Days',
    periodValue: 10
  });

  useEffect(() => {
    const {data} = selectedNode;
    setForm({
      period: data.period,
      periodValue: data.periodValue
    })
  }, [selectedNode]);


  const onPeriodChange = (value: PeriodType) => {
    setForm(prev => ({
      ...prev,
      period: value
    }))
  }

  const onValueChange = (value: number) => {
    const val = (isNaN(value) || value < 1)? 1 : value;
    setForm(prev => ({...prev, periodValue: val}))
  }


  useEffect(() => {

    updateNode({...selectedNode, data: form})

  }, [form])

  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        <span className='material-symbols-outlined'>autorenew</span>
        Return window
      </header>

        <main className='border rounded-xl p-3'>
          <header className='flex items-center justify-between mb-5'>
            <h4 className='text-grey text-base'>Time after Delivery</h4>
          </header>

          <div className='flex flex-col gap-y-2 py-2 space-y-3'>
            <Label htmlFor="period-value" className='capitalize'>Period Value</Label>
            <Input 
              className='border-border w-full h-full py-2 pr-1 text-sm' 
              placeholder="Custom category" 
              id="period-value"
              type='number'
              min={1}
              onChange={(e) => onValueChange(Number(e.target.value))} 
              value={form.periodValue}
            />
          </div>

          <section className='space-y-3 py-5'>
            <Label className='capitalize'>Period</Label>
            <RadioGroup value={form.period} onValueChange={(value: PeriodType) => onPeriodChange(value)}>
              {periods.map((period, index) => (
                <div className="flex items-center space-x-2 mb-1" key={index}>
                  <RadioGroupItem 
                    value={period} 
                    className={`text-foreground ${form.period===period?'border-primary':'border-muted'}`}
                    id={period.toLocaleLowerCase()} 
                  />
                  <Label htmlFor={period.toLocaleLowerCase()} className='capitalize'>{period}</Label>
                </div>
              ))}
            </RadioGroup>
          </section>
      </main>
    </div>
  );
}

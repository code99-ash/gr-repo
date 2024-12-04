'use client';
import React, { useContext, useEffect, useState } from 'react';

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { ProductConditionType } from '@/interfaces/product.interface';
import { usePolicyForm } from '@/store/policies/policy-form';
import { UpdateNodeCtx } from '../selected-panel';
import { CheckCheck } from 'lucide-react';

const suggestions = [
  'Damaged',
  'Personalized Product',
  'Non-Refundable',
  'Product not fitting',
  'Product not as described',
  'Opened but unused',
  'Missing item',
  'Used',
];

export default function ProductConditionPanel() {
  const { updateNode } = useContext(UpdateNodeCtx)
  const selectedNode = usePolicyForm(state => state.selectedNode) as ProductConditionType;


  const [condition, setCondition] = useState<string>('');
  const [form, setForm] = useState<string>('');

  useEffect(() => {
    const initialCondition = selectedNode?.data?.list[0] || suggestions[0]
    setCondition(initialCondition);
  }, [selectedNode]);

  useEffect(() => {
    const updatedNode = {
      ...selectedNode,
      data: { ruling: 'all', list: [condition] }
    };
    updateNode(updatedNode);
  }, [condition]);

  const handleSelectChange = (selectedCondition: string) => {
    setCondition(selectedCondition);
  };

  const handleAddCustomCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.trim() && form !== condition) {
      setCondition(form);
      setForm('');
    }
  };

  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        <span className='material-symbols-outlined'>autorenew</span>
        Condition
      </header>

      <main className='border rounded-xl px-2 py-3'>
        <section className='space-y-3'>

          {/* Suggestions Dropdown */}
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full">
              <span>Suggestions</span>
            </SelectTrigger>
            <SelectContent>
              {suggestions.map((suggestion, index) => (
                <SelectItem key={index} value={suggestion}>
                  {suggestion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Display Selected Conditions */}
          <div className="flex items-center space-x-2 py-3">
            <CheckCheck className='w-4 h-4 text-primary' />
            <Label>{condition}</Label>
          </div>

          {/* Add New Custom Condition */}
          <Card className='p-3 space-y-1'>
            <Label>Not in the list?</Label>
            <form onSubmit={handleAddCustomCondition} className="flex gap-2 items-center">
              <Input
                className='border-border w-full py-2 pr-1 text-sm'
                placeholder="Custom condition"
                onChange={(e) => setForm(e.target.value)}
                value={form}
              />
              <Button variant='outline' size='icon' disabled={!form.trim()}>
                <span className="material-symbols-outlined">add</span>
              </Button>
            </form>
          </Card>
        </section>
      </main>
    </div>
  );
}

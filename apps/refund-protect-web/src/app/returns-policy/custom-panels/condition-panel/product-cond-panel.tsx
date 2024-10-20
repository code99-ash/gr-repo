'use client';
import React, { useEffect, useState } from 'react';

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { ProductConditionType } from '@/interfaces/product.interface';

const rulings = [
  { code: 'any', label: 'ANY condition selected' },
  { code: 'all', label: 'ALL conditions selected' },
];

const defaultConditions = [
  'Damaged',
  'Personalized Product',
  'Non-Refundable',
  'Product not fitting',
  'Product not as described',
  'Opened but unused',
  'Missing item',
  'Used', // fixed typo 'Userd'
];

interface PropType {
  node: ProductConditionType,
  updateNode: (node: any, node_id?: string) => void
}

export default function ProductConditionPanel({node, updateNode}: PropType) {
  const [activeRuling, setActiveRuling] = useState('any');

  const [defaultUsed, setDefaultUsed] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<string>('');

  useEffect(() => {
    setCategories(node.data.list || []);
    setActiveRuling(node.data.ruling || 'any');
  }, [node]);

  const updateCategory = (category: string) => {
    setDefaultUsed((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category); // Remove if already selected
      } else {
        return [...prev, category]; // Add if not selected
      }
    });
  };

  useEffect(() => {
    const newNode = {
      ...node,
      data: { ruling: activeRuling, list: [...categories, ...defaultUsed] }
    }
    updateNode(newNode, node.id)
  }, [activeRuling, categories, defaultUsed])

  const appendCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if(categories.includes(form)) return;

    setCategories((prev) => {
      return [...prev, form]
    })

    setForm('')
  }

  const removeCategory = (category: string) => {
    setCategories(prev => {
      return prev.filter(each => each !== category)
    })
  }

  return (
    <div className='space-y-3'>
      <header className='node-panel-header'>
        <span className='material-symbols-outlined'>autorenew</span>
        Condition
      </header>

      <div className='flex flex-col gap-y-2 py-2'>
        <RadioGroup value={activeRuling} onValueChange={(value) => setActiveRuling(value)}>
          {rulings.map((ruling) => (
            <div className="flex items-center space-x-2" key={ruling.code}>
              <RadioGroupItem 
                value={ruling.code} 
                className={`text-foreground ${activeRuling===ruling.code?'border-primary':'border-muted'}`}
                id={`ruling-${ruling.code}`} 
              />
              <Label htmlFor={`ruling-${ruling.code}`}>{ruling.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <main className='border rounded-xl p-3'>
        <header className='flex items-center justify-between'>
          <h4 className='text-grey text-base'>Categories</h4>
        </header>

        <section className='space-y-3 py-5'>
          {/* Map through default Conditions */}
          {defaultConditions.map((defaultCateg, index) => (
            <button
              key={index} onClick={()=>updateCategory(defaultCateg)}
              className='flex items-center gap-2 text-grey text-sm'
            >
              <Checkbox checked={defaultUsed.includes(defaultCateg)} />
              <span>{defaultCateg}</span>
            </button>
          ))}

          {/* Additional Conditions */}
          {categories.map((category, index) => (
            <button
              key={index} onClick={()=>updateCategory(category)}
              className='flex items-center gap-2 text-grey text-sm'
            >
              <span 
                className="material-symbols-outlined hover:text-red-600" 
                role='button' onClick={() => removeCategory(category)}
              >Delete</span>
              <span>{category}</span>
            </button>
          ))}

          {/* Add New Category */}
          <form onSubmit={appendCategory} className="h-[40px] w-full flex gap-2 items-center">
            <Input 
              className='border-border w-full h-full py-2 pr-1 text-sm' 
              placeholder="Custom category" 
              onChange={(e) => setForm(e.target.value)} 
              value={form}
            />
            <Button variant='outline' size='icon' className='w-[45px] h-full group' disabled={!form.trim()}>
              <span className="material-symbols-outlined group-hover:text-primary">add</span>
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}

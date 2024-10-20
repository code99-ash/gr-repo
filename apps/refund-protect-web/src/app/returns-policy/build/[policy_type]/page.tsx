'use client';
import { ReactFlowProvider } from '@xyflow/react';
import React, { useEffect } from 'react';
import SelectedPanel from '../../custom-panels/selected-panel';
import BuildOption from './build-option';
import EdittableTitle from './edittable-title';
import { Button } from '@/components/ui/button';

import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { usePolicyForm } from '@/store/policies/policy-form';

import '@xyflow/react/dist/style.css';
import { useParams } from 'next/navigation';

const accepted_types = ['duration', 'order', 'customer', 'product']

export default function ProductPolicyBuiler() {
  const params = useParams()
  const { initializeGraph } = useReactflowStore();
  const {selectedNode, setPolicyType, policy_flow} = usePolicyForm()


  useEffect(() => {
    // get policy type
    const param_type = params.policy_type as string
    const policy_type = accepted_types.includes(param_type)? params.policy_type : 'product'
    setPolicyType(policy_type)

    initializeGraph(policy_flow)
  }, [initializeGraph])

  const publishFlow = () => {
    try {
      console.log(usePolicyForm())

    }catch(err) {
      console.log(err)
    }
  }

  return (
    <section>
      <header className="flex items-center justify-between gap-2">
        <EdittableTitle />

        <Button onClick={publishFlow}>Publish</Button>
      </header>

      <main>
        <ReactFlowProvider>
          <section className="flex items-center h-[90vh] gap-1">
            <div className="w-full h-full">
              <BuildOption />
            </div>
            <nav className={`flex-none transition-all flex-none overflow-hidden h-[100vh] bg-card ${!selectedNode? 'w-0':'w-[300px]'}`}>
              <SelectedPanel />
            </nav>
          </section>
        </ReactFlowProvider>
      </main>
    </section>
  );
}

'use client';
import { ReactFlowProvider } from '@xyflow/react';
import React, { useEffect, useState } from 'react';
import SelectedPanel from '../../custom-panels/selected-panel';
import BuildOption from './build-option';
import EdittableTitle from './edittable-title';
import { Button } from '@/components/ui/button';

import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { PolicyTypes, usePolicyForm } from '@/store/policies/policy-form';

import '@xyflow/react/dist/style.css';
import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { usePolicyStore } from '@/store/policies/policy-store';

const accepted_types: PolicyTypes[] = ['duration', 'order', 'customer', 'product']

interface AwaitResponse {
  loading: boolean;
  error: any;
}

export default function ProductPolicyBuiler() {
  const params = useParams()
  const policyForm = usePolicyForm()
  const { initializeGraph } = useReactflowStore();
  const {selectedNode, setPolicyType, incomplete_nodes} = policyForm;
  const newPolicy = usePolicyStore(state => state.newPolicy)

  const [response, setResponse] = useState<AwaitResponse>({
    loading: false,
    error: null,
  })


  useEffect(() => {
    // get policy type
    const param_type = params.policy_type as PolicyTypes
    const policy_type = accepted_types.includes(param_type)? param_type : 'product'

    setPolicyType(policy_type) // policy_flow will be refreshed

    // initializeGraph(policy_flow)
  }, [initializeGraph])

  const saveToDraft = async() => {
    try {
      setResponse((prev) => ({...prev, loading: false}))

      const fd = {
        policy_flow: policyForm.policy_flow,
        data: {
          policy_name: policyForm.policy_name,
          policy_type: policyForm.policy_type,
          status: 'draft'
        }
      };
      
      
      const resp = await axiosInstance.post('/policies', JSON.stringify(fd));
      newPolicy(resp.data)
      console.log(resp)

    }catch(error) {
      setResponse((prev) => ({...prev, error}))
    } finally {
      setResponse((prev) => ({...prev, loading: false}))
    }
  }

  const publishFlow = () => {
    try {
      console.log(usePolicyForm())

    }catch(err) {
      console.log(err)
    }
  }



  return (
    <section>
      <header className="flex items-center justify-between gap-2 px-3">
        <EdittableTitle />

        <div className="flex items-center gap-2">
          {
            !response.loading? 
            <>
              <Button 
                onClick={saveToDraft} 
                className="border bg-transparent text-primary border-primary hover:bg-transparent"
              >Save to Draft</Button>
              <Button onClick={publishFlow}>Publish</Button>
            </>
            : <div className="px-3 py-2 cursor-wait rounded bg-card border border-border text-foreground">Loading...</div>
          }
        </div>
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

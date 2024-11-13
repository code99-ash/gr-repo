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
import { usePolicyStore } from '@/store/policies/policy-store';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import useResponse from '@/hooks/use-response';



const accepted_types: PolicyTypes[] = ['duration', 'order', 'customer', 'product']

export default function ProductPolicyBuiler() {
  const params = useParams()
  const router = useRouter()
  const policyForm = usePolicyForm()
  const { initializeGraph } = useReactflowStore();
  const { selectedNode, setPolicyType } = policyForm;
  const newPolicy = usePolicyStore(state => state.newPolicy)
  const { defaultResponse, errorResponse } = useResponse()

  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    
      initializePage()

  }, [initializeGraph])

  const initializePage = () => {
    const param_type = params?.policy_type as PolicyTypes
    const policy_type = accepted_types.includes(param_type)? param_type : 'product'

    setPolicyType(policy_type)
  }

  const saveToDraft = async() => {
    
    
    try {
      setLoading(true)

      const formData: any = {
        policy_flow: policyForm.policy_flow,
        policy_name: policyForm.policy_name,
        policy_type: policyForm.policy_type,
        policy_status: 'draft'
      };

      const response = await fetch('/api/policies/create', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      const data = await response.json();

      newPolicy(data)
      defaultResponse({description: "Successfully created policy"})

      router.push(`/build-success/${data.uid}`)


    }catch(error: any) {
      
      errorResponse({description: error.data})

    } finally {

      setLoading(false)

    }
  }

  return (
    <section>
      <main>
        <ReactFlowProvider>
          <section className="flex items-center h-[90vh] gap-1">
            <div className="grow h-full">
              <header className="flex items-center justify-between gap-2 px-3">

                <EdittableTitle />

                <Button 
                  onClick={saveToDraft} 
                  className="border bg-transparent text-primary border-primary hover:bg-transparent"
                  disabled={loading}
                >
                  {loading? 'Loading...' : 'Save'}
                </Button>
                
              </header>
              <BuildOption />
            </div>
            <nav className={`flex-none transition-all flex-none overflow-hidden h-[92vh] rounded-xl bg-card ${!selectedNode? 'w-0':'w-[300px]'}`}>
              <SelectedPanel />
            </nav>
          </section>
        </ReactFlowProvider>
      </main>
    </section>
  );
}

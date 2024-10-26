'use client';
import { ReactFlowProvider } from '@xyflow/react';
import React, { useEffect, useState } from 'react';
import SelectedPanel from '../../custom-panels/selected-panel';
import BuildOption from './build-option';
import EdittableTitle from './edittable-title';
import { Button } from '@/components/ui/button';

import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { PolicyTypes, usePolicyForm } from '@/store/policies/policy-form';
import { incompleteNodeDetected } from '@/lib/flow-tree-check'

import '@xyflow/react/dist/style.css';
import { useParams, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { usePolicyStore } from '@/store/policies/policy-store';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"



const accepted_types: PolicyTypes[] = ['duration', 'order', 'customer', 'product']

export default function ProductPolicyBuiler() {
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const policyForm = usePolicyForm()
  const policies = usePolicyStore(state => state.policies);
  const { initializeGraph } = useReactflowStore();
  const {selectedNode, setPolicyType, setPolicyName, setPolicyId, policy_flow } = policyForm;
  const newPolicy = usePolicyStore(state => state.newPolicy)
  const updatePolicy = usePolicyStore(state => state.updatePolicy)

  const [loading, setLoading] = useState(false)

  // Modify
  const searchParams = useSearchParams()
  const policyUID = searchParams.get('uid');

  const errorResponse = (props: any) => {
    toast({
      variant: "destructive",
      title: props.title ?? "Error Alert",
      description: props.description,
    })
  }
  const defaultResponse = (props: any) => {
    toast({
      title: props.title ?? "Success Alert",
      description: props.description,
    })
  }
  
  useEffect(() => {
    if(!policyUID) return;

    const policy = policies.find(each => each.uid === policyUID);

    if(!policy) return;

    // initializePage();

    setPolicyId(policy.id);
    setPolicyName(policy.policy_name);
    setPolicyType(policy.policy_type, policy.current_flow.policy_flow);
    // setPolicyFlow(policy.current_flow.policy_flow);




  }, [policyUID])


  useEffect(() => {
    // get policy type
    if(!policyUID) {
      initializePage()
    }

    // initializeGraph(policy_flow)
  }, [initializeGraph])

  const initializePage = () => {
    const param_type = params.policy_type as PolicyTypes
    const policy_type = accepted_types.includes(param_type)? param_type : 'product'

    setPolicyType(policy_type) // policy_flow will be refreshed
  }

  const saveToDraft = async() => {
    const request_method = policyUID? 'patch' : 'post'
    const request_path = policyUID? `/policies/${policyForm.policy_id}` : '/policies';

    try {
      setLoading(true)

      const fd: any = {
        policy_flow: policyForm.policy_flow,
        data: {
          policy_name: policyForm.policy_name,
          policy_type: policyForm.policy_type,
          status: 'draft'
        }
      };

      if(!policyUID) { // Not Editting
        fd.policy_flow = policyForm.policy_flow
      }else {
        fd.new_flow = policyForm.policy_flow
      }

      console.log(fd)
      
      
      const resp = await axiosInstance[request_method](request_path, JSON.stringify(fd));

      let description;

      if(!policyUID) {
        description = "Successfully created policy"

        newPolicy(resp.data)
        router.push(`/build-success?uid=${resp.data.uid}`)
      }else {
        description = "Successfully updated policy"

        updatePolicy(resp.data)
        router.push('/returns-policy')
      }

      defaultResponse({description})

    }catch(error: any) {
      errorResponse({description: error.response.data})
    } finally {
      setLoading(false)
    }
  }

 

  const publishFlow = async() => {
    const request_method = policyUID? 'patch' : 'post'
    const request_path = policyUID? `/policies/${policyForm.policy_id}` : '/policies';

    if(incompleteNodeDetected(policyForm.policy_flow)) {
      errorResponse({
        title: "Incomplete node(s) detected!",
        description: 'Policy with incomplete nodes cannot be published'
      })
      return;
    }

    try {
      setLoading(true)

      const fd: any = {
        policy_flow: policyForm.policy_flow,
        data: {
          policy_name: policyForm.policy_name,
          policy_type: policyForm.policy_type,
          status: 'published'
        }
      };

      if(!policyUID) { // Not Editting
        fd.policy_flow = policyForm.policy_flow
      }else {
        fd.new_flow = policyForm.policy_flow
      }
      
      
      const resp = await axiosInstance[request_method](request_path, JSON.stringify(fd));

      let description;

      if(!policyUID) {
        description = "Successfully created policy"

        newPolicy(resp.data)
        router.push(`/build-success?uid=${resp.data.uid}`)
      }else {
        description = "Successfully updated policy"

        updatePolicy(resp.data)
        router.push('/returns-policy')
      }

      defaultResponse({description})
      
      // console.log(resp)

    }catch(error: any) {
      errorResponse({description: error.response.data})
    } finally {
      setLoading(false)
    }
  }


  return (
    <section>
      {policyUID && <p className='px-3 text-foreground'>Editing - {policyUID}</p>}

      <main>
        <ReactFlowProvider>
          <section className="flex items-center h-[90vh] gap-1">
            <div className="grow h-full">
              <header className="flex items-center justify-between gap-2 px-3">
                <EdittableTitle />

                <div className="flex items-center gap-2">
                  {
                    !loading? 
                    <>
                      <Button 
                        onClick={saveToDraft} 
                        className="border bg-transparent text-primary border-primary hover:bg-transparent"
                      >{policyUID? 'Update as': 'Save to'} Draft</Button>
                      <Button onClick={publishFlow}>{policyUID? 'Update &' : ''} Publish</Button>
                    </>
                    : <div className="px-3 py-2 cursor-wait rounded bg-card border border-border text-foreground">Loading...</div>
                  }
                </div>
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

"use client";

import React, { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import SelectedPanel from '../../../custom-panels/selected-panel';
import BuildOption from '../build-option';
import EdittableTitle from '../edittable-title';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import { PolicyData, PolicyTypes, usePolicyForm } from '../../../../../../store/policies/policy-form';
import { usePolicyStore } from '../../../../../../store/policies/policy-store';
import useResponse from '../../../../../../hooks/use-response';
import { Button } from '../../../../../../components/ui/button';

export default function UpdateClient({ response_data }: { response_data: PolicyData }) {
  const router = useRouter();
  const policyForm = usePolicyForm();
  const updatePolicy = usePolicyStore((state) => state.updatePolicy);
  const { errorResponse, defaultResponse } = useResponse();
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    policyForm.setPolicy(response_data);

  }, [response_data])

  const update = async () => {
    setLoading(true);
    try {
      const formData = {
        policy_uid: policyForm.policy_uid,
        policy_flow: policyForm.policy_flow,
        policy_name: policyForm.policy_name,
      };

      const response = await fetch('/api/policies/update', {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update policy');

      const data = await response.json();

      updatePolicy(data);
      defaultResponse({ description: 'Successfully updated policy' });
      router.push('/dashboard/returns-policy');
    } catch (error: any) {
      errorResponse({ description: error.message || 'Failed to update' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p className="px-3 text-foreground">Editing - {response_data.uid}</p>
      <main>
        <ReactFlowProvider>
          <section className="flex items-center h-[90vh] gap-1">
            <div className="grow h-full">
              <header className="flex items-center justify-between gap-2 px-3">
                <EdittableTitle />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={update}
                    className="border bg-transparent text-primary border-primary hover:bg-transparent"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </header>
              <BuildOption />
            </div>
            <nav
              className={`flex-none transition-all overflow-hidden h-[92vh] rounded-xl bg-card ${
                !policyForm.selectedNode ? 'w-0' : 'w-[300px]'
              }`}
            >
              <SelectedPanel />
            </nav>
          </section>
        </ReactFlowProvider>
      </main>
    </section>
  );
}

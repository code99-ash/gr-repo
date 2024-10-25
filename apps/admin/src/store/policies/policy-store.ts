import { create } from "zustand";
import { PolicyFlow, PolicyTypes } from "./policy-form";
import { PolicyListType } from '@/store/policies/policy-store';

type PolicyStatus = 'draft' | 'published' | 'active';

export interface FlowRecord {
  policy_flow_uid: string;
  policy_name?: string;
  created_at: string;
  policy_flow: PolicyFlow
}

export interface PolicyListType {
  id: number;
  uid: string;
  organization_uid?: string;
  policy_name: string;
  policy_type: PolicyTypes;
  status: PolicyStatus;
  current_flow: FlowRecord;
  policy_history: FlowRecord[];
  deleted_at: string | null;
  updated_at: string;
  created_at: string;
  activated_at?: string;
  activated_by?: string;
}

interface PolicyState {
  fetched: boolean;
  policies: PolicyListType[],
  setPolicies: (data: PolicyListType[]) => void;
  newPolicy: (data: PolicyListType) => void;
  updatePolicy: (data: PolicyListType) => void;
}

export const usePolicyStore = create<PolicyState>((set, get) => ({
  fetched: false,
  policies: [],
  setPolicies(policies: PolicyListType[]) {
    set({ policies, fetched: true })
  },
  newPolicy(policy: PolicyListType) {
    set({
      policies: [policy, ...get().policies]
    })
  },
  updatePolicy(policy: PolicyListType) {
    set({
      policies: get().policies.map(each => (
        (each.uid === policy.uid)? {...each, ...policy} : each
      ))
    })
  },
}));

import { create } from "zustand";
import { PolicyFlow, PolicyTypes } from "./policy-form";

export type PolicyStatus = 'draft' | 'published' | 'active';

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
  policy_status: PolicyStatus;
  policy_flow: FlowRecord;
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
  updateStatus: (data: {uid: string, status: PolicyStatus}) => void;
  removePolicy: (uid: string) => void;
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
  updateStatus(policy) {
    set({
      policies: get().policies.map(each => (
        (each.uid === policy.uid)? {...each, policy_status: policy.status} : each
      ))
    })
  },
  removePolicy(policy_uid: string) {
    set({
      policies: get().policies.filter(policy => policy.uid !== policy_uid)
    })
  }
}));

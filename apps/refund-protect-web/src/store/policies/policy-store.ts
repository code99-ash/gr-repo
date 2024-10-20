import { create } from "zustand";
import { FlowTreeType } from '@/interfaces/common.interface';

interface PolicyState {
    policies: FlowTreeType[]
}

export const usePolicyStore = create<PolicyState>((set) => ({
  policies: [],
  setPolicies(policies: FlowTreeType[]) {
    set({ policies })
  }
}));

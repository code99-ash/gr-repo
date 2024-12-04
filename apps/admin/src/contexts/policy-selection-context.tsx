import { createContext } from "react";
import { PolicyListType } from "@/store/policies/policy-store";

export const SelectionCtx = createContext<{ 
    selected: any,
    policies: PolicyListType[]
}>({ selected: null, policies: [] });
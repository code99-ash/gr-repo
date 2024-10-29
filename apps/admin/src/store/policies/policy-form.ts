import { getNodeDataProps } from "@/lib/reactflow-resolver";
import { create } from "zustand";
import { BranchType } from '@/interfaces/common.interface';
import { useReactflowStore } from "../react-flow/reactflow-store";
import { OrderConditionData } from "@/interfaces/order.interface";
import { DurationConditionData } from "@/interfaces/duration.interface";
import { CustomerConditionData } from "@/interfaces/customer.interface";
import { ProductConditionData } from "@/interfaces/product.interface";

export interface MyNodeType {
    id: string;
    parent: string | null;
    node_type: INodeTypes;
    data: any;
    branches: BranchType[];
    position?: { x: number; y: number };
}

export type INodeTypes = 'user-input' | 'action' | 'conditions';
export type PolicyTypes = 'product' | 'duration' | 'customer' | 'order';

export interface PolicyFlow {
    [key: string]: MyNodeType;
}

interface PolicyFormType {
    policy_id?: number;
    policy_name: string;
    policy_type: PolicyTypes;
    policy_flow: PolicyFlow;
    setPolicyId: (id: number) => void;
    setPolicyName: (name: string) => void;
    setPolicyType: (type: PolicyTypes, existing_flow?: PolicyFlow) => void;
    setPolicyFlow: (type: PolicyFlow) => void;
    addNewNode: (node_id: string, node_type: INodeTypes, parent_id: string, label: any) => void;
    modifyNode: (node_id: string, data: any) => void;
    removeNode: (node_id: string) => void;
    clearUploadChildren: (node_id: string) => void;
    getConditionData: (policy_type: PolicyTypes) => void;
    defaultOrderCondition: () => OrderConditionData;
    defaultCustomerCondition: () => CustomerConditionData;
    defaultProductCondition: () => ProductConditionData;
    defaultDurationCondition: () => DurationConditionData;
}

interface PolicyBuildHelper {
    incomplete_nodes: string[];
    selectedNode: MyNodeType | null;
    updateIncomplete: (node_ids: string[]) => void;
    selectNode: (node: MyNodeType | null) => void;
}

export const usePolicyForm = create<PolicyFormType & PolicyBuildHelper>((set, get) => ({
    selectedNode: null,
    incomplete_nodes: [],
    policy_name: 'Returns policy builder',
    policy_type: 'product',
    policy_flow: {
        head: {
            id: 'head',
            parent: null,
            node_type: "conditions",
            data: null,
            branches: [],
        }
    },

    getConditionData(policy_type) {
        switch (policy_type) {
            case 'order':
                return get().defaultOrderCondition()
            case 'duration':
                return get().defaultDurationCondition()
            case 'customer':
                return get().defaultCustomerCondition()
            default:
                return get().defaultProductCondition()
        }      
    },

    defaultOrderCondition(): OrderConditionData {
        return {
            category: 'Discounted orders',
            operator: 'is less than',
            value: 10000
        }
    },

    defaultDurationCondition(): DurationConditionData {
        return {
            period: 'Hours',
            periodValue: 1
        }
    },

    defaultCustomerCondition(): CustomerConditionData {
        return {
            expectedPeriod: 10,
            operator: 'is less than',
            period: 'Days',
            periodValue: 2
        }
    },

    defaultProductCondition(): ProductConditionData {
        return {
            ruling: 'any',
            list: []
        }
    },

    updateIncomplete(incomplete_nodes) {
        set({ incomplete_nodes })
    },
    setPolicyId: (policy_id) => {
        set({ policy_id })
    },
    setPolicyFlow: (policy_flow) => {
        set({ policy_flow })
    },
    setPolicyName: (name) => {
        set({ policy_name: name })
    },
    setPolicyType: (type: PolicyTypes, existing_flow?: PolicyFlow) => { // resetting policy type means refreshing data

        // Refresh react-flow rendered nodes & edges
        useReactflowStore.getState().setNodes([])
        useReactflowStore.getState().setEdges([])

        const data = get().getConditionData(type);
        // console.log('policy_type', type)

        let policy_flow = existing_flow;

        if(!existing_flow) {
            policy_flow = {
                head: {
                    id: 'head',
                    parent: null,
                    node_type: "conditions",
                    data: data,
                    branches: [],
                }
            }
    
            if(type === "duration") { // Add decline action by Default
    
                const uid = new Date().getTime().toString();
                const actionNode: MyNodeType = {
                    id: uid,
                    parent: 'head',
                    node_type: "action",
                    data: {
                        action_type: "Decline",
                        message: ""
                    },
                    branches: []
                }
    
                policy_flow.head.branches = [ {node_id: uid, label: null} ]
    
                policy_flow = {
                    ...policy_flow,
                    [uid]: actionNode
                }
            }
        }

        // console.log('Before Set', policy_flow)

        set({
            selectedNode: null,
            incomplete_nodes: [],
            policy_name: `Returns policy builder - ${type}`,
            policy_type: type,
            policy_flow: policy_flow,
        })

        // console.log('After Set', policy_flow)


        useReactflowStore.getState().initializeGraph(get().policy_flow)

        // useReactflowStore.getState().layoutGraph()

        
    },

    selectNode: (node) => {
        set({ selectedNode: node })
    },
    
    addNewNode: (node_id, node_type, parent_id, label) => {

        set((state) => {
            let updated = {
                ...state.policy_flow,
                [node_id]: {
                    id: node_id,
                    parent: parent_id,
                    node_type: node_type,
                    branches: [],
                    data: getNodeDataProps(node_type),
                    position: { x: 0, y: 0 }
                }
            };
    
            if (parent_id) {
                const parentNode = updated[parent_id];
    
                updated[parent_id] = {
                    ...parentNode,
                    branches: [
                        ...parentNode.branches,
                        {
                            node_id: node_id,
                            label: label,
                        }
                    ]
                };
            }
    
            return { policy_flow: updated };
        });
    },

    modifyNode: (node_id, data) => {
        set((state) => ({
            policy_flow: {
                ...state.policy_flow,
                [node_id]: {
                    ...state.policy_flow[node_id],
                    data: {
                        ...state.policy_flow[node_id].data,
                        ...data
                    }
                }
            }
        }));
    },

    removeNode: (node_id) => {
        if (node_id === 'head') return; // Prevent removal of the "head" node
        
        set((state) => {
            const { [node_id]: nodeToRemove, ...rest } = state.policy_flow;
            const nodeParentId = nodeToRemove.parent;

            // remove from incomplete nodes if it exists;
            if(get().incomplete_nodes.includes(node_id)) {
                const filtered = get().incomplete_nodes.filter(id => id !== node_id);
                get().updateIncomplete(filtered)
            }

            // Remove node from parent branches
            if (nodeParentId) {
                const parentNode = state.policy_flow[nodeParentId];

                // Update branches of the parent node
                const updatedBranches = parentNode.branches.filter((each: BranchType) => each.node_id !== node_id);

                rest[nodeParentId] = {
                    ...parentNode,
                    branches: updatedBranches
                };
            }

            // Recursively remove child nodes
            const removeBranchNodes = (branches: BranchType[]) => {
                branches.forEach((branch) => {
                    const childNodeId = branch.node_id;
                    if (rest[childNodeId]) {
                        // remove from incomplete nodes if it exists;
                        if(get().incomplete_nodes.includes(childNodeId)) {
                            const filtered = get().incomplete_nodes.filter(id => id !== childNodeId);
                            get().updateIncomplete(filtered)
                        }
                        removeBranchNodes(rest[childNodeId].branches); // Recursively remove child branches
                        delete rest[childNodeId]; // Delete the child node
                    }
                });
            };

            // Remove all branches connected to the current node
            if(nodeToRemove.branches) {
                removeBranchNodes(nodeToRemove.branches);
            }

            // Update the graph with the modified policy_flow
            useReactflowStore.getState().initializeGraph(rest);
            useReactflowStore.getState().layoutGraph();

            return { policy_flow: rest };
        });

    },
    clearUploadChildren: (node_id) => {
        set((state) => {
            const policy_flow = state.policy_flow
            const node = policy_flow[node_id];


            // Recursively remove child nodes
            const removeBranchNodes = (branches: BranchType[]) => {
                branches.forEach((branch) => {
                    const childNodeId = branch.node_id;
                    if (policy_flow[childNodeId]) {
                        // remove from incomplete nodes if it exists;
                        if(get().incomplete_nodes.includes(childNodeId)) {
                            const filtered = get().incomplete_nodes.filter(id => id !== childNodeId);
                            get().updateIncomplete(filtered)
                        }
                        removeBranchNodes(policy_flow[childNodeId].branches); // Recursively remove child branches
                        delete policy_flow[childNodeId]; // Delete the child node
                    }
                });
            };

            // Remove all branches connected to the current node
            if(node.branches) {
                removeBranchNodes(node.branches);
            }

            // cleanup branches
            node.branches = []
            
            // Update the graph with the modified policy_flow
            useReactflowStore.getState().initializeGraph(policy_flow);
            useReactflowStore.getState().layoutGraph();

            return { policy_flow: policy_flow };
        })
    }

    
}));

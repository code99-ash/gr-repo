import { getNodeDataProps } from "@/lib/reactflow-resolver";
import { create } from "zustand";
import { BranchType } from '@/interfaces/common.interface';
import { useReactflowStore } from "../react-flow/reactflow-store";
import { OrderConditionData } from "@/interfaces/order.interface";
import { DurationConditionData } from "@/interfaces/duration.interface";
import { CustomerConditionData } from "@/interfaces/customer.interface";
import { ProductConditionData } from "@/interfaces/product.interface";
import { Edge } from "@xyflow/react";

export interface NodeObjectType {
    id: string;
    parent: string | null;
    node_type: INodeTypes;
    data: any;
    branches: BranchType[];
    position?: { x: number; y: number };
}

export type INodeTypes =    'yes_no_question' | 
                            'multiple_choice_question' | 
                            'asset_upload' | 
                            'action' | 
                            'conditions';

export type PolicyTypes = 'product' | 'duration' | 'customer' | 'order';

export interface PolicyFlow {
    [key: string]: NodeObjectType;
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
    changeNodeType: (node_id: string, node_type: INodeTypes) => void;
    addNewNode: (node_id: string, node_type: INodeTypes, parent_id: string, label: any) => void;
    modifyNode: (node_id: string, data: any, node_type?: INodeTypes) => void;
    modifyNodeBranches: (node_id: string, branches: BranchType[], edges: Edge[], isYesNo?: boolean) => void;
    removeNode: (node_id: string) => void;
    clearUploadChildren: (node_id: string) => void;
    getConditionData: (policy_type: PolicyTypes) => any;
    defaultOrderCondition: () => OrderConditionData;
    defaultCustomerCondition: () => CustomerConditionData;
    defaultProductCondition: () => ProductConditionData;
    defaultDurationCondition: () => DurationConditionData;
}

interface PolicyBuildHelper {
    incomplete_nodes: string[];
    selectedNode: NodeObjectType | null;
    updateIncomplete: (node_ids: string[]) => void;
    selectNode: (node: NodeObjectType | null) => void;
}

type PolicyState = PolicyFormType & PolicyBuildHelper

export const usePolicyForm = create<PolicyState>((set, get) => ({
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

    getConditionData(policy_type: PolicyTypes): any {
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
            category: 'discounted_orders',
            operator: 'is_less_than',
            value: 10000
        }
    },

    defaultDurationCondition(): DurationConditionData {
        return {
            period: 'hours',
            periodValue: 1
        }
    },

    defaultCustomerCondition(): CustomerConditionData {
        return {
            expectedPeriod: 10,
            operator: 'is_less_than',
            period: 'days',
            periodValue: 2
        }
    },

    defaultProductCondition(): ProductConditionData {
        return {
            ruling: 'any',
            list: []
        }
    },

    updateIncomplete(incomplete_nodes: string[]) {
        set({ incomplete_nodes })
    },
    setPolicyId: (policy_id: number) => {
        set({ policy_id })
    },
    setPolicyFlow: (policy_flow: PolicyFlow) => {
        set({ policy_flow })
    },
    setPolicyName: (name: string) => {
        set({ policy_name: name })
    },
    setPolicyType: (type: PolicyTypes, existing_flow?: PolicyFlow) => {

        // Refresh react-flow rendered nodes & edges
        useReactflowStore.getState().setNodes([])
        useReactflowStore.getState().setEdges([])

        const data = get().getConditionData(type);

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
                const actionNode: NodeObjectType = {
                    id: uid,
                    parent: 'head',
                    node_type: "action",
                    data: {
                        action_type: "decline",
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

        set({
            selectedNode: null,
            incomplete_nodes: [],
            policy_name: `Returns policy builder - ${type}`,
            policy_type: type,
            policy_flow: policy_flow,
        })

        useReactflowStore.getState().initializeGraph(get().policy_flow)
    },

    changeNodeType: (node_id: string, node_type: INodeTypes) => {
        set((state: PolicyState) => ({
            policy_flow: {
                ...state.policy_flow,
                [node_id]: {
                    ...state.policy_flow[node_id],
                    node_type
                }
            }
        }))

        console.log('In ChangeNodeType method')
        console.log({
            selected: node_id, 
            node_type: node_type
        })
        console.log(get().policy_flow)

        useReactflowStore.getState().initializeGraph(get().policy_flow);
        useReactflowStore.getState().layoutGraph();
    },

    selectNode: (node: NodeObjectType | null) => {
        set({ selectedNode: node })
    },
    
    addNewNode: (node_id: string, node_type: INodeTypes, parent_id: string, label: any) => {

        set((state: PolicyState) => {
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

    modifyNode: (node_id: string, data: any, node_type?: INodeTypes) => {
        set((state: PolicyState) => ({
            policy_flow: {
                ...state.policy_flow,
                [node_id]: {
                    ...state.policy_flow[node_id],
                    node_type: node_type ?? state.policy_flow[node_id].node_type,
                    data: {
                        ...state.policy_flow[node_id].data,
                        ...data
                    },
                }
            }
        }));
    },

    modifyNodeBranches: (node_id: string, branches: BranchType[], edges: Edge[], isYesNo?: boolean) => {
        const yesNo = isYesNo ?? false;

        set((state: PolicyState) => ({
            policy_flow: {
                ...state.policy_flow,
                [node_id]: { 
                    ...state.policy_flow[node_id], 
                    branches: branches
                }
            }
        }));

        const current_edges = useReactflowStore.getState().edges;

        const edgeMap: { [key: string]: Edge } = {};

        edges.forEach((edge) => {
            edgeMap[edge.id] = edge;
        })

        let new_edges = current_edges.map((edge) => {
            if(edgeMap.hasOwnProperty(edge.id)) {
                edge = edgeMap[edge.id]
            }
            return edge;
        })

        if(yesNo) {
            new_edges = new_edges.filter(each => !(each.source === node_id && !['Yes', 'No'].includes(each.label as string)))
  
        }

        useReactflowStore.getState().setEdges(new_edges)
        
    },

    removeNode: (node_id: string) => {
        if (node_id === 'head') return;
        
        set((state: PolicyState) => {
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
    clearUploadChildren: (node_id: string) => {
        set((state: PolicyState) => {
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

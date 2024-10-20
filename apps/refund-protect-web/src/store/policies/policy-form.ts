import { getNodeDataProps } from "@/lib/reactflow-resolver";
import { create } from "zustand";
import { BranchType } from '@/interfaces/common.interface';
import { useReactflowStore } from "../react-flow/reactflow-store";

interface MyNodeType {
    id: string;
    parent: string | null;
    node_type: NodeTypes;
    data: any;
    branches: BranchType[];
    position?: { x: number; y: number };
}

type NodeTypes = 'user-input' | 'action' | 'conditions';
type PolicyTypes = 'product' | 'duration' | 'customer' | 'order';

interface PolicyFlow {
    [key: string]: MyNodeType;
}

interface PolicyFormType {
    policy_name: string;
    policy_type: PolicyTypes;
    policy_flow: PolicyFlow;
    setPolicyName: (name: string) => void;
    setPolicyType: (type: PolicyTypes) => void;
    addNewNode: (node_id: string, node_type: NodeTypes, parent_id: string) => void;
    modifyNode: (node_id: string, data: any) => void;
    removeNode: (node_id: string) => void;
    clearUploadChildren?: (node_id: string) => void;
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
            data: {
                rule: "any",
                list: [],
            },
            branches: [],
        }
    },

    updateIncomplete(incomplete_nodes) {
        set({ incomplete_nodes })
    },
    setPolicyName: (name) => {
        set({ policy_name: name })
    },
    setPolicyType: (type) => {
        set({ policy_type: type })
    },

    selectNode: (node) => {
        set({ selectedNode: node })
    },
    
    addNewNode: (node_id, node_type, parent_id) => {

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
                            label: null,
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

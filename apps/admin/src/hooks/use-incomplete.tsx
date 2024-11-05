import { usePolicyForm } from "@/store/policies/policy-form";

export function useIncompleteNodes() {
    const updateIncomplete = usePolicyForm(state => state.updateIncomplete);
    const incomplete_nodes = usePolicyForm(state => state.incomplete_nodes);

    const recordAsIncomplete = (node_id: string) => {
        updateIncomplete([...incomplete_nodes, node_id]);
    }

    const recordAsComplete = (node_id: string) => {
        updateIncomplete(incomplete_nodes.filter(el => el !== node_id));
    }

    const validateNode = (node_id: string, nodeComplete: boolean) => {
        const alreadyIdle = incomplete_nodes.includes(node_id);
        if(nodeComplete && alreadyIdle) {
            return recordAsComplete(node_id)
        }
        if (!nodeComplete && !alreadyIdle) {
            return recordAsIncomplete(node_id)
        }
    }

    return {
        incomplete_nodes,
        recordAsComplete,
        recordAsIncomplete,
        validateNode
    }
}
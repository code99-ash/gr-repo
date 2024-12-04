import { useEffect, useState } from "react";
import { useNodeEdge } from "./use-node-edge";
import { useReactflowStore } from "@/store/react-flow/reactflow-store";


interface ConditionConfig {
    operator: '<' | '<=' | '>' | '>=' | '===';
    threshold: number
}


export function useBranchwatch(node_id: string, conditionConfig?: ConditionConfig) {

    const edges = useReactflowStore(state => state.edges);
    const { flow_node } = useNodeEdge(node_id)

    const [branch_length, setBranchLength] = useState(0);
    const [is_connectable, setIsConnectable] = useState(false);

    const evaluateCondition = (edgeCount: number) => {
        if(!conditionConfig) return true;

        const {operator, threshold} = conditionConfig;
        
        switch (operator) {
            case '<':
                return edgeCount < threshold;
            case '<=':
                return edgeCount <= threshold;
            case '>=':
                return edgeCount >= threshold;
            case '>':
                return edgeCount > threshold;
            default:
                return edgeCount === threshold;
        }
    };

    useEffect(() => {
        if(!flow_node) return;

        setBranchLength(flow_node.branches.length)

        const edgeCount = edges.filter(each => each.source === node_id).length;
        setIsConnectable(evaluateCondition(edgeCount))

    }, [flow_node, edges, node_id, evaluateCondition])

    return {
        branch_length,
        is_connectable
    }

    
}
import { usePolicyForm } from "@/store/policies/policy-form";
import { useReactflowStore } from "@/store/react-flow/reactflow-store";
import { Edge } from "@xyflow/react";
import { useEffect, useState } from "react";

export function useNodeEdge(node_id: string) {
    const edges = useReactflowStore(state => state.edges);
    const policy_flow = usePolicyForm(state => state.policy_flow);

    const flow_node = policy_flow[node_id];

    const [nodeEdge, setNodeEdge] = useState<Edge | undefined>();


    useEffect(() => {

        const edge = edges.find(each => each.source === node_id)
        setNodeEdge(edge)

    }, [edges, node_id])

    return { nodeEdge, flow_node }
}
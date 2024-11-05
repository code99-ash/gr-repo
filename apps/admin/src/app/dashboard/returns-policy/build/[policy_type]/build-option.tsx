'use client';
import { CoordinateType, getNodeDataProps } from '@/lib/reactflow-resolver';
import {
    Background,
    ConnectionState,
    Controls,
    FinalConnectionState,
    OnConnectEnd,
    ReactFlow,
    useReactFlow
} from '@xyflow/react';
import React, { useCallback, useMemo } from 'react';
import { INodeTypes, usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import { EDGE_TYPES, NODE_TYPES, NODE_TYPE_MATCH } from './utils';

interface OnCreateNodeProps {
    node_id: string; 
    new_type: INodeTypes; 
    position: CoordinateType; 
    parent_id: string;
    label: string | null;
}

interface SwitchToSelectedNodeProps {
    parent_id: string;
    node_id: string; 
    new_type: INodeTypes; 
    node_data_props: any;
    label: string | null;
    position: CoordinateType;
}

interface SwitchNodeCtxType {
    onCreateNode: (props: OnCreateNodeProps) => void;
}

export const SwitchNodeCtx = React.createContext<SwitchNodeCtxType>({
    onCreateNode: () => {}
})

export default function BuildOption() {
    const { screenToFlowPosition, getViewport } = useReactFlow();
    const { addNewNode } = usePolicyForm();
    const {
        viewport,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        addEdge,
        updateNode,
        showSelectionNode,
        setViewport
    } = useReactflowStore();

    const popupSelectionNode = useCallback((
        node_id: string,
        connectionState: ConnectionState | FinalConnectionState
    ) => {
        const parent_id = connectionState.fromNode?.id || '';
        const positions: CoordinateType = { x: 0, y: 0 };

        showSelectionNode({
            id: node_id,
            position: positions,
            parent: parent_id,
            type: 'selectNode',
            draggable: false,
            data: {
                parentId: parent_id,
                label: 'Selection Node',
                node_id,
                position: positions
            },
        });

        addEdge({
            id: node_id,
            source: parent_id,
            target: node_id,
            sourceHandle: connectionState.fromHandle?.id,
            reconnectable: 'target',
            type: 'custom',
            data: { label: null },
            style: {
                strokeWidth: 2,
                stroke: '#2A9E69'
            }
        });
    }, [addEdge, showSelectionNode]);

    const switchToSelectedNode = useCallback((props: SwitchToSelectedNodeProps) => {
        const { node_id, new_type, node_data_props, label, position, parent_id } = props;
        
        console.log({type: new_type, match: NODE_TYPE_MATCH[new_type]})
        updateNode({
            id: node_id,
            type: NODE_TYPE_MATCH[new_type],
            node_type: 'user-input',
            draggable: false,
            data: { node_id, ...node_data_props },
            label,
            position,
        });

        addNewNode(node_id, new_type, parent_id, label);
        console.log('Node switched to:', new_type);
    }, [addNewNode, updateNode]);

    const onCreateNode = useCallback(({ node_id, new_type, position, parent_id, label }: OnCreateNodeProps) => {
        const node_data_props = getNodeDataProps(new_type);
        switchToSelectedNode({ 
            node_id, 
            new_type, 
            node_data_props, 
            label, 
            position, 
            parent_id 
        });
    }, [switchToSelectedNode]);

    
    const onConnectEnd: OnConnectEnd = useCallback((event: any, connectionState: ConnectionState | FinalConnectionState) => {
        const newViewport = getViewport();
        setViewport(newViewport);

        const node_id = new Date().getTime().toString();
        popupSelectionNode(node_id, connectionState);
    }, [getViewport, setViewport, popupSelectionNode]);

    const memoizedNodeTypes = useMemo(() => NODE_TYPES, []);
    const memoizedEdgeTypes = useMemo(() => EDGE_TYPES, []);
    
    return (
        <SwitchNodeCtx.Provider value={{ onCreateNode }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnectEnd={onConnectEnd}
                nodeTypes={memoizedNodeTypes}
                defaultViewport={viewport}
                edgeTypes={memoizedEdgeTypes}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </SwitchNodeCtx.Provider>
    );
}

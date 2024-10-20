'use client';
import { getNodeDataProps, nodeTypeMatch, nodeTypes } from '@/lib/reactflow-resolver';
import { Background, ConnectionState, Controls, EdgeTypes, FinalConnectionState, MarkerType, OnConnectEnd, ReactFlow, useReactFlow } from '@xyflow/react';
import React, { useCallback } from 'react'
import { usePolicyForm } from '@/store/policies/policy-form';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';
import CustomNodeEdge from '../custom-node-edge'

export default function BuildOption() {
    const { screenToFlowPosition, getViewport } = useReactFlow();
    const { addNewNode } = usePolicyForm()
    

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


    const onCreateNode = (
        node_id: string, 
        newType: 'user-input' | 'action' | 'conditions', 
        position: any, 
        parent_id: string,
        label: 'Yes' | 'No' | null
    ) => {
        const nodeDataProps = getNodeDataProps(newType);

        // switch node for reactflow
        updateNode({
            id: node_id,
            type: nodeTypeMatch[newType],
            node_type: newType,
            draggable: false,
            data: {
                node_id,
                ...nodeDataProps,
            },
            label: label,
            position: position,
        })

        // Add node to original form;
        addNewNode(node_id, newType, parent_id)
        // console.log(node_id)
    }

    const onConnectEnd: OnConnectEnd = useCallback(
        (event: any, connectionState: ConnectionState | FinalConnectionState) => {

        if ('inProgress' in connectionState && connectionState.inProgress) {
            return;
        }

        // console.log('default viewport', viewport)
        const newViewport = getViewport()
        // console.log('current viewport', newViewport);

        setViewport(newViewport)

        if (!connectionState.isValid && connectionState.fromNode) {
    
            const node_id = new Date().getTime().toString();

            const newNode = {
                id: node_id,
                position: {x: 0, y: 0},
                parent: connectionState?.fromNode?.id,
                type: 'selectNode',
                draggable: false,
                data: {
                    parentId: connectionState?.fromNode?.id,
                    label: 'Selection Node',
                    node_id,
                    onCreateNode,
                    position: {x: 0, y: 0}
                },
            };
    
            showSelectionNode(newNode);
            addEdge({
                id: node_id,
                source: connectionState?.fromNode?.id,
                target: node_id,
                sourceHandle: connectionState.fromHandle?.id,
                reconnectable: 'target',
                type: 'custom',
                data: {
                    label: null
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#2A9E69'
                },
                style: {
                    strokeWidth: 2,
                    stroke: '#2A9E69'
                }
            })
        }
        },
        [screenToFlowPosition],
    );

    const edgeTypes: EdgeTypes = {
        custom: CustomNodeEdge
    }

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnectEnd={onConnectEnd}
            nodeTypes={nodeTypes}
            defaultViewport={viewport}
            edgeTypes={edgeTypes}
        >
            <Background />
            <Controls />
        </ReactFlow>
    );
}

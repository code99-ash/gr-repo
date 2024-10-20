import { create } from 'zustand';
import dagre from 'dagre'; // Import Dagre for layout calculation
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

import { type AppState } from './types';
import { transformEdges, transformNodes } from '@/lib/reactflow-resolver';

// Initial nodes and edges getter with checks for undefined or null values
const getInitialNodes = (option_flow: any) => option_flow ? transformNodes(option_flow) : [];
const getInitialEdges = (option_flow: any) => option_flow ? transformEdges(option_flow) : [];

export const useReactflowStore = create<AppState>((set, get) => ({
    nodes: [],
    edges: [],
    viewport: {x: 0, y: 0, zoom: 1.5},
    initializeGraph: (option_flow) => {
        console.log('initialize graph', option_flow)
        set({ nodes: getInitialNodes(option_flow), edges: getInitialEdges(option_flow) });
    },

    onNodesChange: (changes: any) => {
        // console.log('node changed', changes)

        const lastChange = changes[changes.length - 1];
        if(lastChange.type === "select") return;

        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
        get().layoutGraph(); // Call layout Graph after node changes
    },

    onEdgesChange: (changes: any) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
 
        get().layoutGraph(); // Call layoutGraph after edge changes
    },

    onConnect: (connection: any) => {
        const existingEdge = get().edges.find(
            edge => edge.source === connection.source && edge.target === connection.target
        );
        if (!existingEdge) {
            set({
                edges: addEdge(connection, get().edges),
            });
        }
 
        get().layoutGraph(); // Re-layout graph after adding a connection
    },

    setNodes: (nodes: any[]) => {
        set({ nodes });
 
        get().layoutGraph(); // Re-layout after setting nodes manually
    },

    setEdges: (edges: any[]) => {
        set({ edges });
 
        get().layoutGraph(); // Re-layout after setting edges manually
    },

    showSelectionNode: (newNode) => {
        set((state) => {
            return {
                nodes: state.nodes.concat(newNode),
            };
        });

        get().layoutGraph(); // Re-layout after adding new node
    },

    setViewport: (viewport) => {
        set({ viewport });
    },

    addEdge: (newEdge: any) => {
        const existingEdge = get().edges.find(
            edge => edge.source === newEdge.source && edge.target === newEdge.target
        );
        if (!existingEdge) {
            set({
                edges: [...get().edges, newEdge],
            });
        }
 
        get().layoutGraph(); // Re-layout after adding new edge
    },

    updateNode: (updatedNode: any) => {
        set({
            nodes: get().nodes.map(node => 
                node.id === updatedNode.id ? { 
                    ...node,
                    ...updatedNode 
                } : node
            ),
        });

        get().layoutGraph(); // Re-layout after updating node
    },

    // Dagre layoutGraph function
    layoutGraph: () => {
        const { nodes, edges, viewport } = get();
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        dagreGraph.setGraph({ rankdir: 'LR' });

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: 200, height: 100 });
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        const updatedNodes = nodes.map((node) => {
            const dagreNode = dagreGraph.node(node.id);
            return {
                ...node,
                position: {
                    x: dagreNode.x,
                    y: dagreNode.y
                },
                // Optionally, you can mark the node as positioned (if you use such a flag)
            };
        });

        set({ nodes: updatedNodes, viewport });

    }, 
}));

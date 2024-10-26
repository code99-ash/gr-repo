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
        set({ 
            nodes: getInitialNodes(option_flow), 
            edges: getInitialEdges(option_flow) 
        });
    },

    onNodesChange: (changes: any) => {

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
 
        get().layoutGraph();
    },

    setNodes: (nodes: any[]) => {
        set({ nodes });
 
        get().layoutGraph();
    },

    setEdges: (edges: any[]) => {
        set({ edges });
 
        get().layoutGraph();
    },

    showSelectionNode: (newNode) => {
        set((state) => {
            return {
                nodes: state.nodes.concat(newNode),
            };
        });

        get().layoutGraph();
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
 
        get().layoutGraph();
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

        set({
            edges: get().edges.map(edge =>
                edge.target === updatedNode.id? {
                    ...edge,
                    label: updatedNode.label,
                    data: {
                        label: updatedNode.label
                    }
                } : edge
            )
        })

        get().layoutGraph();
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
            };
        });

        set({ nodes: updatedNodes, viewport });

    }, 
}));

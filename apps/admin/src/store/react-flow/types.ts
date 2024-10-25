import { FlowNodeType, FlowTreeType } from '@/interfaces/policies.types';
import {
    type Edge,
    type Node,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
} from '@xyflow/react';

export type AppNode = Node;
export type ViewPort = {x: number, y: number, zoom: number};

export type AppState = {
    nodes: any[]; // Explicitly type nodes as Node[]
    edges: Edge[]; // Explicitly type edges as Edge[]
    viewport: ViewPort;
    setViewport: (view_port: ViewPort) => void;
    onNodesChange: OnNodesChange<any>; // Handler for node changes
    onEdgesChange: OnEdgesChange; // Handler for edge changes
    onConnect: OnConnect; // Handler for connecting nodes
    setNodes: (nodes: any[]) => void; // Setter for nodes
    setEdges: (edges: any[]) => void; // Setter for edges
    // addNode: (node_type: string, parent_id: string) => void; // Function to add a new node
    addEdge: (newEdge: Edge) => void; // Function to add a new edge
    updateNode: (updatedNode: any) => void; // Function to update an existing node
    initializeGraph: (option_flow: any) => void; // Initialize graph from form data
    layoutGraph: () => void;
    showSelectionNode: (node: any) => void;
    zoomIn?: () => void;
    zoomOut?: () => void;
};
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
    nodes: any[];
    edges: Edge[];
    viewport: ViewPort;
    setViewport: (view_port: ViewPort) => void;
    onNodesChange: OnNodesChange<any>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: any[]) => void;
    setEdges: (edges: any[]) => void;
    addEdge: (newEdge: Edge) => void;
    updateNode: (updatedNode: any) => void;
    initializeGraph: (option_flow: any) => void;
    layoutGraph: () => void;
    showSelectionNode: (node: any) => void;
    zoomIn?: () => void;
    zoomOut?: () => void;
};
import { BranchType } from '@/interfaces/common.interface';
import { MarkerType } from '@xyflow/react';
import { INodeTypes } from '@/store/policies/policy-form';
import { NODE_TYPE_MATCH } from '@/app/dashboard/returns-policy/build/[policy_type]/utils';

export const X_spacing = 300;  // Horizontal spacing
export const Y_spacing = 100;  // Vertical spacing



export const getNodeDataProps = (node_type: INodeTypes) => {
  if(node_type === 'conditions') {
    return {
      list: []
    }
  }
  else if(node_type === 'user-input') {
    return {
      input_type: 'question',
      message: '',
    }
  }
  else {
    return {
      action_type: 'Decline',
      message: ''
    }
  }
  
}

export type CoordinateType = {x: number, y: number}

function calculateNodePositions(
  flow: any, 
  node: any, 
  parentPosition: CoordinateType, 
  positions: any, 
  level: number
) {
  if (!node) return;

  // Set the base position based on the parent
  const positionX = parentPosition.x + X_spacing;
  let positionY = parentPosition.y;

  // For user-input nodes with two branches, space them vertically
  if (node.node_type === 'user-input' && node.branches.length === 2) {

    // First branch (Yes) goes up by Y_spacing, second branch (No) goes down
    node.branches.forEach((branch: BranchType, index: number) => {
      const childNode = flow[branch.node_id]; // Access child node by id
      const childPositionY = positionY + (index === 0 ? -Y_spacing : Y_spacing);
      
      // Recursively calculate the child node's position
      calculateNodePositions(flow, childNode, { x: positionX, y: childPositionY }, positions, level + 1);
    });

  } else {
    // For all other node types, including user-input with 1 branch
    node.branches.forEach((branch: BranchType, index: number) => {
      const childNode = flow[branch.node_id]; // Access child node by id
      const childPositionY = positionY + index * Y_spacing; // Default vertical spacing for other nodes

      // Recursively calculate the child node's position
      calculateNodePositions(flow, childNode, { x: positionX, y: childPositionY }, positions, level + 1);
    });
  }

  // Store the calculated position for this node
  positions[node.id] = { x: positionX, y: positionY };
}

export const createNode = (id: string, node_type: INodeTypes, parentId: string) => {
  const dataProps = getNodeDataProps(node_type);

  return {
      id,
      parent: parentId,
      node_type,
      data: {...dataProps},
      branches: [] // Initialize with empty branches; you can modify this as needed
  };
};

export const transformNodes = (flow: any) => {
  const positions: Record<string, CoordinateType> = {};

  // Initial position for the head node (root)
  const initialPosition = { x: 20, y: window.innerHeight / 2 };

  // Start positioning from the 'head' node
  calculateNodePositions(flow, flow['head'], initialPosition, positions, 0);

  // Map the flow into React Flow nodes (without position stored in the flow)
  const nodes = Object.keys(flow).map((key) => {
    const node = flow[key];
    return {
      id: node.id,
      type: NODE_TYPE_MATCH[node.node_type],
      draggable: false,
      data: {
        node_id: node.id,
        ...node.data,
        parent: node.parent,
      },
      position: positions[node.id], // Use the dynamically calculated position
    };
  });

  return nodes;
};



export const transformEdges = (flow: any) => {
  const edges = Object.keys(flow).flatMap((key) => {
    const node = flow[key];
    return node.branches?.length ? node.branches.map((branch: BranchType, index: number) => ({
      id: `${node.id}-${branch.node_id || `null`}-${index}`,
      source: node.id,
      target: branch.node_id,
      label: branch.label || null,
      type: 'custom',
      data: {
        label: branch.label || null,
      },
      reconnectable: 'target',
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
    })) : []
  })

  return edges;
}
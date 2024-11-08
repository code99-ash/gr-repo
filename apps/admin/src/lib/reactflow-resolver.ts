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
  else if(node_type === 'action') {
    return {
      action_type: 'decline',
      message: ''
    }
  }
  else {
    return {
      message: ''
    }
  }
  
}

export type CoordinateType = {x: number, y: number}

function calculateNodePositions(
  flow: any, 
  node: any, 
  parentPosition: CoordinateType, 
  positions: Record<string, CoordinateType>,
  level: number
) {
  if (!node) return;

 
  const positionX = parentPosition.x + X_spacing;
  let positionY = parentPosition.y;

  const user_input_types = ['yes_no_question', 'multiple_choice_question', 'asset_upload']

  if (user_input_types.includes(node.node_type) && node.branches.length > 1) {

    
    node.branches.forEach((branch: BranchType, index: number) => {
      const childNode = flow[branch.node_id];
      const childPositionY = positionY + (index === 0 ? -Y_spacing : Y_spacing);
      
      calculateNodePositions(flow, childNode, { x: positionX, y: childPositionY }, positions, level + 1);
    });

  } else {
  
    node.branches.forEach((branch: BranchType, index: number) => {
      const childNode = flow[branch.node_id];
      const childPositionY = positionY + index * Y_spacing;

      
      calculateNodePositions(flow, childNode, { x: positionX, y: childPositionY }, positions, level + 1);
    });
  }

  positions[node.id] = { x: positionX, y: positionY };
}

export const createNode = (id: string, node_type: INodeTypes, parentId: string) => {
  const dataProps = getNodeDataProps(node_type);

  return {
      id,
      parent: parentId,
      node_type,
      data: {...dataProps},
      branches: []
  };
};

export const transformNodes = (flow: any) => {
  const positions: Record<string, CoordinateType> = {}; 

 
  const initialPosition = { x: 20, y: window.innerHeight / 2 };

  
  calculateNodePositions(flow, flow['head'], initialPosition, positions, 0);

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
      position: positions[node.id] as CoordinateType,
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

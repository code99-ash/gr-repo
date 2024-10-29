import { EdgeTypes } from '@xyflow/react';
import CustomNodeEdge from "../custom-node-edge";
import RootConditionNode from '../../custom-nodes/condition-node/root-cond-node';
import ActionNode from '../../custom-nodes/action-node';
import SelectNode from '../../custom-nodes/select-node';
import UserInputNode from '../../custom-nodes/userinput-node';

export const EDGE_TYPES: EdgeTypes = {
    custom: CustomNodeEdge
}

export const NODE_TYPES = { 
    conditionNode: RootConditionNode,
    userInputNode: UserInputNode,
    actionNode: ActionNode,
    selectNode: SelectNode
}

export const NODE_TYPE_MATCH: Record<string, string> = {
    'conditions': 'conditionNode',
    'user-input': 'userInputNode',
    'action'    : 'actionNode',
    'select'    : 'selectNode'
}
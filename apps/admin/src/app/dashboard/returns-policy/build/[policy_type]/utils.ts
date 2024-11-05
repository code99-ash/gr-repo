import { EdgeTypes } from '@xyflow/react';
import CustomNodeEdge from "../custom-node-edge";
import RootConditionNode from '../../custom-nodes/condition-node/root-cond-node';
import ActionNode from '../../custom-nodes/action-node';
import SelectNode from '../../custom-nodes/select-node';
import UserInputNode from '../../custom-nodes/userinput-node';
import YesNoQuestionNode from '../../custom-nodes/userinput-node/yes_no_node';

export const EDGE_TYPES: EdgeTypes = {
    custom: CustomNodeEdge
}

export const NODE_TYPES = { 
    conditionNode: RootConditionNode,
    yesNoQuestionNode: YesNoQuestionNode,
    userInputNode: UserInputNode,
    actionNode: ActionNode,
    selectNode: SelectNode
}

export const NODE_TYPE_MATCH: Record<string, string> = {
   'conditions': 'conditionNode',
    'yes_no_question': 'yesNoQuestionNode',
    'multiple_choice_question': 'userInputNode',
    'asset_upload': 'userInputNode',
    'action'    : 'actionNode',
    'select'    : 'selectNode'
}
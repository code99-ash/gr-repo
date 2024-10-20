import { ActionTypeEnum, BaseNodeType } from "./common.interface";

export type ProductFlowType = ProductConditionType | UserInputType | ProductActionType

enum InputType {
    Question = 'question',
    Upload = 'upload',
}

enum AssetActionTypeEnum {
    AIReview = 'AI Review',
    ManualReview = 'Manual Review',
}

export interface ProductConditionType extends BaseNodeType {
    data: {
        ruling: 'any' | 'all'
        list: string[]
    }
}

export interface UserInputType extends BaseNodeType {
    data: {
        input_type: InputType;
        message: string;
    };
}

export interface ProductActionType extends BaseNodeType {
    data: {
        action_type: ActionTypeEnum;
        message?: string;
    };
}


export interface AssetActionType extends BaseNodeType {
    data: {
        action_type: AssetActionTypeEnum;
        message?: string;
    };
}

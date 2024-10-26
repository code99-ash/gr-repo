import { ActionTypeEnum, BaseNodeType } from "./common.interface";

export type ProductFlowType = ProductConditionType | ProductDataType | ProductActionType

enum AssetActionTypeEnum {
    AIReview = 'ai_review',
    ManualReview = 'manual_review',
}

export interface ProductConditionData {
    ruling: 'any' | 'all'
    list: string[]
}

export interface ProductConditionType extends BaseNodeType {
    data: ProductConditionData
}

export interface ProductDataType extends BaseNodeType {
    data: {
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

import { ActionTypeEnum, BaseNodeType } from "./common.interface";

export interface DurationConditionData {
    period: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years'
    periodValue: number
} 

export interface DurationConditionType extends BaseNodeType {
    data: DurationConditionData
}

export interface DurationActionType extends BaseNodeType {
    data: {
        action_type: ActionTypeEnum;
        message?: string;
    };
}
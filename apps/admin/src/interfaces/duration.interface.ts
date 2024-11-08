import { ActionTypeEnum, BaseNodeType } from "./common.interface";

export interface DurationConditionData {
    period: 'hours' | 'days' | 'weeks' | 'months' | 'years'
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
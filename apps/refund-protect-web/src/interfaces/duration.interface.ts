import { ActionTypeEnum, BaseNodeType } from "./common.interface";

export interface DurationConditionType extends BaseNodeType {
    data: {
        period: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years'
        periodValue: number
    }
}

export interface OrderActionType extends BaseNodeType {
    data: {
        action_type: ActionTypeEnum;
        message?: string;
    };
}
import { BaseNodeType } from "./common.interface";

export interface CustomerConditionType extends BaseNodeType {
    data: {
        expected: number;
        operator: 'is less than';
        period: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years'
        periodValue: number
    }
}

enum CustomerActionTypeEnum {
    AcceptRefund = 'Accept Refund',
    AcceptExchange = 'Accept Exchange',
    Decline = 'Decline',
}

export interface CustomerActionType extends BaseNodeType {
    data: {
        action_type: CustomerActionTypeEnum;
        message?: string;
    };
}
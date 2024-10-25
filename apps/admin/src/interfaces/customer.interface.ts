import { BaseNodeType } from "./common.interface";

export interface CustomerConditionData {
    expectedPeriod: number;
    operator: 'is less than';

    // Dont think this is necessary
    period: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years'
    periodValue: number
}

export interface CustomerConditionType extends BaseNodeType {
    data: CustomerConditionData
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
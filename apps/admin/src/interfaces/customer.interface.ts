import { BaseNodeType } from "./common.interface";

export interface CustomerConditionData {
    expectedPeriod: number;
    operator: 'is_less_than';

    // Dont think this is necessary
    period: 'hours' | 'days' | 'weeks' | 'months' | 'years'
    periodValue: number
}

export interface CustomerConditionType extends BaseNodeType {
    data: CustomerConditionData
}

enum CustomerActionTypeEnum {
    AcceptRefund = 'accept_refund',
    AcceptExchange = 'accept_exchange',
    Decline = 'decline',
}

export interface CustomerActionType extends BaseNodeType {
    data: {
        action_type: CustomerActionTypeEnum;
        message?: string;
    };
}
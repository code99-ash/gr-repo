import { ActionTypeEnum, BaseNodeType } from "./common.interface";

export interface OrderConditionType extends BaseNodeType {
    data: {
        categories: 'Discounted Orders' | 'Orders without discounts' | 'Order value';
        operator: 'is less than' | 'is greater than';
        value: number
    }
}

export interface OrderActionType extends BaseNodeType {
    data: {
        action_type: ActionTypeEnum;
        message?: string;
    };
}
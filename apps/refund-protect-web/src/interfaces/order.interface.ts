import { ActionTypeEnum, BaseNodeType } from "./common.interface";

export type OrderCategoryType = 'Discounted orders' | 'Orders without discounts' | 'Order value';
export type OrderConstraint = 'is less than' | 'is greater than'

export interface OrderConditionData  {
    category: OrderCategoryType;
    operator: OrderConstraint;
    value: number
}

export interface OrderConditionType extends BaseNodeType {
    data: OrderConditionData
}

export interface OrderActionType extends BaseNodeType {
    data: {
        action_type: ActionTypeEnum;
        message?: string;
    };
}
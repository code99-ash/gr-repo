import { ActionTypeEnum, BaseNodeType } from "./common.interface";

export type OrderCategoryType = 'discounted_orders' | 'orders_without_discounts' | 'order_value';
export type OrderConstraint = 'is_less_than' | 'is_greater_than'

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
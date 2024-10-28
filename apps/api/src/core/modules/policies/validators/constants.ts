export const condition_operators = {
    customer: ['is less than'] as const,
    order:['is less than', 'is greater than'] as const
}

export const action_types = [
    // 'AI Review',
    'decline',
    'accept_exchange',
    'accept_refund',
    'manual_review',
    'accept_exchange_or_refund'
] as const;

export const node_types = [
    'conditions',
    'action',
] as const;

export const product_node_types = [
    ...node_types,
    'yes_no_question',
    'multiple_choice_question',
    'asset_upload',
] as const;

export const periods = [
    'hours',
    'days',
    'weeks',
    'months',
    'years',
] as const;

export const order_category = [
    'discounted_orders',
    'orders_without_discounts',
    'order_value',
] as const;
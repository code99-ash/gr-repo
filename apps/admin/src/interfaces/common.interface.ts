export type FlowTypes = 'product' | 'customer' | 'order' | 'duration'

export interface BaseNodeType {
    id: string;
    parent: string;
    position?: { x: number, y: number };
    node_type: 'yes_no_question' | 'multiple_choice_question' | 'asset_upload' | 'action' | 'conditions';
    branches: BranchType[];
}

export interface BranchType {
    node_id: string;
    label: string | null;
}

export interface FlowTreeType {
    id: string | number;
    policy_name: string;
    policy_type: FlowTypes;
    incomplete_nodes: string[];
    policy_flow: {
        [key: string]: BaseNodeType;
    }
}

export enum ActionTypeEnum {
    Decline = 'decline',
    AIReview = 'ai_review',
    ManualReview = 'manual_review',
    AcceptRefund = 'accept_refund',
    AcceptExchange = 'accept_exchange',
}
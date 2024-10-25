export type FlowTypes = 'product' | 'customer' | 'order' | 'duration'

export interface BaseNodeType {
    id: string;
    parent: string;
    position?: { x: number, y: number };
    node_type: 'user-input' | 'action' | 'conditions';
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
    policy_flow: any
}

// export 

export enum ActionTypeEnum {
    Decline = 'Decline',
    AIReview = 'AI Review',
    ManualReview = 'Manual Review',
    AcceptRefund = 'Accept Refund',
    AcceptExchange = 'Accept Exchange',
}
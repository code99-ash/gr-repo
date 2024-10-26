import { node_types, product_node_types } from "../constants";

export type NodeType = {
    node_type: typeof node_types[number];
    branches: Array<{ node_id: string }>;
    data: any;
};

export type ProductNodeType = {
    node_type: typeof product_node_types[number];
    data: any;
    branches: Array<{ node_id: string }>;
};

export const validateConditionBranch = (node: any) => {
    const { node_type, branches } = node;

    if (node_type === 'conditions' && branches.length < 1) {
        return false; 
    }

    return true;
};

export const validateProductNodeBranch = (node: any) => {
    const { node_type, branches } = node;

    switch (node_type) {
        case 'conditions':
            return branches.length >= 1;  
        case 'yes_no_question':
            return branches.length === 2;
        case 'multiple_choice_question':
            return branches.length >= 2;
        case 'asset_upload':
            return branches.length === 1;
        default:
            return true;
    }
}


export const transformUndefinedValues = (data: any) => {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return [key, Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined))];
            }
            return [key, value];
        })
    );
}

export function validatePolicyRecord(
    record: Record<string, NodeType | ProductNodeType>,
    getValidatorForNodeType: (nodeType: string) => any
): boolean {
    const nodeIds = new Set(Object.keys(record));

    for (const [nodeId, node] of Object.entries(record)) {
        const typedNode = node as NodeType;

    
        const dataValidator = getValidatorForNodeType(typedNode.node_type);
        const validationResult = dataValidator.safeParse(typedNode.data);
        
        if (!validationResult.success) {
            console.error(`Validation error details for node "${nodeId}": ${JSON.stringify(validationResult.error.issues)}`);
            throw new Error(`Data validation failed for node ID "${nodeId}": ${validationResult.error}`);
        }

        if (typedNode.branches) {
            for (const branch of typedNode.branches) {
                if (!nodeIds.has(branch.node_id)) {
                    throw new Error(`Branch node_id "${branch.node_id}" does not exist in the record for node ID "${nodeId}"`);
                }
            }
        }
    }

    return true;
}
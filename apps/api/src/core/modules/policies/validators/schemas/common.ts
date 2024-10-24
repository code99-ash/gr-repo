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
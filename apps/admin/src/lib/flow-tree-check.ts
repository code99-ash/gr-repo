
import { PolicyFlow, NodeObjectType } from '@/store/policies/policy-form';

export const productConditionInvalid = (policy_flow: PolicyFlow) => {
    const head: NodeObjectType = policy_flow.head;
    console.log('head', head)
    return !head.data || head.data.list.length < 1 || head.branches.length < 1
}

export const userInputInvalid = (policy_flow: PolicyFlow) => {
    const user_inputs = ['yes_no_question', 'multiple_choice_question', 'asset_upload']

    const user_inputs_nodes = Object.values(policy_flow).filter((each: NodeObjectType) => user_inputs.includes(each.node_type));

    console.log('lib/flow-tree-check.ts: user_inputs', user_inputs_nodes)

    switch(user_inputs_nodes.length) {
        case 0:
            return true;
    }

    const invalids = new Array<NodeObjectType>();

    user_inputs_nodes.forEach((input: NodeObjectType) => {
        switch(input.node_type) {
            case 'yes_no_question':
            case 'multiple_choice_question':
                if (input.branches.length < 2 || !input.data.message?.trim()) invalids.push(input);
                break;
            case 'asset_upload':
                if (input.branches.length < 1 || !input.data.message?.trim()) invalids.push(input);
                break;
        }
    })

    return invalids.length > 0;
}

export const incompleteNodeDetected = (policy_flow: PolicyFlow) => {
    return productConditionInvalid(policy_flow) || userInputInvalid(policy_flow);
}
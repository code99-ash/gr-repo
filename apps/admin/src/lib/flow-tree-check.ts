
import { PolicyFlow, MyNodeType } from '@/store/policies/policy-form';
import { UserInputType } from '@/interfaces/product.interface';

export const productConditionInvalid = (policy_flow: PolicyFlow) => {
    const head: MyNodeType = policy_flow.head;
    console.log('head', head)
    return !head.data || head.data.list.length < 1 || head.branches.length < 1
}

export const userInputInvalid = (policy_flow: PolicyFlow) => {
    const user_inputs = Object.values(policy_flow).filter((each: MyNodeType) => each.node_type === 'user-input');
    console.log('user_inputs', user_inputs)

    return user_inputs.some((input: MyNodeType) => (
        input.branches.length < 1 || 
        (input.data.input_type === 'question' && input.branches.length < 2) ||
        (input.data.input_type === 'question' && !input.data.message?.trim())
    ))
}

export const incompleteNodeDetected = (policy_flow: PolicyFlow) => {
    return productConditionInvalid(policy_flow) || userInputInvalid(policy_flow);
}
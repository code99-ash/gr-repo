import { PolicyData } from '../../../../../../store/policies/policy-form';
import UpdateClient from './update-client';

export interface InitialDataProps {
  response_data: PolicyData;
}

interface CtxProp {
  params: {
    policy_uid: string;
  }
}

export default async function UpdatePolicyPage(context: CtxProp) {
  
  const policy_uid = context.params?.policy_uid as string;

  console.log('policy_uid', policy_uid)

  const response = await fetch(`${process.env.NEST_API_URL}/policies/${policy_uid}`, {
    cache: 'no-store'
  });
  if(!response.ok) {
    throw new Error('Failed to fetch policy data');
  }
  const data = await response.json();

  return (
    <UpdateClient response_data={data.data} />
  )
 
};

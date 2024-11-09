import { notFound } from 'next/navigation';
import { PolicyData } from '../../../../../../store/policies/policy-form';
import UpdateClient from './update-client';

export interface InitialDataProps {
  response_data: PolicyData;
}

interface CtxProp {
  params: {
    policy_uid: string;
  };
}

export default async function UpdatePolicyPage(context: CtxProp) {
  const policy_uid = context.params?.policy_uid;

  console.log('policy_uid', policy_uid);

  const response = await fetch(`${process.env.NEST_API_URL}/policies/${policy_uid}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.log('response', response.status);
    notFound();
  }

  const data = await response.json();

  return <UpdateClient response_data={data.data} />;
}

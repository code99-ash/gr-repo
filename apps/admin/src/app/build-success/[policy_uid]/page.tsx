import React from 'react'
import BuildSuccess from './success';
import { CtxProp } from '../../dashboard/returns-policy/build/[policy_type]/[policy_uid]/page';
import { notFound } from 'next/navigation';


export default async function BuildSuccessPage(context: CtxProp) {
    const policy_uid = context.params?.policy_uid;

    const response = await fetch(`${process.env.NEST_API_URL}/policies/${policy_uid}`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        notFound();
    }

    const resp = await response.json();

    return <BuildSuccess policy={resp.data} />
}

"use client";

import React from 'react'
import { Product } from '../interfaces';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import PolicyAssignment from '../components/products/policy-assignment';

export default function ProductView({data}: {data: Product}) {

  const policy_names = data.product_policies.map(each => each.policy.policy_name);

  const updatePolicies = () => {
    window.location.reload()
  }

  return (
    <section className="md:px-6 space-y-5">
      <header className="flex items-center justify-between gap-2 border-b pb-2">
        <h3 className='text-lg text-primary satoshi-medium'>{data.id}</h3>

        <PolicyAssignment 
          button={<Button className='bg-primary hover:bg-primary text-white'>Assign policy</Button>}
          product_id={data.id}
          product_policies={data.product_policies}
          updatePolicies={updatePolicies}
        />
    
      </header>

      <main className="space-y-5">
        {/* <h1 className='text-foreground satoshi-medium text-xl'>Product Details</h1> */}

        <div className="space-y-5 text-base overflow-x-scroll">
          <div className='flex items-center gap-2'>
            <Label className="text-base satoshi-medium">Product Name:</Label>
            {data.title}
          </div>


          <div className='flex flex-col gap-2'>
            <Label className="text-base satoshi-medium">Images:</Label>
            <div className="flex items-center gap-2">
              {
                data.images.map((each, index) => (
                  <div className='w-[120px] h-[120px] rounded-md overflow-hidden' key={index}>
                    <Image
                      src={each.src}
                      alt=""
                      width={120}
                      height={120}
                    />
                  </div>
                ))
              }
            </div>
          </div>

          <div className=''>
            <Label className="text-base satoshi-medium mr-2">Returns Policies:</Label>
            {
              !data.product_policies.length ? <span>No Returns Policy Assigned</span> :
              <span>{policy_names.join(', ')}</span>
            }
          </div>
        </div>
      </main>
    </section>
  )
}

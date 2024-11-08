'use client';
import React, { useMemo } from 'react'
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePolicyStore } from '@/store/policies/policy-store';


const darkThemes = ['system', 'dark']
export default function BuildSuccess() {
    const {theme} = useTheme()
    const searchParams = useSearchParams()
    const policies = usePolicyStore(state => state.policies)
    const router = useRouter()

    const uid = searchParams.get('uid')

    const policy = useMemo(() => {
      return policies.find(each => each.uid === uid);
    }, [uid])

    return (
      <section className="grid grid-cols-5 h-[100vh] bg-background">
          <main className='col-span-5 lg:col-span-3 py-20 px-5 xl:px-0'>
            <section className="max-w-[700px] mx-auto">
              <Image
                  alt="logo"
                  className=''
                  src={`/images/${theme && darkThemes.includes(theme)? 'logo-green-white.svg':'logo.svg'}`}
                  width={160}
                  height={60}
              />

              <div className='mt-10'>
                <Image
                    alt="logo"
                    className='mb-3'
                    src="/images/success-check.png"
                    width={160}
                    height={160}
                />
                <div className="space-y-1 mb-10">
                  <p>Your <span className="satoshi-bold">'{policy?.policy_name}' </span>
                  {policy?.policy_type} policy has been published successfully!</p>
                  <p>Would you like to add more conditions to your Returns policy?</p>
                </div>
                <div className="flex flex-col gap-y-4 items-start">
                  <button 
                    className='bg-primary text-white satoshi-medium text-base rounded-md px-[12px] py-[8px]'
                    onClick={() => router.push(`/returns-policy/build/${policy?.policy_type}?uid=${uid}`)}  
                  >
                    Add other conditions
                  </button>
                  <button 
                    className='border-primary text-primary border satoshi-medium px-[12px] py-[8px] text-base rounded-md bg-transparent' onClick={() => router.push('/dashboard')}>
                    Return to your Business Dashboard 
                  </button>
                </div>
              </div>
            </section>
          </main>
          <main className='hidden lg:inline lg:col-span-2 bg-[#0A5231]'></main>
      </section>
    )
}

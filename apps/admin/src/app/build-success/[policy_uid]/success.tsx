"use client";

import { PolicyData } from "@/store/policies/policy-form";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BuildSuccess({policy}: {policy: PolicyData}) {
    const router = useRouter()

    const navigate = (path: string) => {
      router.push(path)
    }

    return (
        <section className="grid grid-cols-5 h-[100vh] bg-background">
            <main className='col-span-5 lg:col-span-3 py-20 px-5 xl:px-0'>
              <section className="max-w-[700px] mx-auto">
                <Image
                    alt="logo"
                    className=''
                    src={`/images/logo.svg`}
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
                    <p>Your <span className="satoshi-bold">&apos;{policy.policy_name}&apos;</span>
                    {policy.policy_type} policy has been published successfully!</p>
                    <p>Would you like to add more conditions to your Returns policy?</p>
                  </div>
                  <div className="flex flex-col gap-y-4 items-start">
                    <button 
                      className='bg-primary text-white satoshi-medium text-base rounded-md px-[12px] py-[8px]'
                      onClick={() => navigate(`/dashboard/returns-policy/build/${policy.policy_type}/${policy.uid}`)}  
                    >
                      Add other conditions
                    </button>
                    <button 
                      className='border-primary text-primary border satoshi-medium px-[12px] py-[8px] text-base rounded-md bg-transparent' onClick={() => navigate('/dashboard')}>
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
'use client';

import Image from 'next/image'
import React from 'react'

export default function EmptyData() {
  return (
    <div className="py-10 flex flex-col items-center justify-center gap-1">
        <Image 
            src='/images/empty.png'
            alt=""
            width={200}
            height={200}
            className='md:w-[400px] opacity-50'
        />
        <p className='text-sm md:text-base text-foreground satoshi-medium'>No policy data</p>
    </div>
  )
}

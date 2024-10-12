'use client';
import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import { useThinNavStore } from '@/store/thinNavStore';

export default function UserLogoutCard() {
    const thinNav = useThinNavStore(state => state.thinNav)
  return (
    <div className={
        `flex items-center justify-between py-2 px-2 gap-2 border-border rounded-xl
        ${thinNav?'':'border'}`
    }>
        {!thinNav && <>
                <Image 
                    src="/images/avatar.png" 
                    alt="" 
                    width={30} 
                    height={30} 
                    className='rounded-full'
                />
                <div className='text-foreground'>
                    <p className='text-sm satoshi-medium'>Vee Adams</p>
                    <p className='opacity-70 text-xs'>Admin</p>
                </div>
            </>
        }
        <Button variant={thinNav? "destructive":"ghost"}>
            <span className="material-symbols-outlined text-sm">logout</span>
        </Button>
    </div>
  )
}

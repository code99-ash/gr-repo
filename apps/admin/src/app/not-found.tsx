"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Custom404() {
    const router = useRouter();

    return (
        <div className='flex flex-col h-[100vh] justify-center items-center gap-5 text-center px-2'>
            <h1 className='text-5xl md:text-7xl xl:text-9xl text-destructive satoshi-bold'>404</h1>
            <div className='space-y-1'>
                <h1 className="text-xl md:text-2xl text-foreground satoshi-medium">Oops... Something's missing.</h1>
                <p className="text-sm md:text-base xl:text-xl satoshi-light text-foreground">
                    Sorry we can't find what you are looking for, you might want to go back to the&nbsp;
                    <Link href="/dashboard" className="text-primary">dashboard</Link>.
                </p>
            </div>
        </div>
    )
}
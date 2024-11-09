'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginAds from './ads';
import LoginForm from './login-form';
import { useAuth } from '@/contexts/auth-context';
import { LoaderCircle } from 'lucide-react';
import './login.css';

export default function Login() {
    const router = useRouter();
    const auth = useAuth();

 
    useEffect(() => {
        if (auth && auth.user && !auth.loading) {
            router.push('/dashboard');
        }
    }, [auth, router]);
    

    if(auth?.loading){
        return <div className="flex h-[100vh] w-full bg-[#FAFAFA]">
            <main className="login-main">
                <div className="max-w-[550px] mx-auto w-full flex justify-center items-center">
                    <LoaderCircle className='animate-spin' />
                </div>
            </main>
        </div>
    }

    return (
        <div className="flex h-[100vh] w-full bg-[#FAFAFA]">
            <main className="login-main">
                <div className="max-w-[550px] mx-auto w-full">
                    <img 
                        src="/images/logo.svg"
                        alt="logo"
                        className='mb-5 md:mb-0 -ml-2'
                    />
                </div>
                <div className='h-full w-full max-w-[550px] mx-auto flex flex-col md:justify-center gap-y-5'>

                    <div className="space-y-5">
                        <header className="flex flex-col text-center md:text-left">
                            <h3 className="satoshi-medium text-xs md:text-base">
                                Manage your Refunds, Returns and Exchange seamlessly
                            </h3>
                        </header>

                        <section className="sm:px-16 md:px-0">
                            <div className="bg-white border px-5 md:px-10 py-5 md:pt-12 md:pb-5 rounded-2xl mb-3">
                                <header className='mb-4'>
                                    <h1 className='satoshi-bold text-base'>Log in</h1>
                                    <p className="satoshi text-xs md:text-sm">
                                        Enter your details below to log into your account
                                    </p>
                                </header>

                                <LoginForm />
                            </div>
                        </section>
                    </div>

                    <p className='text-sm text-center md:text-left md:text-base satoshi-medium'>
                        Don’t have an account?
                        &nbsp;<Link href="/signup" className='text-primary font-bold'>Book a demo</Link>
                    </p>
                </div>
            </main>
            <LoginAds />
        </div>
    );
}

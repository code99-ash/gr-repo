'use client';
import React, { useMemo } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { usePolicyStore } from '@/store/policies/policy-store';


const policyOptions = [
    {
        icon: 'local_mall',
        label: 'Product',
        href: '/returns-policy/build/product',
    },
    {
        icon: 'schedule',
        label: 'Duration',
        href: '/returns-policy/build/duration',
    },
    {
        icon: 'group',
        label: 'Customer',
        href: '/returns-policy/build/customer',
    },
    {
        icon: 'shopping_cart',
        label: 'Order',
        href: '/returns-policy/build/order',
    },
];

export default function ReturnPolicy() {
    const { theme } = useTheme();
    const policies = usePolicyStore(state => state.policies)

    // Dynamic border color based on theme
    const borderClass = useMemo(() => {
        return theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200';
    }, [theme]);

    return (
        <section className="space-y-5">
            <header className={`flex items-center justify-between gap-2 md:px-3 pb-3 border-b ${borderClass}`}>
                <h1 className="text-foreground text-xl md:text-2xl satoshi-bold">
                    Returns Policy Builder
                </h1>

                <div className="flex items-center gap-2 satoshi-medium">
                    <button className="bg-primary text-white px-4 py-2 rounded-md">
                        Pick a policy template
                    </button>

                    {/* Replace the Build from scratch button with NavigationMenu */}
                    <NavigationMenu className='policy-dropdown'>
                        <NavigationMenuList className="">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="border border-primary text-primary px-4 py-2 rounded-md bg-background dark:bg-transparent hover:text-primary">
                                    Build from scratch
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex flex-col space-y-2 p-3">
                                        {policyOptions.map((option) => (
                                            <Link key={option.label} href={option.href} legacyBehavior passHref>
                                                <NavigationMenuLink
                                                    className="w-full flex items-center gap-2 p-2 text-foreground hover:bg-primary hover:text-white rounded-md"
                                                >
                                                    <span 
                                                        className="material-symbols-outlined"
                                                        style={{fontSize: '16px'}}    
                                                    >{option.icon}</span>
                                                    <span>{option.label}</span>
                                                </NavigationMenuLink>
                                            </Link>
                                        ))}
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>

                        <NavigationMenuViewport className='w-full' />
                    </NavigationMenu>
                </div>
            </header>

            <main>
                {policies.length < 1 && (
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
                )}
            </main>
        </section>
    );
}

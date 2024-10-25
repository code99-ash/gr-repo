'use client';
import React from 'react'
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

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

export default function PolicyTypeMenu() {
  return (
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
  )
}

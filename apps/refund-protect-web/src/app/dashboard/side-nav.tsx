'use client';
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import './layout.css';
import UserLogoutCard from '@/components/user-logout-card';

const top_navs = [
    {
        label: 'Dashboard', 
        href: '/dashboard', 
        icon: 'grid_view'
    },
    {
        label: 'Requests', 
        href: '/dashboard/requests', 
        icon: 'description'
    },
    {
        label: 'Returns Policy', 
        href: '/returns-policy', 
        icon: 'autorenew'
    },
    {
        label: 'My Products', 
        href: '/dashboard/products', 
        icon: 'local_mall'
    },
]
const btm_navs = [
    {
        label: 'Account', 
        href: '/dashboard/account', 
        icon: 'person'
    },
    {
        label: 'Support', 
        href: '/dashboard/support', 
        icon: 'help'
    },
]

export default function SideNav() {
    const pathname = usePathname();
    return <>
        <div className='p-3'>
            <Image
                alt="client-logo"
                className='mx-auto'
                src="/images/client-logo.png"
                width={160}
                height={60}
            />
        </div>
        <section className="grow flex flex-col justify-between gap-1">
            <nav className="flex flex-col gap-y-1 mt-2 text-foreground">
                {
                    top_navs.map((nav, i) => (
                        <Link
                            key={i}
                            href={nav.href}
                            className={`side-link ${pathname===nav.href? 'active':''}`}
                        >
                            <span className="material-symbols-outlined">{nav.icon}</span>
                            <span>{nav.label}</span>
                        </Link>
                    ))
                }
            </nav>
            <nav className="flex flex-col gap-y-1 mt-2 text-foreground pb-2">
                {
                    btm_navs.map((nav, i) => (
                        <Link
                            key={i}
                            href={nav.href}
                            className={`side-link bottom ${pathname===nav.href? 'active':''}`}
                        >
                            <span className="material-symbols-outlined">{nav.icon}</span>
                            <span>{nav.label}</span>
                        </Link>
                    ))
                }
                <UserLogoutCard />
            </nav>
        </section>
    </>
}

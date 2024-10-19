'use client';
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import './layout.css';
import { useTheme } from 'next-themes';
import UserLogoutCard from '@/components/user-logout-card';

const top_navs = [
    {
        label: 'Dashboard', 
        href: '/dashboard', 
        icon: 'grid_view'
    },
    {
        label: 'Returns Policy', 
        href: '/returns-policy', 
        icon: 'autorenew'
    },
]


export default function SideBar() {
    const pathname = usePathname();
    const { theme } = useTheme()
    return <>
        <div className='p-3'>
            <Image
                alt="logo"
                className='mx-auto'
                src={`/images/${theme==='dark'? 'logo-green-white.svg':'logo.svg'}`}
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
            <nav className="flex flex-col gap-y-1 mt-2 text-foreground px-3 pb-2">
                <UserLogoutCard />
            </nav>
        </section>
    </>
}

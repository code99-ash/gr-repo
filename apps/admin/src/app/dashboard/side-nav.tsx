'use client';
import React, { useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import UserLogoutCard from '@/components/user-logout-card';

import { LayoutDashboard, RefreshCw, ShoppingBag, HandHelping, UserCog } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import './layout.css';

const top_navs = [
    {
        title: 'Dashboard', 
        href: '/dashboard', 
        icon: LayoutDashboard
    },
    {
        title: 'Requests', 
        href: '/dashboard/requests', 
        icon: HandHelping
    },
    {
        title: 'Returns Policy', 
        href: '/dashboard/returns-policy', 
        icon: RefreshCw
    },
    {
        title: 'My Products', 
        href: '/dashboard/products', 
        icon: ShoppingBag
    },
]
const btm_navs = [
    {
        title: 'Account', 
        href: '/dashboard/account', 
        icon: UserCog
    },
    {
        title: 'Support', 
        href: '/dashboard/support', 
        icon: RefreshCw
    },
]

export default function SideNav() {
    const pathname = usePathname();
    const { openMobile, setOpenMobile } = useSidebar()

    React.useEffect(() => {

        if(openMobile) {
            setOpenMobile(false)
        } 

    }, [pathname, setOpenMobile]);

    return <>
        <Sidebar variant='sidebar' collapsible='icon'>
            <SidebarHeader>
                <Image
                    alt="logo"
                    className='-ml-1'
                    src="/images/logo.svg"
                    width={160}
                    height={60}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className='px-0 pt-1'>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {top_navs.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={item.href}
                                        className={`w-full py-[25px] border-l-2  ${pathname===item.href? 'text-primary border-primary':'border-background'}`}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className='px-1'>
                <SidebarContent>
                    <SidebarGroup className='px-0'>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {btm_navs.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.href}
                                            className={`w-full py-[25px] border-l-2  ${pathname===item.href? 'text-primary border-primary':'border-background'}`}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <UserLogoutCard />
                        </SidebarMenu>
                    </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </SidebarFooter>
        </Sidebar>
    </>
}

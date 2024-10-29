'use client';
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './layout.css';
import { useTheme } from 'next-themes';
import UserLogoutCard from '@/components/user-logout-card';

import { LayoutDashboard, RefreshCw } from "lucide-react"
 
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
} from "@/components/ui/sidebar"

const nav_items = [
    {
        title: 'Dashboard', 
        href: '/dashboard', 
        icon: LayoutDashboard
    },
    {
        title: 'Returns Policy', 
        href: '/returns-policy', 
        icon: RefreshCw
    },
]


export default function AppSidebar() {
    const pathname = usePathname();
    const { theme } = useTheme()
    return <>
        <Sidebar variant='sidebar' collapsible='icon'>
            <SidebarHeader>
                <Image
                    alt="logo"
                    className='mx-auto'
                    src={`/images/${theme==='dark'? 'logo-green-white.svg':'logo.svg'}`}
                    width={160}
                    height={60}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className='px-0 pt-5'>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {nav_items.map((item) => (
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
            <SidebarFooter>
                <UserLogoutCard />
            </SidebarFooter>
        </Sidebar>
    </>
}

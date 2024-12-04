'use client';
import React from 'react'
import AppSideNav from './side-nav';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function DashboardLayout({children}: Readonly<{ children: React.ReactNode }>) {
    
    return (
        <SidebarProvider>
            <div className='w-full flex flex-1'>
                <AppSideNav />
                <section className='flex flex-col grow bg-accent p-1'>
                    <header className="flex-none h-[45px] flex items-center justify-between">
                        <SidebarTrigger />
                    </header>
                    <div className='grow py-3'>{children}</div>
                </section>
            </div>
        </SidebarProvider>
    )
}

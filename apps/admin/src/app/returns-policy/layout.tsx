'use client';
import React from 'react'
import { ModeToggle } from '@/components/mode-toggle';
import { Toaster } from "@/components/ui/toaster"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from './app-side-bar';


export default function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className='w-full flex h-[100vh]'>
                <AppSidebar />
                <section className='flex flex-col grow bg-accent p-1'>
                    <header className="flex-none h-[45px] flex items-center justify-between">
                        <SidebarTrigger />
                        <ModeToggle />
                    </header>
                    <div className='grow py-3'>{children}</div>
                    <Toaster />
                </section>
            </div>
        </SidebarProvider>
    )
}

'use client';
import React, { useMemo, useState } from 'react'
import { ModeToggle } from '@/components/mode-toggle';
import SideBar from './side-bar';


export default function DashboardLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const [thinNav, setThinNav] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const manageClass = useMemo(() => {
        if(mobileOpen) { // top priority: thin nav will be overlooked if mobileNav is opened
            return 'w-[220px] fixed top-0 left-0 shadow-xl md:relative top-auto left-auto shadow-none'
        }else {
            if(thinNav) {
                return 'w-0 md:w-14 thin-nav'
            }else {
                return 'w-0 md:w-[220px] relative'
            }
        }

    }, [thinNav, mobileOpen])

    return (
        <div className='flex h-[100vh]'>
            <div className={`transition-all overflow-hidden flex flex-col gap-2 h-full bg-background ${manageClass}`}>
                <SideBar />
            </div>
            <section className='flex flex-col grow bg-accent p-1'>
                <header className="flex-none h-[45px] flex items-center justify-between">
                    <button className="hidden md:inline" onClick={() => setThinNav(!thinNav)}>
                        <span className="material-symbols-outlined">menu_open</span>
                    </button>
                    <ModeToggle />
                    <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                        <span className="material-symbols-outlined md:hidden">menu</span>
                    </button>
                </header>
                <div className='grow py-3'>{children}</div>
            </section>
        </div>
    )
}

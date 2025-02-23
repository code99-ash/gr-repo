'use client';
import Image from 'next/image';
import React from 'react'

import { LogOut } from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { Card } from './ui/card';
import { useAuth } from '@/contexts/auth-context';


export default function UserLogoutCard() {
    const {user} = useAuth() || { user: null }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Card className="flex items-center justify-between py-7 px-4 rounded-full border hover:border-destructive">
                    <div className="flex items-center gap-2">
                        <Image 
                            src="/images/avatar.png" 
                            alt="" 
                            width={30} 
                            height={30} 
                            className='rounded-full'
                        />
                        <div className='text-foreground'>
                            <p className='text-sm satoshi-medium'>
                                { user && `${user.first_name} ${user.last_name}` }
                            </p>
                            <p className='opacity-70 text-xs'>Admin</p>
                        </div>
                    </div>
                    
                    <LogOut size={33} />
                </Card>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

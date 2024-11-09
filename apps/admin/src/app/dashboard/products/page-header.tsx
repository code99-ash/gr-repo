import React from 'react'
import { Button } from '@/components/ui/button';

export default function PageHeader() {
    
    return (
        <header className="flex items-center justify-between gap-2 md:px-3 pb-3 border-b border-neutral-200">
            <h1 className="text-foreground text-xl md:text-2xl satoshi-bold">
                Product Catalogue
            </h1>

            <div className="flex items-center gap-2 satoshi-medium">
                <Button className="bg-neutral-400 hover:bg-neutral-400 saturate-50 text-white">
                    Assign Policy
                </Button>               
            </div>
        </header>
  )
}
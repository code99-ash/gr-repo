import React from 'react'
import PolicyTypeMenu from './policy-type-menu';
import ChangePolicyStatus from './change-status';


export default function PageHeader() {
    
    return (
        <header className="flex items-center justify-between gap-2 md:px-3 pb-3 border-b">
            <h1 className="text-foreground text-xl md:text-2xl satoshi-bold">
                Returns Policy Builder
            </h1>

            <div className="flex items-center gap-2 satoshi-medium">
                <button className="bg-primary text-white px-4 py-2 rounded-md">
                    Pick a policy template
                </button>

                <ChangePolicyStatus />
                <PolicyTypeMenu />
            </div>
        </header>
  )
}

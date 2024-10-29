import React, { useMemo } from 'react'
import PolicyTypeMenu from './policy-type-menu';
import { useTheme } from 'next-themes';

export default function PageHeader() {
    const { theme } = useTheme();

    // Dynamic border color based on theme
    const borderClass = useMemo(() => {
        return theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200';
    }, [theme]);

    return (
        <header className={`flex items-center justify-between gap-2 md:px-3 pb-3 border-b ${borderClass}`}>
            <h1 className="text-foreground text-xl md:text-2xl satoshi-bold">
                Returns Policy Builder
            </h1>

            <div className="flex items-center gap-2 satoshi-medium">
                <button className="bg-primary text-white px-4 py-2 rounded-md">
                    Pick a policy template
                </button>

                {/* Replace the Build from scratch button with NavigationMenu */}
                <PolicyTypeMenu />
            </div>
        </header>
  )
}

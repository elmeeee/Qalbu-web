'use client'

import { ReactNode } from 'react'
import { usePWAMode } from '@/hooks/use-pwa-mode'
import { BottomNav } from '@/components/pwa'

interface PWALayoutProps {
    children: ReactNode
}

/**
 * Layout wrapper that shows bottom navigation when in PWA mode
 */
export function PWALayout({ children }: PWALayoutProps) {
    const isPWA = usePWAMode()

    return (
        <>
            {/* Main content with bottom padding when PWA mode is active */}
            <div className={isPWA ? 'pb-20' : ''}>
                {children}
            </div>

            {/* Bottom navigation - only shown in PWA mode */}
            {isPWA && <BottomNav />}
        </>
    )
}

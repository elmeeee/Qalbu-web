'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if the app is running in PWA (installed) mode
 * @returns boolean indicating if app is in PWA mode
 */
export function usePWAMode() {
    const [isPWA, setIsPWA] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const checkPWA = () => {
            // Check if running in standalone mode (installed PWA)
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches

            // Check for iOS PWA
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
            const isIOSPWA = isIOS && (window.navigator as any).standalone === true

            // Check for Android PWA
            const isAndroidPWA = window.matchMedia('(display-mode: standalone)').matches

            // Check for query param override (for testing)
            const isQueryOverride = new URLSearchParams(window.location.search).get('pwa') === 'true'

            const pwaMode = isStandalone || isIOSPWA || isAndroidPWA || isQueryOverride

            setIsPWA(pwaMode)

            // Log for debugging
            console.log('PWA Mode Detection:', {
                isStandalone,
                isIOS,
                isIOSPWA,
                isAndroidPWA,
                finalPWAMode: pwaMode
            })
        }

        checkPWA()

        // Listen for display mode changes
        const mediaQuery = window.matchMedia('(display-mode: standalone)')
        const handleChange = () => checkPWA()

        mediaQuery.addEventListener('change', handleChange)

        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    // Return false during SSR
    if (!mounted) return false

    return isPWA
}

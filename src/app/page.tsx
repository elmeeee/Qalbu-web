'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePWAMode } from '@/hooks/use-pwa-mode'

// Dynamic imports with loading states
const PWAHome = dynamic(() => import('@/components/home/pwa-home'), {
    loading: () => <div className="min-h-screen bg-background" />,
    ssr: false // PWA mode is client-side only detection anyway
})

const WebHome = dynamic(() => import('@/components/home/web-home'), {
    loading: () => <div className="min-h-screen bg-background" />
})

export default function HomePage() {
    const [mounted, setMounted] = useState(false)
    const isPwa = usePWAMode()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="min-h-screen bg-background" />
    }

    if (isPwa) {
        return <PWAHome />
    }

    return <WebHome />
}

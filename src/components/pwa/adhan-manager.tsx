'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { getNextPrayer } from '@/lib/api/prayer-times'
import { Bell, BellOff, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' // Assuming sonner or use standard alert

export function AdhanManager() {
    const { prayerTimes } = usePrayerTimes()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [lastPlayedPrayer, setLastPlayedPrayer] = useState<string | null>(null)

    useEffect(() => {
        // Initialize Audio with simple settings
        audioRef.current = new Audio('/audio/adhan.mp3')
        audioRef.current.preload = 'auto'

        if ('Notification' in window) {
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.error('This browser does not support desktop notification')
            return
        }

        const result = await Notification.requestPermission()
        setPermission(result)

        if (result === 'granted') {
            new Notification('Adhan Enabled', {
                body: 'You will receive notifications for prayer times.',
                icon: '/icons/icon-192x192.png'
            })
        }
    }

    // Check for prayer times
    useEffect(() => {
        if (!prayerTimes?.timings) return

        const checkInterval = setInterval(() => {
            const now = new Date()
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

            // Find if any prayer matches current time
            // We use a small window (e.g., current minute)

            Object.entries(prayerTimes.timings).forEach(([name, time]) => {
                // time is HH:MM
                if (time === currentTime) {
                    // Check if already played for this specific prayer today
                    // Use a combination of Date + PrayerName to be unique
                    const playKey = `${now.toDateString()}-${name}`

                    if (localStorage.getItem('lastAdhan') !== playKey) {
                        playAdhan(name)
                        localStorage.setItem('lastAdhan', playKey)
                    }
                }
            })

        }, 10000) // Check every 10 seconds

        return () => clearInterval(checkInterval)
    }, [prayerTimes])

    const playAdhan = (prayerName: string) => {
        // 1. Play Audio
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(e => console.error('Error playing adhan:', e))
        }

        // 2. Send Notification
        if (permission === 'granted') {
            // Service Worker Notification (Better for PWA)
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(`Time for ${prayerName}`, {
                        body: 'Hayya \'ala-s-Salah (Come to Prayer)',
                        icon: '/icons/icon-192x192.png',
                        vibrate: [200, 100, 200],
                        tag: 'adhan-notification',
                        requireInteraction: true // Keeps notification visible
                    })
                })
            } else {
                // Fallback standard notification
                new Notification(`Time for ${prayerName}`, {
                    body: 'Hayya \'ala-s-Salah (Come to Prayer)',
                    icon: '/icons/icon-192x192.png',
                })
            }
        }
    }

    // Render a hidden element or a small control if needed.
    // Ideally this component is headless but we can return null.
    // For debugging/permission, we might want to expose a button somewhere else, 
    // but here we can just return null or a hidden controls for testing.
    return null
}

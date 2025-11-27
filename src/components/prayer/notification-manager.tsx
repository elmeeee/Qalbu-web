'use client'

import { useEffect, useRef } from 'react'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { getNextPrayer } from '@/lib/api/prayer-times'
import { useLanguage } from '@/contexts/language-context'

export function NotificationManager() {
    const { prayerTimes } = usePrayerTimes()
    const { t } = useLanguage()
    const lastNotificationRef = useRef<string | null>(null)

    useEffect(() => {
        // Request permission on mount
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }
    }, [])

    useEffect(() => {
        if (!prayerTimes?.timings) return

        const checkPrayerTimes = () => {
            if (Notification.permission !== 'granted') return

            const now = new Date()
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

            // Check if current time matches any prayer time
            Object.entries(prayerTimes.timings).forEach(([name, time]) => {
                // API returns time like "05:30", sometimes with seconds or timezone, but usually HH:MM
                // We need to be careful with format. Assuming HH:MM based on previous file views.
                // Let's normalize just in case.
                const cleanTime = time.split(' ')[0].substring(0, 5)

                if (cleanTime === currentTime && lastNotificationRef.current !== name) {
                    // Send notification
                    new Notification(`Time for ${name}`, {
                        body: `It is now time for ${name} prayer.`,
                        icon: '/icons/qalbuIcon.png',
                        badge: '/icons/qalbuIcon.png',
                        tag: 'prayer-notification'
                    })

                    // Play adhan sound
                    try {
                        const audio = new Audio('/audio/adhan.mp3')
                        audio.play().catch(e => console.error('Error playing adhan:', e))
                    } catch (error) {
                        console.error('Failed to initialize audio:', error)
                    }

                    lastNotificationRef.current = name
                }
            })
        }

        const interval = setInterval(checkPrayerTimes, 1000 * 60) // Check every minute
        checkPrayerTimes() // Check immediately

        return () => clearInterval(interval)
    }, [prayerTimes])

    return null
}

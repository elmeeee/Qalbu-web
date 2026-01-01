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
            if (typeof window === 'undefined' || !('Notification' in window)) return
            // We can play sound even if notification permission is not granted, if the user is in the app? 
            // The prompt implies "notif suara adzan" (notification sound of adzan).
            // Let's keep the sound playing logic independent of permission if possible, or keep it as is.
            // The original code returned if permission !== granted.
            // But for "suara" (sound), we might want it even if visual notifications are blocked?
            // User request: "pastikan ketika waktu prayer tiba langsung notif suara adzan bro"
            // "di android di ios setiap buka app malah adzan"

            // Allow sound even if notifications are not granted/default, as long as we are in the app?
            // But let's stick to the structure but fix the repetition issue first.

            const now = new Date()
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
            const todayStr = now.toDateString()

            // Check if current time matches any prayer time
            Object.entries(prayerTimes.timings).forEach(([name, time]) => {
                const cleanTime = (time as string).split(' ')[0].substring(0, 5)

                if (cleanTime === currentTime) {
                    // Check if already notified today for this prayer
                    const storageKey = 'qalbu-last-notification'
                    const stored = localStorage.getItem(storageKey)
                    let alreadyNotified = false

                    if (stored) {
                        try {
                            const parsed = JSON.parse(stored)
                            if (parsed.prayer === name && parsed.date === todayStr) {
                                alreadyNotified = true
                            }
                        } catch (e) {
                            console.error('Error parsing notification storage', e)
                        }
                    }

                    if (!alreadyNotified && lastNotificationRef.current !== name) {
                        // Send notification
                        if (Notification.permission === 'granted') {
                            new Notification(`Time for ${name}`, {
                                body: `It is now time for ${name} prayer.`,
                                icon: '/icons/qalbuIcon.png',
                                badge: '/icons/qalbuIcon.png',
                                tag: 'prayer-notification'
                            })
                        }

                        // Play adhan sound
                        if (typeof window !== 'undefined' && 'Audio' in window) {
                            try {
                                const audio = new Audio('/audio/adhan.mp3')
                                audio.play().catch(e => console.error('Error playing adhan:', e))
                            } catch (error) {
                                console.error('Failed to initialize audio:', error)
                            }
                        }

                        // Save to storage and ref
                        lastNotificationRef.current = name
                        localStorage.setItem(storageKey, JSON.stringify({
                            prayer: name,
                            date: todayStr,
                            timestamp: Date.now()
                        }))
                    }
                }
            })
        }

        // Check more frequently (every 10 seconds) to ensure we catch it "directly"
        const interval = setInterval(checkPrayerTimes, 10000)
        checkPrayerTimes() // Check immediately on mount too

        return () => clearInterval(interval)
    }, [prayerTimes])

    return null
}

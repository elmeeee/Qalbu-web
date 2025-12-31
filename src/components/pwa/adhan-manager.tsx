'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { useLanguage } from '@/contexts/language-context'

// Prayer names that should trigger adhan (exclude Sunrise)
const ADHAN_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export function AdhanManager() {
    const { prayerTimes } = usePrayerTimes()
    const { t } = useLanguage()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Initialize Audio
        audioRef.current = new Audio('/audio/adhan.mp3')
        audioRef.current.preload = 'auto'

        if ('Notification' in window) {
            setPermission(Notification.permission)
        }

        // Audio Unlocker for iOS (one-time)
        const unlockAudio = () => {
            if (audioRef.current) {
                audioRef.current.play().then(() => {
                    audioRef.current?.pause()
                    audioRef.current!.currentTime = 0
                }).catch(() => { })
                document.removeEventListener('click', unlockAudio)
                document.removeEventListener('touchstart', unlockAudio)
            }
        }

        document.addEventListener('click', unlockAudio, { once: true })
        document.addEventListener('touchstart', unlockAudio, { once: true })

        return () => {
            document.removeEventListener('click', unlockAudio)
            document.removeEventListener('touchstart', unlockAudio)
        }
    }, [])

    const playAdhan = useCallback((prayerName: string) => {
        console.log(`🕌 Playing Adhan for ${prayerName}`)

        // 1. Play Audio
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(e => {
                console.error('Error playing adhan:', e)
                // Fallback: try to play again after user interaction
            })
        }

        // 2. Send Notification
        if (permission === 'granted') {
            // Prayer name translations
            const prayerTranslations: Record<string, { id: string, ar: string }> = {
                'Fajr': { id: 'Subuh', ar: 'الفجر' },
                'Dhuhr': { id: 'Dzuhur', ar: 'الظهر' },
                'Asr': { id: 'Ashar', ar: 'العصر' },
                'Maghrib': { id: 'Maghrib', ar: 'المغرب' },
                'Isha': { id: 'Isya', ar: 'العشاء' }
            }

            const translation = prayerTranslations[prayerName] || { id: prayerName, ar: '' }
            const title = `🕌 Waktu Sholat ${translation.id}`
            const body = `حَيَّ عَلَى الصَّلَاةِ • Hayya 'alash-shalah\nMari segera menunaikan sholat ${translation.id}`

            // Service Worker Notification (Better for PWA)
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, {
                        body: body,
                        icon: '/icons/icon-192x192.png',
                        badge: '/icons/icon-72x72.png',
                        tag: 'adhan-notification',
                        requireInteraction: true,
                        silent: false, // Allow sound
                        data: { prayerName, time: new Date().toISOString() }
                    } as NotificationOptions)
                })
            } else {
                // Fallback standard notification
                new Notification(title, {
                    body: body,
                    icon: '/icons/icon-192x192.png',
                    silent: false
                })
            }

            // Vibrate pattern (long-short-long pattern like adhan rhythm)
            if ('vibrate' in navigator) {
                navigator.vibrate([400, 100, 200, 100, 400])
            }
        }
    }, [permission])

    // Debug: Expose playAdhan to window for testing
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore - For debugging only
            window.testAdhan = (prayerName = 'Fajr') => {
                console.log('🧪 Testing Adhan notification...')
                playAdhan(prayerName)
            }
            console.log('🧪 Debug: Use window.testAdhan("Fajr") to test notifications')
        }
    }, [playAdhan])

    // Check for prayer times - IMPROVED
    useEffect(() => {
        if (!prayerTimes?.timings) {
            console.log('⏰ No prayer times available yet')
            return
        }

        // Log all prayer times on mount
        console.log('🕌 Prayer Times Loaded:', {
            Fajr: prayerTimes.timings.Fajr,
            Dhuhr: prayerTimes.timings.Dhuhr,
            Asr: prayerTimes.timings.Asr,
            Maghrib: prayerTimes.timings.Maghrib,
            Isha: prayerTimes.timings.Isha,
        })

        // Clear any existing interval
        if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current)
        }

        const checkPrayerTime = () => {
            const now = new Date()
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()
            const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`

            console.log(`⏰ Current time: ${currentTime}`)

            // Check each prayer time (excluding Sunrise)
            ADHAN_PRAYERS.forEach((prayerName) => {
                const prayerTime = prayerTimes.timings[prayerName as keyof typeof prayerTimes.timings]

                if (!prayerTime) {
                    console.warn(`⚠️  ${prayerName} time not found`)
                    return
                }

                // Extract hour and minute from prayer time (format: "HH:MM" or "HH:MM (TIMEZONE)")
                const timeOnly = prayerTime.split(' ')[0] // Remove timezone if present
                const [prayerHour, prayerMinute] = timeOnly.split(':').map(Number)

                // Validate parsed time
                if (isNaN(prayerHour) || isNaN(prayerMinute)) {
                    console.error(`Invalid time format for ${prayerName}: ${prayerTime}`)
                    return
                }

                const formattedPrayerTime = `${prayerHour.toString().padStart(2, '0')}:${prayerMinute.toString().padStart(2, '0')}`

                // Check if current time matches prayer time
                if (currentHour === prayerHour && currentMinute === prayerMinute) {
                    // Create unique key for today's prayer
                    const today = now.toDateString()
                    const playKey = `${today}-${prayerName}`
                    const lastAdhan = localStorage.getItem('lastAdhan')

                    // Only play if not already played today for this prayer
                    if (lastAdhan !== playKey) {
                        console.log(`✅ MATCH! Playing Adhan for ${prayerName} at ${formattedPrayerTime}`)
                        playAdhan(prayerName)
                        localStorage.setItem('lastAdhan', playKey)
                    } else {
                        console.log(`⏭️  Already played Adhan for ${prayerName} today`)
                    }
                } else {
                    // Log upcoming prayers (within next 5 minutes)
                    const currentTotalMinutes = currentHour * 60 + currentMinute
                    const prayerTotalMinutes = prayerHour * 60 + prayerMinute
                    const minutesUntil = prayerTotalMinutes - currentTotalMinutes

                    if (minutesUntil > 0 && minutesUntil <= 5) {
                        console.log(`⏳ ${prayerName} in ${minutesUntil} minute(s) at ${formattedPrayerTime}`)
                    }
                }
            })
        }

        // Check immediately
        checkPrayerTime()

        // Then check every minute (60 seconds)
        checkIntervalRef.current = setInterval(checkPrayerTime, 60000)

        console.log('✅ Adhan checker started - will check every minute')

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current)
                console.log('🛑 Adhan checker stopped')
            }
        }
    }, [prayerTimes, playAdhan])

    // Auto-request permission on first load if not set
    useEffect(() => {
        if (permission === 'default' && 'Notification' in window) {
            // Wait a bit before asking (better UX)
            const timer = setTimeout(() => {
                Notification.requestPermission().then(result => {
                    setPermission(result)
                    if (result === 'granted') {
                        new Notification('Qalbu Adhan Enabled', {
                            body: 'You will receive notifications for prayer times.',
                            icon: '/icons/icon-192x192.png'
                        })
                    }
                })
            }, 3000) // Ask after 3 seconds

            return () => clearTimeout(timer)
        }
    }, [permission])

    return null
}

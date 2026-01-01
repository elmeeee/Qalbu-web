'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { MapPin, Loader2, Volume2 } from 'lucide-react'
import { getTimeUntil } from '@/lib/utils'
import { getNextPrayer } from '@/lib/api/prayer-times'
import { useLanguage } from '@/contexts/language-context'

const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

// Solid icons for the list view
const getPrayerIcon = (name: string) => {
    return (
        <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-20" />
            <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-6.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 17.66l-1.41-1.41M6.34 6.34l-1.41-1.41" />
        </svg>
    )
}

export function PrayerTimesWidgetPWA() {
    const { prayerTimes, isLoading, error, coordinates, locationName } = usePrayerTimes()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null)
    const [timeRemaining, setTimeRemaining] = useState('')
    const [progress, setProgress] = useState(0)
    const { t } = useLanguage()

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (prayerTimes?.timings) {
            const next = getNextPrayer(prayerTimes.timings)
            setNextPrayer(next)
        }
    }, [prayerTimes, currentTime])

    useEffect(() => {
        if (nextPrayer && prayerTimes?.timings) {
            const updateTimer = () => {
                const now = new Date()
                const timings = prayerNames.map(name => ({
                    name,
                    time: prayerTimes.timings[name as keyof typeof prayerTimes.timings]
                }))

                // Find next prayer index (excluding Sunrise from "next prayer" check if api excludes it, 
                // but for progress calc we might want to respect the sequence)
                // getNextPrayer returns one of 5 prayers.

                // Parse Next Prayer Time
                const [nextHours, nextMinutes] = nextPrayer.time.split(':').map(Number)
                let nextDate = new Date()
                nextDate.setHours(nextHours, nextMinutes, 0, 0)

                // If next prayer is tomorrow (e.g. Fajr when now is night)
                // We need to be careful. The getNextPrayer logic returns Fajr if no prayers left today.
                // But we don't know for sure if it's tomorrow's Fajr just by name unless we compare/check.
                // Assuming getNextPrayer returns correct time string which is usually just HH:MM.
                // If now > nextDate, then nextDate must be tomorrow
                if (now > nextDate) {
                    nextDate.setDate(nextDate.getDate() + 1)
                }

                // Identify Previous Time Point
                // We use the full list including Sunrise for cleaner progress visualization
                let prevTimeStr = null

                // Find index of next prayer in the full list
                const nextIndex = prayerNames.indexOf(nextPrayer.name)

                if (nextIndex > 0) {
                    prevTimeStr = prayerTimes.timings[prayerNames[nextIndex - 1] as keyof typeof prayerTimes.timings]
                } else {
                    // If Next is Fajr (index 0), Prev is Isha (index 5) of Yesterday
                    prevTimeStr = prayerTimes.timings['Isha']
                }

                let prevDate = new Date()
                if (prevTimeStr) {
                    const [prevHours, prevMinutes] = prevTimeStr.split(':').map(Number)
                    prevDate.setHours(prevHours, prevMinutes, 0, 0)

                    // Adjust dates to ensure prev < next
                    // If prev > next (wrapping midnight), move prev back a day? 
                    // Or if next is tomorrow, and prev is today (Isha), it works.
                    // Case: Next=Fajr (Tomorrow), Prev=Isha (Today). 
                    // nextDate > now. prevDate (today Isha) might be < or > now.
                    // If now is 23:00, Isha was 20:00 (Today), Fajr is 05:00 (Tomorrow).
                    // prevDate (20:00) < nextDate (tomorrow 05:00). Correct.

                    // Case: Next=Asr (15:00), Prev=Dhuhr (12:00). Correct.

                    // Adjust prevDate if it's after nextDate (shouldn't happen with logic above usually)
                    if (prevDate > nextDate) {
                        prevDate.setDate(prevDate.getDate() - 1)
                    }

                    // Special check: If we are wrapping around midnight
                    if (nextPrayer.name === 'Fajr' && prevDate > now && now.getHours() < 12) {
                        // We are in early morning before Fajr.
                        // Next is Fajr (Today 05:00). Prev is Isha (Yesterday 20:00).
                        // Our parsing made Prev 20:00 Today.
                        prevDate.setDate(prevDate.getDate() - 1)
                    }
                }

                const totalDuration = nextDate.getTime() - prevDate.getTime()
                const elapsed = now.getTime() - prevDate.getTime()

                const percent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
                setProgress(percent)
                setTimeRemaining(getTimeUntil(nextDate))
            }

            updateTimer()
            const timer = setInterval(updateTimer, 60000)
            return () => clearInterval(timer)
        }
    }, [nextPrayer, prayerTimes])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    if (!prayerTimes) return null

    const prayers = prayerNames.map((name) => ({
        name,
        time: prayerTimes.timings[name as keyof typeof prayerTimes.timings],
    }))

    const displayLocation = locationName
        ? [locationName.city, locationName.country].filter(Boolean).join(', ')
        : coordinates
            ? `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`
            : t.prayer.unknown

    // Gauge Calculations
    const radius = 85
    const circumference = Math.PI * radius // Semi-circle arc length (approx)
    // Actually using a path 'A' command is easier for semi-circle
    // Path for semi-circle: M x-r y A r r 0 1 1 x+r y
    // Center (128, 128) -> Radius 85 
    // Start (43, 128), End (213, 128) -> Top arc

    // We will use strokeDasharray for animation simply
    // A full circle path with circumference C. We want 50% only.
    // Let's use standard circle with rotation.

    const strokeWidth = 14
    const center = 120
    const gaugeRadius = 90

    // Calculate arc based progress
    // We want the arc to cover top 180 degrees (-180 to 0 ? or 180 to 360?).
    // Standard Gauge: 180 degrees.
    // SVG Path: M 30 120 A 90 90 0 0 1 210 120
    // L ~ 283 (PI * 90)
    const arcPathLength = Math.PI * gaugeRadius
    const dashOffset = arcPathLength - (arcPathLength * progress / 100)

    return (
        <div className="space-y-6">
            {/* Top Section: Beautiful Arc Gauge */}
            {nextPrayer && (
                <div className="relative flex flex-col items-center pt-6 pb-2">

                    <div className="relative w-[280px] h-[140px] flex justify-center overflow-hidden">
                        {/* SVG Gauge */}
                        <svg className="absolute top-0 w-full h-[280px]" viewBox="0 0 280 280">
                            {/* Defs for Glow */}
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#34d399" />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Background Arc */}
                            <path
                                d="M 40 125 A 100 100 0 0 1 240 125"
                                fill="none"
                                stroke="currentColor"
                                className="text-slate-200 dark:text-slate-800"
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                            />

                            {/* Progress Arc */}
                            <motion.path
                                d="M 40 125 A 100 100 0 0 1 240 125"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                initial={{ strokeDasharray: Math.PI * 100, strokeDashoffset: Math.PI * 100 }}
                                animate={{ strokeDashoffset: Math.PI * 100 - (Math.PI * 100 * progress / 100) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                style={{ strokeDasharray: Math.PI * 100 }}
                                filter="url(#glow)"
                            />
                        </svg>

                        {/* Centered Content */}
                        <div className="absolute bottom-0 flex flex-col items-center justify-end z-10 w-full text-center">
                            <motion.span
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl font-bold text-slate-800 dark:text-white tracking-tighter tabular-nums mb-1"
                            >
                                {nextPrayer.time}
                            </motion.span>
                            <div className="flex items-center gap-1.5 justify-center mt-2 opacity-60">
                                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                                    {displayLocation.split(',')[0]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Next Prayer Pill */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6"
                    >
                        <div className="bg-emerald-500 text-white px-6 py-2.5 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                            <span className="text-sm font-bold">{nextPrayer.name}</span>
                            <span className="text-emerald-200/50">|</span>
                            <span className="text-sm font-medium">in {timeRemaining}</span>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Prayer List */}
            <div className="space-y-3 px-1">
                {prayers.map((prayer, index) => {
                    const isNext = nextPrayer?.name === prayer.name
                    const isSunrise = prayer.name === 'Sunrise'

                    return (
                        <motion.div
                            key={prayer.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.3 }}
                            className={`relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${isNext
                                ? 'bg-white dark:bg-slate-800 shadow-xl shadow-emerald-500/5 border-l-4 border-l-emerald-500'
                                : 'bg-white/60 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${isNext
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-400 dark:text-indigo-400'
                                    }`}>
                                    {getPrayerIcon(prayer.name)}
                                </div>

                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${isNext ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {prayer.name}
                                    </span>
                                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${isNext ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                        {isNext ? 'Next Prayer' : 'Prayer Time'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`text-base font-bold tabular-nums ${isNext ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {prayer.time}
                                </span>

                                {!isSunrise && (
                                    <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isNext
                                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                                        }`}>
                                        <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

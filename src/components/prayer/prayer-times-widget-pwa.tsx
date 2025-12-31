'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { MapPin, Loader2, Volume2, Bell } from 'lucide-react'
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
        if (nextPrayer) {
            const updateTimer = () => {
                const now = new Date()
                const [hours, minutes] = nextPrayer.time.split(':').map(Number)
                let targetDate = new Date()
                targetDate.setHours(hours, minutes, 0, 0)
                if (targetDate <= now && nextPrayer.name === 'Fajr') {
                    targetDate.setDate(targetDate.getDate() + 1)
                }
                setTimeRemaining(getTimeUntil(targetDate))
            }
            updateTimer()
            const timer = setInterval(updateTimer, 60000)
            return () => clearInterval(timer)
        }
    }, [nextPrayer])

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

    return (
        <div className="space-y-6">
            {/* Top Section: Semi-Circular Gauge & Countdown */}
            {nextPrayer && (
                <div className="relative flex flex-col items-center pt-8 pb-4">
                    <div className="relative w-64 h-32 overflow-hidden flex justify-center">
                        {/* This creates the semi-circle effect */}
                        <div className="absolute top-0 w-64 h-64 rounded-full border-[14px] border-emerald-100 dark:border-emerald-900/40 box-border" />
                        <div className="absolute top-0 w-64 h-64 rounded-full border-[14px] border-emerald-500 box-border"
                            style={{
                                strokeDasharray: '100 100', // Fill half
                                clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' // Cut bottom half
                            }}
                        />

                        {/* Centered Content inside Arc */}
                        <div className="absolute top-8 flex flex-col items-center justify-center z-10 w-full text-center">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                                {nextPrayer.time}
                            </span>
                            <div className="flex items-center gap-1.5 justify-center opacity-70 mt-1">
                                <MapPin className="w-3 h-3 text-emerald-500" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[150px]">
                                    {displayLocation}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Next Prayer Label below Arc */}
                    <div className="mt-[-10px] text-center">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                            {nextPrayer.name} in {timeRemaining}
                        </span>
                    </div>
                </div>
            )}

            {/* Prayer List - Vertical Cards */}
            <div className="space-y-3">
                {prayers.map((prayer, index) => {
                    const isNext = nextPrayer?.name === prayer.name
                    const isSunrise = prayer.name === 'Sunrise'

                    return (
                        <motion.div
                            key={prayer.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${isNext
                                ? 'bg-white dark:bg-slate-800 shadow-xl shadow-emerald-500/10 border-l-4 border-l-emerald-500 transform scale-[1.02]'
                                : 'bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon Container */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${isNext
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400'
                                    }`}>
                                    {getPrayerIcon(prayer.name)}
                                </div>

                                {/* Text Info */}
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${isNext ? 'text-slate-800 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {prayer.name}
                                    </span>
                                    <span className={`text-xs ${isNext ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {isNext ? 'Unknown Time' : `${prayer.name} Time`}
                                    </span>
                                </div>
                            </div>

                            {/* Time & Action */}
                            <div className="flex items-center gap-4">
                                <span className={`text-base font-bold tabular-nums ${isNext ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {prayer.time}
                                </span>

                                {!isSunrise && (
                                    <button className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isNext
                                            ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                                        }`}>
                                        <Volume2 className="w-4 h-4" />
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

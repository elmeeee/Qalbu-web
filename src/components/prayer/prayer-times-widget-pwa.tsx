'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { MapPin, Loader2, Volume2, Bell, ChevronRight } from 'lucide-react'
import { getTimeUntil } from '@/lib/utils'
import { getNextPrayer } from '@/lib/api/prayer-times'
import { useLanguage } from '@/contexts/language-context'

const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

// Prayer icons with enhanced styling
const getPrayerIcon = (name: string) => {
    const icons: Record<string, React.ReactElement> = {
        Fajr: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v10M23 12h-6m-4 0H1" />
            </svg>
        ),
        Sunrise: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M8 18h8" />
            </svg>
        ),
        Dhuhr: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15 8L12 14L9 8L12 2Z" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        Asr: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2m10-10h-2M4 12H2" />
            </svg>
        ),
        Maghrib: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 18a5 5 0 0 0-10 0" />
                <line x1="12" y1="9" x2="12" y2="2" />
                <circle cx="12" cy="9" r="4" />
            </svg>
        ),
        Isha: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        ),
    }
    return icons[name] || icons.Fajr
}

// Islamic geometric pattern SVG
const IslamicPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M30 50 L70 50 M50 30 L50 70" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
)

export function PrayerTimesWidgetPWA() {
    const { prayerTimes, isLoading, error, coordinates, locationName } = usePrayerTimes()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null)
    const { t } = useLanguage()

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (prayerTimes?.timings) {
            const next = getNextPrayer(prayerTimes.timings)
            setNextPrayer(next)
        }
    }, [prayerTimes, currentTime])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-red-200 dark:border-red-800/30 p-6 text-center">
                <p className="text-foreground dark:text-white font-semibold mb-2">{t.common.error}</p>
                <p className="text-sm text-foreground/70 dark:text-white/70">{error.toString()}</p>
            </div>
        )
    }

    if (!prayerTimes) return null

    const prayers = prayerNames.map((name) => ({
        name,
        time: prayerTimes.timings[name as keyof typeof prayerTimes.timings],
    }))

    const getTranslatedPrayerName = (name: string) => {
        const key = name.toLowerCase() as keyof typeof t.prayer
        return t.prayer[key] || name
    }

    // Format Location
    const displayLocation = locationName
        ? [locationName.city, locationName.country].filter(Boolean).join(', ')
        : coordinates
            ? `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`
            : t.prayer.unknown

    // Format Dates
    const hijriDate = prayerTimes.date.hijri
    const formattedHijri = `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`

    const gregorianDate = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    })

    // Calculate time until next prayer
    const timeUntilNext = nextPrayer ? (() => {
        const now = new Date()
        const [hours, minutes] = nextPrayer.time.split(':').map(Number)

        let targetDate = new Date()
        targetDate.setHours(hours, minutes, 0, 0)

        if (targetDate <= now && nextPrayer.name === 'Fajr') {
            targetDate.setDate(targetDate.getDate() + 1)
        }

        return getTimeUntil(targetDate)
    })() : ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-emerald-200/50 dark:border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
        >
            {/* Islamic Pattern Background */}
            <IslamicPattern />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

            <div className="relative z-10 p-6">
                {/* Location Header */}
                <motion.div
                    className="flex items-center justify-between mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="p-2.5 rounded-xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MapPin className="h-4 w-4" />
                        </motion.div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide">{displayLocation}</span>
                    </div>
                    <motion.button
                        onClick={() => {
                            if ('Notification' in window) {
                                Notification.requestPermission().then(status => {
                                    if (status === 'granted') {
                                        new Notification('Qalbu Notifications Enabled')
                                    }
                                })
                            }
                        }}
                        className="p-2.5 rounded-xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-emerald-600 dark:text-emerald-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Bell className="h-4 w-4" />
                    </motion.button>
                </motion.div>

                {/* Next Prayer Highlight Card */}
                {nextPrayer && (
                    <motion.div
                        key={nextPrayer.time}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 p-6 text-white shadow-xl shadow-emerald-500/30"
                    >
                        {/* Animated background circles */}
                        <motion.div
                            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.5, 0.3, 0.5],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2
                            }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Next Prayer</span>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ChevronRight className="h-5 w-5 text-white/60" />
                                </motion.div>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <motion.h3
                                        className="text-5xl md:text-6xl font-bold mb-2 tracking-tight"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        {nextPrayer.time}
                                    </motion.h3>
                                    <p className="text-lg font-semibold text-white/90">
                                        {getTranslatedPrayerName(nextPrayer.name)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-white/70 mb-1">in</p>
                                    <p className="text-2xl font-bold">{timeUntilNext}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}


                {/* Hijri Date Card */}
                <motion.div
                    className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200/50 dark:border-teal-500/20 p-4 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative z-10">
                        <span className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                            Today&apos;s Hijri Date
                        </span>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 dark:from-teal-300 dark:to-emerald-300 bg-clip-text text-transparent font-arabic leading-relaxed">
                            {formattedHijri}
                        </h3>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                            {gregorianDate}
                        </p>
                    </div>
                </motion.div>

                {/* Horizontal Prayer Times Scroll */}
                <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                        {prayers.map((prayer, index) => {
                            const isNext = nextPrayer?.name === prayer.name
                            const isSunrise = prayer.name === 'Sunrise'

                            return (
                                <motion.div
                                    key={prayer.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.08 }}
                                    className={`flex-shrink-0 snap-start w-28 ${isNext ? 'w-32' : ''
                                        }`}
                                >
                                    <motion.div
                                        className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${isNext
                                            ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20'
                                            : isSunrise
                                                ? 'bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 opacity-60'
                                                : 'bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/30 hover:shadow-md'
                                            }`}
                                        whileHover={!isSunrise ? { scale: 1.05, y: -5 } : {}}
                                        whileTap={!isSunrise ? { scale: 0.95 } : {}}
                                    >
                                        {/* Icon */}
                                        <motion.div
                                            className={`flex items-center justify-center w-10 h-10 rounded-full mb-3 mx-auto ${isNext
                                                ? 'bg-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                }`}
                                            animate={isNext ? {
                                                rotate: [0, 5, -5, 0],
                                            } : {}}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            {getPrayerIcon(prayer.name)}
                                        </motion.div>

                                        {/* Prayer Name */}
                                        <p className={`text-xs font-semibold text-center mb-2 uppercase tracking-wide ${isNext
                                            ? 'text-emerald-800 dark:text-emerald-200'
                                            : 'text-slate-700 dark:text-slate-300'
                                            }`}>
                                            {getTranslatedPrayerName(prayer.name)}
                                        </p>

                                        {/* Prayer Time */}
                                        <p className={`text-lg font-bold text-center tabular-nums ${isNext
                                            ? 'text-emerald-900 dark:text-emerald-100'
                                            : 'text-slate-800 dark:text-slate-200'
                                            }`}>
                                            {prayer.time}
                                        </p>

                                        {/* Sound Icon */}
                                        {!isSunrise && (
                                            <motion.button
                                                className={`mt-3 mx-auto flex items-center justify-center w-8 h-8 rounded-full transition-all ${isNext
                                                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-600'
                                                    }`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                aria-label="Toggle adhan notification"
                                            >
                                                <Volume2 className="h-3.5 w-3.5" />
                                            </motion.button>
                                        )}

                                        {/* Active indicator */}
                                        {isNext && (
                                            <motion.div
                                                className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [1, 0.7, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </motion.div>
    )
}

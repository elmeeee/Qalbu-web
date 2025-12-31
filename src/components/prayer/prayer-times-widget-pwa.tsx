'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { MapPin, Loader2, Volume2, Bell } from 'lucide-react'
import { getTimeUntil } from '@/lib/utils'
import { getNextPrayer } from '@/lib/api/prayer-times'
import { useLanguage } from '@/contexts/language-context'

const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

// Prayer icons
const getPrayerIcon = (name: string) => {
    const icons: Record<string, React.ReactElement> = {
        Fajr: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v10M23 12h-6m-4 0H1" />
            </svg>
        ),
        Sunrise: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M8 18h8" />
            </svg>
        ),
        Dhuhr: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15 8L12 14L9 8L12 2Z" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        Asr: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2m10-10h-2M4 12H2" />
            </svg>
        ),
        Maghrib: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 18a5 5 0 0 0-10 0" />
                <line x1="12" y1="9" x2="12" y2="2" />
                <circle cx="12" cy="9" r="4" />
            </svg>
        ),
        Isha: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        ),
    }
    return icons[name] || icons.Fajr
}

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
                    <Loader2 className="h-8 w-8 text-foreground/60 dark:text-white/60" />
                </motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 text-center">
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
    const timeUntilNext = nextPrayer ? getTimeUntil(
        new Date(
            new Date().setHours(
                parseInt(nextPrayer.time.split(':')[0]),
                parseInt(nextPrayer.time.split(':')[1])
            )
        )
    ) : ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl glass shadow-2xl"
        >
            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            }} />

            <div className="relative z-10 p-6">
                {/* Location Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-600 dark:text-emerald-400">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground/80 dark:text-white/90 tracking-wide">{displayLocation}</span>
                    </div>
                    <button className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-foreground/70 dark:text-white/80 hover:text-emerald-600 dark:hover:text-emerald-400">
                        <Bell className="h-4 w-4" />
                    </button>
                </div>

                {/* Next Prayer Time Display */}
                <div className="mb-8 text-center">
                    <motion.div
                        key={nextPrayer?.time}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative inline-block"
                    >
                        <span className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-teal-800 to-teal-600 dark:from-white dark:to-white/80 tracking-tighter">
                            {nextPrayer?.time || '--:--'}
                        </span>
                    </motion.div>

                    {nextPrayer && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-2 flex items-center justify-center gap-2"
                        >
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                                {getTranslatedPrayerName(nextPrayer.name)}
                            </span>
                            <span className="text-sm font-medium text-foreground/60 dark:text-white/60">
                                in {timeUntilNext}
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Date Section */}
                <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 p-4 text-center">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                    <div className="relative z-10">
                        <span className="block text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                            Today&apos;s Hijri Date
                        </span>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 dark:from-teal-300 dark:to-emerald-300 bg-clip-text text-transparent font-arabic leading-relaxed">
                            {formattedHijri}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground mt-1">
                            {gregorianDate}
                        </p>
                    </div>
                </div>

                {/* Prayer Times List */}
                <div className="space-y-2">
                    {prayers.map((prayer, index) => {
                        const isNext = nextPrayer?.name === prayer.name
                        const isSunrise = prayer.name === 'Sunrise'

                        return (
                            <motion.div
                                key={prayer.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group relative flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-300 ${isNext
                                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 shadow-sm'
                                    : isSunrise
                                        ? 'opacity-60'
                                        : 'hover:bg-white/5 dark:hover:bg-white/5 border border-transparent hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Prayer Icon */}
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${isNext
                                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-white/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                                        }`}>
                                        {getPrayerIcon(prayer.name)}
                                    </div>

                                    {/* Prayer Name */}
                                    <span className={`text-sm font-medium transition-colors ${isNext
                                        ? 'text-emerald-800 dark:text-emerald-200'
                                        : 'text-foreground/80 dark:text-white/80'
                                        }`}>
                                        {getTranslatedPrayerName(prayer.name)}
                                    </span>
                                </div>

                                {/* Prayer Time */}
                                <div className="flex items-center gap-3">
                                    <span className={`text-base font-bold tabular-nums tracking-tight ${isNext
                                        ? 'text-emerald-800 dark:text-emerald-200'
                                        : 'text-foreground/90 dark:text-white/90'
                                        }`}>
                                        {prayer.time}
                                    </span>

                                    {/* Sound Icon */}
                                    {!isSunrise && (
                                        <button
                                            className={`p-1.5 rounded-full transition-all ${isNext
                                                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                                                : 'text-foreground/40 dark:text-white/40 hover:text-foreground/80 dark:hover:text-white/80 hover:bg-foreground/5 dark:hover:bg-white/10'
                                                }`}
                                            aria-label="Toggle adhan notification"
                                        >
                                            <Volume2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    )
}

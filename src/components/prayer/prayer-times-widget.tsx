'use client'

import { motion } from 'framer-motion'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Loader2, Calendar } from 'lucide-react'
import Image from 'next/image'
import { formatTime, getTimeUntil } from '@/lib/utils'
import { getNextPrayer } from '@/lib/api/prayer-times'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export function PrayerTimesWidget({ variant = 'default' }: { variant?: 'default' | 'horizontal' }) {
    const { prayerTimes, isLoading, error, coordinates, locationName } = usePrayerTimes()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null)
    const { t, language } = useLanguage()

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

    if (isLoading) {
        return (
            <Card className="premium-card">
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="premium-card border-destructive/50">
                <CardContent className="p-8 text-center">
                    <p className="text-destructive">{t.common.error}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{error.toString()}</p>
                </CardContent>
            </Card>
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
    const weekday = hijriDate.weekday.en
    const month = hijriDate.month.en
    const formattedHijri = `${weekday}, ${hijriDate.date} ${month} ${hijriDate.year}`

    const gregorianDate = new Date().toLocaleDateString(language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    if (variant === 'horizontal') {
        return (
            <Card className="premium-card overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Header Info */}
                        <div className="flex flex-col gap-2 relative">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-gold-600" />
                                <span className="text-sm font-medium">{displayLocation}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground">{t.common.prayerTimes}</h3>
                                    <p className="text-sm text-muted-foreground">{formattedHijri}</p>
                                </div>
                                <motion.div
                                    className="hidden sm:block h-24 w-24 relative opacity-90"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, -5, 5, 0]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Image
                                        src="/icons/bedug.svg"
                                        alt="Bedug"
                                        fill
                                        className="object-contain"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Prayer Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:flex-1 lg:justify-end lg:gap-4">
                            {prayers.map((prayer) => {
                                const isNext = nextPrayer?.name === prayer.name
                                return (
                                    <div
                                        key={prayer.name}
                                        className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${isNext
                                            ? 'bg-gold-600 text-white shadow-lg shadow-gold-500/20 scale-105'
                                            : 'bg-muted/50 hover:bg-muted'
                                            }`}
                                    >
                                        <span className={`text-xs font-medium mb-1 ${isNext ? 'text-white/90' : 'text-muted-foreground'}`}>
                                            {getTranslatedPrayerName(prayer.name)}
                                        </span>
                                        <span className={`text-lg font-bold ${isNext ? 'text-white' : 'text-foreground'}`}>
                                            {prayer.time}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="premium-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gold-500 to-gold-600 text-white">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">{t.common.prayerTimes}</CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span className="max-w-[150px] truncate" title={locationName?.formatted || ''}>
                            {displayLocation}
                        </span>
                    </div>
                </div>
                <div className="mt-4 space-y-1">
                    <p className="text-sm font-medium text-white/90 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formattedHijri}
                    </p>
                    <p className="text-xs text-white/75 pl-6">
                        {gregorianDate}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* Next Prayer Highlight */}
                {nextPrayer && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">{t.prayer.nextPrayer}</p>
                                <p className="text-2xl font-bold">{getTranslatedPrayerName(nextPrayer.name)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold">{nextPrayer.time}</p>
                                <p className="text-sm opacity-90">
                                    {t.prayer.in}{' '}
                                    {getTimeUntil(
                                        new Date(
                                            new Date().setHours(
                                                parseInt(nextPrayer.time.split(':')[0]),
                                                parseInt(nextPrayer.time.split(':')[1])
                                            )
                                        )
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* All Prayer Times */}
                <div className="space-y-3">
                    {prayers.map((prayer, index) => {
                        const isNext = nextPrayer?.name === prayer.name
                        return (
                            <motion.div
                                key={prayer.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center justify-between rounded-lg p-4 transition-all ${isNext
                                    ? 'bg-gold-100 dark:bg-gold-900/20'
                                    : 'bg-muted/50 hover:bg-muted'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Clock
                                        className={`h-5 w-5 ${isNext ? 'text-gold-600' : 'text-muted-foreground'}`}
                                    />
                                    <span className={`font-medium ${isNext ? 'text-gold-700 dark:text-gold-400' : ''}`}>
                                        {getTranslatedPrayerName(prayer.name)}
                                    </span>
                                </div>
                                <span className={`text-lg font-semibold ${isNext ? 'text-gold-700 dark:text-gold-400' : ''}`}>
                                    {prayer.time}
                                </span>
                            </motion.div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

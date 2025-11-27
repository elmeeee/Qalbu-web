'use client'

import { motion } from 'framer-motion'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Loader2, Calendar } from 'lucide-react'
import { formatTime, getTimeUntil } from '@/lib/utils'
import { getNextPrayer } from '@/lib/api/prayer-times'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export function PrayerTimesWidget() {
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
    const isArabic = language === 'ar'
    const weekday = isArabic ? hijriDate.weekday.ar : hijriDate.weekday.en
    const month = isArabic ? hijriDate.month.ar : hijriDate.month.en
    const formattedHijri = `${weekday}, ${hijriDate.date} ${month} ${hijriDate.year}`

    const gregorianDate = new Date().toLocaleDateString(language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

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

'use client'

import { motion } from 'framer-motion'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Loader2, Calendar } from 'lucide-react'
import Image from 'next/image'
import { getTimeUntil } from '@/lib/utils'
import { getNextPrayer } from '@/lib/api/prayer-times'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { PrayerSettingsDialog } from './prayer-settings-dialog'

const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export function PrayerTimesWidget({ variant = 'default' }: { variant?: 'default' | 'horizontal' }) {
    const { prayerTimes, isLoading, error, coordinates, locationName, settings, updateSettings, setLocation } = usePrayerTimes()
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
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
                                <MapPin className="h-4 w-4 text-blue-600" />
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
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105'
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
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                        <CardTitle className="text-2xl font-bold">{t.common.prayerTimes}</CardTitle>
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span className="max-w-[150px] truncate" title={locationName?.formatted || ''}>
                                {displayLocation}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <PrayerSettingsDialog
                            settings={settings}
                            onSettingsChange={updateSettings}
                            onLocationChange={setLocation}
                            variant="button"
                        />
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-5 text-white shadow-2xl relative overflow-hidden"
                    >
                        {/* Animated background pulse */}
                        <motion.div
                            className="absolute inset-0 bg-white/10"
                            animate={{
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-sm font-medium opacity-90 mb-1"
                                >
                                    {t.prayer.nextPrayer}
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-bold"
                                >
                                    {getTranslatedPrayerName(nextPrayer.name)}
                                </motion.p>
                            </div>
                            <div className="text-right">
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className="text-4xl font-bold"
                                >
                                    {nextPrayer.time}
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-sm opacity-90 mt-1"
                                >
                                    {t.prayer.in}{' '}
                                    {getTimeUntil(
                                        new Date(
                                            new Date().setHours(
                                                parseInt(nextPrayer.time.split(':')[0]),
                                                parseInt(nextPrayer.time.split(':')[1])
                                            )
                                        )
                                    )}
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* All Prayer Times */}
                <div className="space-y-2">
                    {prayers.map((prayer, index) => {
                        const isNext = nextPrayer?.name === prayer.name
                        return (
                            <motion.div
                                key={prayer.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                transition={{
                                    delay: index * 0.08,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                }}
                                className={`flex items-center justify-between rounded-xl p-4 transition-all cursor-pointer ${isNext
                                    ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 shadow-md'
                                    : 'bg-muted/50 hover:bg-muted hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={isNext ? {
                                            rotate: [0, 10, -10, 0],
                                        } : {}}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Clock
                                            className={`h-5 w-5 ${isNext ? 'text-blue-600' : 'text-muted-foreground'}`}
                                        />
                                    </motion.div>
                                    <span className={`font-semibold ${isNext ? 'text-blue-700 dark:text-blue-400' : ''}`}>
                                        {getTranslatedPrayerName(prayer.name)}
                                    </span>
                                </div>
                                <motion.span
                                    className={`text-lg font-bold tabular-nums ${isNext ? 'text-blue-700 dark:text-blue-400' : ''}`}
                                    animate={isNext ? {
                                        scale: [1, 1.05, 1],
                                    } : {}}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {prayer.time}
                                </motion.span>
                            </motion.div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

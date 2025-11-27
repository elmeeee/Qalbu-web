'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Moon, Sun, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { getCalendar, type PrayerTimesResponse } from '@/lib/api/prayer-times'
import { useEffect, useState } from 'react'

export default function FastingCalendarPage() {
    const { t, language } = useLanguage()
    const { coordinates } = usePrayerTimes()
    const [calendar, setCalendar] = useState<PrayerTimesResponse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (coordinates) {
            const date = new Date()
            getCalendar(coordinates, date.getMonth() + 1, date.getFullYear())
                .then(setCalendar)
                .catch(console.error)
                .finally(() => setLoading(false))
        }
    }, [coordinates])

    const getFastingType = (day: PrayerTimesResponse) => {
        const hijriDay = parseInt(day.date.hijri.day)
        const hijriMonth = day.date.hijri.month.en
        const weekday = day.date.readable.split(' ')[0] // This might be just the day number, need to check API response format or use Date object

        // Create a date object to check for Monday/Thursday
        // The API returns date in "DD MMM YYYY" format usually, but let's be safe
        // Actually, the API response has `weekday.en`
        const dayName = day.date.hijri.weekday.en

        if (hijriMonth === 'Ramadan') return { type: 'Ramadan', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Ramadan' }

        if ([13, 14, 15].includes(hijriDay)) return { type: 'Ayamul Bidh', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Ayamul Bidh' }

        if (dayName === 'Monday' || dayName === 'Thursday') return { type: 'Sunnah', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Sunnah (Mon/Thu)' }

        return null
    }

    if (loading && !calendar.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-sand-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center relative"
                >
                    <div className="absolute left-0 top-0 md:left-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">{t.common.home}</span>
                            </Button>
                        </Link>
                    </div>
                    <h1 className="mb-4 text-3xl font-bold md:text-5xl pt-12 md:pt-0">
                        <span className="gradient-text">Fasting Calendar</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">Schedule for Sunnah Fasting</p>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Ramadan</span>
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Ayamul Bidh (13-15)</span>
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Mon & Thu</span>
                    </div>
                </motion.div>

                {/* Calendar Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {calendar.map((day, index) => {
                        const date = new Date()
                        // Parse the readable date "01 Sep 2024" -> check if today
                        // API date format: "DD MM YYYY" or "DD MMM YYYY"
                        // Let's rely on string comparison for simplicity if formats align, or just use the index if we fetched current month
                        // Better: compare day/month/year

                        const fastingInfo = getFastingType(day)
                        const isToday = day.date.readable === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')
                        // Note: Date matching can be tricky with formats. Let's just highlight if it matches today's day number for this month view.
                        const currentDay = new Date().getDate().toString().padStart(2, '0')
                        const isTodaySimple = day.date.readable.startsWith(currentDay)

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className={`premium-card h-full transition-all hover:shadow-md ${isTodaySimple ? 'border-gold-500 ring-1 ring-gold-500' : ''} ${fastingInfo ? 'bg-opacity-50' : 'opacity-80 hover:opacity-100'}`}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-bold text-lg block">
                                                    {day.date.readable.split(' ')[0]} <span className="text-sm font-normal text-muted-foreground">{day.date.readable.split(' ')[1]}</span>
                                                </span>
                                                <span className="text-xs text-muted-foreground block mt-1">
                                                    {day.date.hijri.weekday.en}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full block mb-1">
                                                    {day.date.hijri.day} {day.date.hijri.month.en}
                                                </span>
                                                {fastingInfo && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block ${fastingInfo.color}`}>
                                                        {fastingInfo.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-2">
                                        {fastingInfo ? (
                                            <>
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                                    <div className="flex items-center gap-2">
                                                        <Moon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                        <span className="text-xs font-medium">{t.ramadan.suhoor}</span>
                                                    </div>
                                                    <span className="font-bold text-sm">{day.timings.Fajr.split(' ')[0]}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                                    <div className="flex items-center gap-2">
                                                        <Sun className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                                                        <span className="text-xs font-medium">{t.ramadan.iftar}</span>
                                                    </div>
                                                    <span className="font-bold text-sm">{day.timings.Maghrib.split(' ')[0]}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground italic">
                                                No fasting scheduled
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}

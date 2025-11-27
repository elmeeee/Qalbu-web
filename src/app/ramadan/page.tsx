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

export default function RamadanPage() {
    const { t, language } = useLanguage()
    const { coordinates } = usePrayerTimes()
    const [calendar, setCalendar] = useState<PrayerTimesResponse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (coordinates) {
            const date = new Date()
            // Fetch current month. Ideally we'd fetch the actual Ramadan month, 
            // but for now let's show the current month as a "Fasting Schedule"
            getCalendar(coordinates, date.getMonth() + 1, date.getFullYear())
                .then(setCalendar)
                .catch(console.error)
                .finally(() => setLoading(false))
        }
    }, [coordinates])

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
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl pt-8 md:pt-0">
                        <span className="gradient-text">{t.ramadan.title}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">{t.ramadan.subtitle}</p>
                </motion.div>

                {/* Calendar Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {calendar.map((day, index) => {
                        const date = new Date()
                        const isToday = parseInt(day.date.readable.split(' ')[0]) === date.getDate()

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className={`premium-card h-full ${isToday ? 'border-gold-500 ring-1 ring-gold-500' : ''}`}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg">
                                                {day.date.readable.split(' ')[0]} {day.date.readable.split(' ')[1]}
                                            </span>
                                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                                {day.date.hijri.day} {day.date.hijri.month.en}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{day.date.readable.split(' ')[2]} {day.date.readable.split(' ')[3]}</p>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                            <div className="flex items-center gap-2">
                                                <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                <span className="text-sm font-medium">{t.ramadan.suhoor}</span>
                                            </div>
                                            <span className="font-bold">{day.timings.Fajr.split(' ')[0]}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                            <div className="flex items-center gap-2">
                                                <Sun className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                <span className="text-sm font-medium">{t.ramadan.iftar}</span>
                                            </div>
                                            <span className="font-bold">{day.timings.Maghrib.split(' ')[0]}</span>
                                        </div>
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

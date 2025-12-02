'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { type IslamicHoliday, type HijriDate } from '@/lib/api/islamic-calendar'
import { Calendar, Star, Loader2, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function IslamicHolidaysWidget() {
    const { t } = useLanguage()

    const { data: holidays, isLoading: holidaysLoading } = useQuery<IslamicHoliday[]>({
        queryKey: ['upcomingHolidays'],
        queryFn: async () => {
            const response = await fetch('/api/islamic-calendar/upcoming-holidays')
            if (!response.ok) {
                throw new Error('Failed to fetch upcoming holidays')
            }
            return response.json()
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    })

    const { data: currentHijri } = useQuery<HijriDate>({
        queryKey: ['currentHijriDate'],
        queryFn: async () => {
            const response = await fetch('/api/islamic-calendar/current-hijri')
            if (!response.ok) {
                throw new Error('Failed to fetch current Hijri date')
            }
            return response.json()
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    })

    if (holidaysLoading) {
        return (
            <Card className="premium-card">
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </CardContent>
            </Card>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    const getDaysUntil = (dateString: string) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const targetDate = new Date(dateString)
        targetDate.setHours(0, 0, 0, 0)
        const diffTime = targetDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const upcomingHoliday = holidays && holidays.length > 0 ? holidays[0] : null
    const daysUntil = upcomingHoliday ? getDaysUntil(upcomingHoliday.gregorianDate.date) : null

    return (
        <div className="space-y-4">
            {/* Upcoming Holiday Banner - Red Style */}
            {upcomingHoliday && daysUntil !== null && daysUntil <= 30 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 p-6 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[url('/patterns/islamic-pattern.svg')] opacity-10" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white/90 mb-1">Upcoming Holy Day</p>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {upcomingHoliday.holiday}
                                </h3>
                                <p className="text-white/90 text-sm">
                                    {formatDate(upcomingHoliday.gregorianDate.date)}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold text-white">
                                {daysUntil}
                            </div>
                            <div className="text-white/90 text-sm font-medium">
                                {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Day' : 'Days'}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Other Upcoming Holidays */}
            {holidays && holidays.length > 1 && (
                <Card className="premium-card overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Star className="h-5 w-5 text-blue-600" />
                                More Upcoming Events
                            </h3>
                            {currentHijri && (
                                <div className="text-sm text-muted-foreground">
                                    {currentHijri.day} {currentHijri.month.en} {currentHijri.year} AH
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            {holidays.slice(1, 4).map((holiday, index) => {
                                const days = getDaysUntil(holiday.gregorianDate.date)
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <h4 className="font-medium text-sm">{holiday.holiday}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(holiday.gregorianDate.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            in {days} {days === 1 ? 'day' : 'days'}
                                        </span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

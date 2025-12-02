'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { type IslamicHoliday, type HijriDate } from '@/lib/api/islamic-calendar'
import { Calendar, Star, Loader2, Sparkles, ChevronRight, Moon, Sun } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useState } from 'react'

export function IslamicHolidaysWidgetPWA() {
    const { t } = useLanguage()
    const [expandedHoliday, setExpandedHoliday] = useState<number | null>(null)

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
            <div className="flex items-center justify-center py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="h-8 w-8 text-emerald-500" />
                </motion.div>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return {
            day: date.toLocaleDateString('en-US', { day: 'numeric' }),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            fullDate: date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }
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

    const getHolidayGradient = (index: number) => {
        const gradients = [
            'from-emerald-500 via-teal-500 to-cyan-500',
            'from-violet-500 via-purple-500 to-fuchsia-500',
            'from-orange-500 via-red-500 to-pink-500',
            'from-blue-500 via-indigo-500 to-purple-500',
            'from-amber-500 via-yellow-500 to-orange-500',
        ]
        return gradients[index % gradients.length]
    }

    const upcomingHoliday = holidays && holidays.length > 0 ? holidays[0] : null
    const daysUntil = upcomingHoliday ? getDaysUntil(upcomingHoliday.gregorianDate.date) : null

    return (
        <div className="space-y-4 px-4 md:px-0">
            {/* Current Hijri Date Banner */}


            {/* Next Upcoming Holiday - Hero Card */}
            {upcomingHoliday && daysUntil !== null && daysUntil <= 30 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-3xl shadow-2xl"
                >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getHolidayGradient(0)}`} />

                    {/* Animated Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-6">
                        {/* Badge */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-4"
                        >
                            <Sparkles className="h-4 w-4 text-white" />
                            <span className="text-xs font-semibold text-white">Next Holy Day</span>
                        </motion.div>

                        {/* Holiday Name */}
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white mb-2 leading-tight"
                        >
                            {upcomingHoliday.holiday}
                        </motion.h2>

                        {/* Date */}
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/90 text-sm mb-6"
                        >
                            {formatDate(upcomingHoliday.gregorianDate.date).fullDate}
                        </motion.p>

                        {/* Countdown */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="flex items-end gap-3"
                        >
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
                                <div className="text-5xl font-bold text-white leading-none mb-1">
                                    {daysUntil}
                                </div>
                                <div className="text-white/90 text-xs font-medium uppercase tracking-wider">
                                    {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Day Left' : 'Days Left'}
                                </div>
                            </div>

                            {daysUntil > 0 && (
                                <div className="flex-1 flex items-center gap-2 text-white/80 text-sm">
                                    <div className="h-px flex-1 bg-white/30" />
                                    <span className="font-medium">Prepare your heart</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Other Upcoming Holidays - Modern List */}
            {holidays && holidays.length > 1 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                            Upcoming Events
                        </h3>
                        <span className="text-xs text-muted-foreground">
                            {holidays.length - 1} more
                        </span>
                    </div>

                    <div className="space-y-2">
                        {holidays.slice(1, 5).map((holiday, index) => {
                            const days = getDaysUntil(holiday.gregorianDate.date)
                            const date = formatDate(holiday.gregorianDate.date)
                            const isExpanded = expandedHoliday === index

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <motion.div
                                        className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm cursor-pointer"
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setExpandedHoliday(isExpanded ? null : index)}
                                    >
                                        {/* Subtle gradient accent */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getHolidayGradient(index + 1)}`} />

                                        <div className="p-4 pl-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    {/* Date Badge */}
                                                    <div className="flex flex-col items-center justify-center bg-muted rounded-xl p-2.5 min-w-[60px]">
                                                        <div className="text-xs font-medium text-muted-foreground uppercase">
                                                            {date.month}
                                                        </div>
                                                        <div className="text-2xl font-bold text-foreground leading-none">
                                                            {date.day}
                                                        </div>
                                                    </div>

                                                    {/* Holiday Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-foreground text-sm mb-0.5 truncate">
                                                            {holiday.holiday}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            in {days} {days === 1 ? 'day' : 'days'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Expand Icon */}
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                </motion.div>
                                            </div>

                                            {/* Expanded Content */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-4 mt-4 border-t border-border space-y-2">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-muted-foreground">Gregorian Date</span>
                                                                <span className="font-medium">{date.fullDate}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-muted-foreground">Hijri Date</span>
                                                                <span className="font-medium">
                                                                    {holiday.hijriDate.day} {holiday.hijriDate.month.en} {holiday.hijriDate.year}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!holidays || holidays.length === 0) && !holidaysLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                        <Calendar className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Holidays</h3>
                    <p className="text-sm text-muted-foreground">
                        Check back later for upcoming Islamic holidays
                    </p>
                </motion.div>
            )}
        </div>
    )
}

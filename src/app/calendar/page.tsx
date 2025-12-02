'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type IslamicCalendarDay, type HijriDate } from '@/lib/api/islamic-calendar'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Loader2, Moon, Star } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

const HIJRI_MONTHS = [
    { number: 1, name: 'Muharram' },
    { number: 2, name: 'Safar' },
    { number: 3, name: 'Rabi al-Awwal' },
    { number: 4, name: 'Rabi al-Thani' },
    { number: 5, name: 'Jumada al-Awwal' },
    { number: 6, name: 'Jumada al-Thani' },
    { number: 7, name: 'Rajab' },
    { number: 8, name: 'Shaban' },
    { number: 9, name: 'Ramadan' },
    { number: 10, name: 'Shawwal' },
    { number: 11, name: 'Dhul-Qadah' },
    { number: 12, name: 'Dhul-Hijjah' },
]

export default function CalendarPage() {
    const { t } = useLanguage()
    const [selectedMonth, setSelectedMonth] = useState(9) // Default to Ramadan
    const [selectedYear, setSelectedYear] = useState(1447)

    const { data: currentHijri } = useQuery<HijriDate>({
        queryKey: ['currentHijriDate'],
        queryFn: async () => {
            const response = await fetch('/api/islamic-calendar/current-hijri')
            if (!response.ok) {
                throw new Error('Failed to fetch current Hijri date')
            }
            return response.json()
        },
        staleTime: 1000 * 60 * 60,
    })

    const { data: calendarData, isLoading } = useQuery<IslamicCalendarDay[]>({
        queryKey: ['hijriCalendar', selectedMonth, selectedYear],
        queryFn: async () => {
            const response = await fetch(`/api/islamic-calendar/hijri?month=${selectedMonth}&year=${selectedYear}`)
            if (!response.ok) {
                throw new Error('Failed to fetch Hijri calendar')
            }
            return response.json()
        },
        staleTime: 1000 * 60 * 60 * 24,
    })

    const handlePreviousMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12)
            setSelectedYear(selectedYear - 1)
        } else {
            setSelectedMonth(selectedMonth - 1)
        }
    }

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1)
            setSelectedYear(selectedYear + 1)
        } else {
            setSelectedMonth(selectedMonth + 1)
        }
    }

    const formatTime = (time: string) => {
        return time.split(' ')[0] // Remove timezone
    }

    const isToday = (day: IslamicCalendarDay) => {
        if (!currentHijri) return false
        return (
            day.date.hijri.day === currentHijri.day &&
            day.date.hijri.month.number === parseInt(currentHijri.month.number.toString()) &&
            day.date.hijri.year === currentHijri.year
        )
    }

    const hasHoliday = (day: IslamicCalendarDay) => {
        return day.date.hijri.holidays && day.date.hijri.holidays.length > 0
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
                                <span className="hidden sm:inline">Home</span>
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-4 pt-12 md:pt-0">
                        <Calendar className="h-10 w-10 text-emerald-600" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Islamic Calendar
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Hijri Calendar with Prayer Times
                    </p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Card className="premium-card">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handlePreviousMonth}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <div className="flex items-center gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Month</Label>
                                            <Select
                                                value={selectedMonth.toString()}
                                                onValueChange={(value) => setSelectedMonth(parseInt(value))}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {HIJRI_MONTHS.map((month) => (
                                                        <SelectItem key={month.number} value={month.number.toString()}>
                                                            {month.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Year</Label>
                                            <Select
                                                value={selectedYear.toString()}
                                                onValueChange={(value) => setSelectedYear(parseInt(value))}
                                            >
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1446, 1447, 1448, 1449, 1450].map((year) => (
                                                        <SelectItem key={year} value={year.toString()}>
                                                            {year} AH
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleNextMonth}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                {currentHijri && (
                                    <div className="text-sm text-muted-foreground">
                                        Today: {currentHijri.day} {currentHijri.month.en} {currentHijri.year} AH
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Calendar Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                ) : calendarData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {calendarData.map((day, index) => {
                            const today = isToday(day)
                            const holiday = hasHoliday(day)

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    <Card className={`premium-card h-full transition-all hover:shadow-lg ${today ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : ''
                                        } ${holiday ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20' : ''
                                        }`}>
                                        <CardContent className="p-4">
                                            {/* Date Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className={`text-3xl font-bold ${today ? 'text-emerald-600' : holiday ? 'text-red-600' : 'text-foreground'
                                                        }`}>
                                                        {day.date.hijri.day}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {day.date.gregorian.day} {day.date.gregorian.month.en}
                                                    </div>
                                                </div>
                                                {today && <Star className="h-5 w-5 text-emerald-600 fill-emerald-600" />}
                                                {holiday && <Moon className="h-5 w-5 text-red-600 fill-red-600" />}
                                            </div>

                                            {/* Holiday Badge */}
                                            {holiday && day.date.hijri.holidays && (
                                                <div className="mb-3">
                                                    {day.date.hijri.holidays.map((h, i) => (
                                                        <div key={i} className="text-xs font-semibold bg-red-600 text-white px-2 py-1 rounded-full inline-block">
                                                            {h}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Prayer Times */}
                                            <div className="space-y-1.5 text-xs">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Fajr</span>
                                                    <span className="font-medium">{formatTime(day.timings.Fajr)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Dhuhr</span>
                                                    <span className="font-medium">{formatTime(day.timings.Dhuhr)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Asr</span>
                                                    <span className="font-medium">{formatTime(day.timings.Asr)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Maghrib</span>
                                                    <span className="font-medium">{formatTime(day.timings.Maghrib)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Isha</span>
                                                    <span className="font-medium">{formatTime(day.timings.Isha)}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No calendar data available</p>
                    </div>
                )}
            </div>
        </main>
    )
}

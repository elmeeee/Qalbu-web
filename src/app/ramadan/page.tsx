'use client'

import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Loader2, Moon, ArrowLeft, Clock, ChevronDown, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    getRamadanCalendar,
    COUNTRIES,
    type Coordinates,
    type PrayerTimesResponse,
    type PrayerSettings,
} from '@/lib/api/prayer-times'
import { PrayerSettingsDialog } from '@/components/prayer/prayer-settings-dialog'
import { useLanguage } from '@/contexts/language-context'
import { usePWAMode } from '@/hooks/use-pwa-mode'
import { cn } from '@/lib/utils'

export default function RamadanCalendarPage() {
    const { t, language } = useLanguage()
    const isPwa = usePWAMode()
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
    const [hijriYear, setHijriYear] = useState(1447) // Ramadan 2026 is in Hijri year 1447
    const [settings, setSettings] = useState<PrayerSettings>({
        method: 2,
        school: 0,
        latitudeAdjustment: 1,
        midnightMode: 0,
    })
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
    const [currentDayIndex, setCurrentDayIndex] = useState<number>(0)

    // Load settings from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('prayer-settings')
        if (stored) {
            try {
                setSettings(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse stored settings:', e)
            }
        }
    }, [])

    // Auto-detect user's country based on location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords
                    setUserLocation({ lat: latitude, lon: longitude })

                    // Find closest country from the list
                    let closestCountry = COUNTRIES[0]
                    let minDistance = Infinity

                    COUNTRIES.forEach((country) => {
                        const distance = Math.sqrt(
                            Math.pow(country.lat - latitude, 2) + Math.pow(country.lon - longitude, 2)
                        )
                        if (distance < minDistance) {
                            minDistance = distance
                            closestCountry = country
                        }
                    })

                    setSelectedCountry(closestCountry)
                },
                (error) => {
                    // Silently handle geolocation errors (permission denied, etc.)
                    // Keep default country selection
                }
            )
        }
    }, [])

    const coordinates: Coordinates = {
        latitude: selectedCountry.lat,
        longitude: selectedCountry.lon,
    }

    const { data: ramadanData, isLoading, error } = useQuery<PrayerTimesResponse[]>({
        queryKey: ['ramadan', selectedCountry.code, hijriYear, settings],
        queryFn: () => getRamadanCalendar(coordinates, hijriYear, settings),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    })

    // Determine "Today" based on real date vs calendar date
    // For demo purposes, we'll just pick the first day if the actual date isn't in the range
    useEffect(() => {
        if (ramadanData) {
            // Logic to find today's index would go here
            // For now, default to 0 (First day) or a specific day for visualization
            setCurrentDayIndex(0)
        }
    }, [ramadanData])

    const updateSettings = (newSettings: Partial<PrayerSettings>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        localStorage.setItem('prayer-settings', JSON.stringify(updated))
    }

    const getTranslatedPrayerName = (name: string) => {
        const key = name.toLowerCase() as keyof typeof t.prayer
        return t.prayer[key] || name
    }

    const formatTimezone = (timezone: string) => {
        // Specific Timezone Map
        const TIMEZONE_MAP: Record<string, string> = {
            // Indonesia
            'Asia/Jakarta': 'WIB',
            'Asia/Pontianak': 'WIB',
            'Asia/Makassar': 'WITA',
            'Asia/Ujung_Pandang': 'WITA',
            'Asia/Jayapura': 'WIT',
            // Malaysia & Singapore
            'Asia/Kuala_Lumpur': 'MYT',
            'Asia/Kuching': 'MYT',
            'Asia/Singapore': 'SGT',
            // Middle East
            'Asia/Dubai': 'GST',
            'Asia/Muscat': 'GST',
            'Asia/Riyadh': 'AST',
            'Asia/Baghdad': 'AST',
            'Asia/Qatar': 'AST',
            'Asia/Kuwait': 'AST',
            'Asia/Bahrain': 'AST',
            'Asia/Aden': 'AST',
            'Asia/Tehran': 'IRST',
            'Asia/Kabul': 'AFT',
            'Asia/Amman': 'EEST', // Or EET depending on DST, usually handled by Intl but specific request for names
            'Asia/Beirut': 'EEST',
            'Asia/Jerusalem': 'IDT',
            'Asia/Gaza': 'EEST',
            'Asia/Damascus': 'EEST',
            // South Asia
            'Asia/Karachi': 'PKT',
            'Asia/Dhaka': 'BST',
            'Asia/Colombo': 'IST',
            'Asia/Kolkata': 'IST',
            // Europe
            'Europe/Istanbul': 'TRT',
            'Europe/London': 'BST', // Assuming Ramadan is in Summer
            'Europe/Paris': 'CEST',
            'Europe/Berlin': 'CEST',
            'Europe/Moscow': 'MSK',
            // Others
            'Australia/Sydney': 'AEST',
            'America/New_York': 'EDT',
        }

        if (TIMEZONE_MAP[timezone]) {
            return TIMEZONE_MAP[timezone]
        }

        // Fallback to short name via Intl
        try {
            return new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' })
                .formatToParts(new Date())
                .find(part => part.type === 'timeZoneName')?.value || timezone
        } catch (e) {
            return timezone
        }
    }

    const cleanTime = (time: string | undefined) => {
        if (!time) return ''
        return time.replace(/\s*\(.*?\)/g, '').trim()
    }

    const heroDay = ramadanData?.[currentDayIndex]
    const timezoneDisplay = ramadanData?.[0]?.meta?.timezone ? formatTimezone(ramadanData[0].meta.timezone) : ''

    return (
        <div className={cn(
            "min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4",
            isPwa ? 'pb-24' : ''
        )}>
            {/* Animated Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.025]">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                                         radial-gradient(circle at 75% 75%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)`,
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="container mx-auto max-w-3xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center relative"
                >
                    {!isPwa && (
                        <div className="absolute left-0 top-0">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10">
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t.common.home}</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-3 mb-4 pt-12 md:pt-0">
                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <Moon className="h-6 w-6 text-emerald-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                            {t.ramadan?.title || 'Ramadan Journey'}
                        </h1>
                    </div>

                    {/* Controls - Compact */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                        <Select
                            value={selectedCountry.code}
                            onValueChange={(code) => {
                                const country = COUNTRIES.find((c) => c.code === code)
                                if (country) setSelectedCountry(country)
                            }}
                        >
                            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-slate-200 rounded-full h-9 text-xs">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-emerald-400" />
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                                {COUNTRIES.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                        {country.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={hijriYear.toString()}
                            onValueChange={(value) => setHijriYear(parseInt(value))}
                        >
                            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-slate-200 rounded-full h-9 text-xs">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3 text-emerald-400" />
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                                <SelectItem value="1447">1447 AH</SelectItem>
                                <SelectItem value="1448">1448 AH</SelectItem>
                                <SelectItem value="1449">1449 AH</SelectItem>
                            </SelectContent>
                        </Select>

                        <PrayerSettingsDialog settings={settings} onSettingsChange={updateSettings} variant="icon" />
                    </div>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <div className="glass rounded-2xl p-12 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                    </div>
                )}

                {/* Content */}
                {ramadanData && !isLoading && (
                    <div className="space-y-12">
                        {/* Hero: Today's Status */}
                        {heroDay && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden rounded-[32px] border border-emerald-500/20 bg-gradient-to-b from-teal-950/50 to-slate-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.05)]"
                            >
                                {/* Decorative Glows */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />

                                <div className="relative p-8 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                            Today • {heroDay.date.hijri.day} Ramadan
                                        </span>
                                        {timezoneDisplay && (
                                            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                {timezoneDisplay}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-8">
                                        <div className="text-center">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{t.prayer?.imsak || 'Suhoor Ends'}</p>
                                            <p className="text-3xl font-bold text-teal-300 font-mono">{cleanTime(heroDay.timings.Imsak)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{t.prayer?.maghrib || 'Iftar Time'}</p>
                                            <p className="text-3xl font-bold text-amber-400 font-mono drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">{cleanTime(heroDay.timings.Maghrib)}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar (Visual Only for now) */}
                                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden max-w-xs mx-auto mb-4">
                                        <div className="absolute top-0 left-0 h-full w-[40%] bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" />
                                    </div>
                                    <p className="text-xs text-slate-500">Fasting in progress</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Timeline */}
                        <div className="relative pl-4 md:pl-8 border-l border-white/10 space-y-8">
                            {ramadanData.map((day, index) => {
                                const hijriDate = day.date.hijri
                                const gregorianDate = day.date.gregorian
                                const dayNumber = parseInt(hijriDate.day)
                                const isToday = index === currentDayIndex
                                const isPast = index < currentDayIndex
                                const isLaylatulQadr = dayNumber === 27

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={cn(
                                            "relative pl-8 md:pl-12 transition-all duration-300",
                                            isPast ? "opacity-60 grayscale-[0.5]" : "opacity-100"
                                        )}
                                    >
                                        {/* Timeline Node */}
                                        <div className={cn(
                                            "absolute -left-[5px] md:-left-[5px] top-6 w-3 h-3 rounded-full border-2 transition-all duration-300",
                                            isToday
                                                ? "bg-emerald-500 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-125"
                                                : "bg-slate-900 border-slate-600"
                                        )}>
                                            {isToday && <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />}
                                        </div>

                                        {/* Card */}
                                        <div className={cn(
                                            "glass rounded-2xl p-4 md:p-6 transition-all duration-300 border",
                                            isToday
                                                ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                                                : "border-white/5 hover:border-white/10 hover:bg-white/5"
                                        )}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className={cn(
                                                        "text-lg font-bold mb-1",
                                                        isToday ? "text-emerald-400" : "text-slate-200"
                                                    )}>
                                                        {day.date.hijri.day} Ramadan
                                                    </h3>
                                                    <p className="text-sm text-slate-400">{day.date.readable}</p>
                                                    {dayNumber === 1 && (
                                                        <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                            First Day
                                                        </span>
                                                    )}
                                                    {isLaylatulQadr && (
                                                        <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                                            Laylatul Qadr
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{t.prayer?.imsak}</p>
                                                        <p className={cn(
                                                            "font-mono font-medium",
                                                            isToday ? "text-teal-300" : "text-slate-300"
                                                        )}>{cleanTime(day.timings.Imsak)}</p>
                                                    </div>
                                                    <div className="w-px h-8 bg-white/10" />
                                                    <div className="text-center">
                                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{t.prayer?.maghrib}</p>
                                                        <p className={cn(
                                                            "font-mono font-bold",
                                                            isToday ? "text-amber-400" : "text-slate-200"
                                                        )}>{cleanTime(day.timings.Maghrib)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

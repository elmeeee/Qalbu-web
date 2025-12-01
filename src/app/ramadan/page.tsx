'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Loader2, Moon, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
                    console.error('Geolocation error:', error)
                    // Keep default country
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

    const updateSettings = (newSettings: Partial<PrayerSettings>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        localStorage.setItem('prayer-settings', JSON.stringify(updated))
    }

    const getTranslatedPrayerName = (name: string) => {
        const key = name.toLowerCase() as keyof typeof t.prayer
        return t.prayer[key] || name
    }

    return (
        <div className={`min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4 ${isPwa ? 'pb-24' : ''}`}>
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center relative"
                >
                    {!isPwa && (
                        <div className="absolute left-0 top-0">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t.common.home}</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-3 mb-4 pt-12 md:pt-0">
                        <Moon className="h-10 w-10 text-blue-600" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            {t.ramadan?.title || 'Ramadan Prayer Times 2026'}
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t.ramadan?.description || 'View prayer times for the blessed month of Ramadan across different countries'}
                    </p>
                </motion.div>

                {/* Controls */}
                <Card className="premium-card mb-6">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            {/* Country Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="country" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    {t.ramadan?.selectCountry || 'Select Country'}
                                </Label>
                                <Select
                                    value={selectedCountry.code}
                                    onValueChange={(code) => {
                                        const country = COUNTRIES.find((c) => c.code === code)
                                        if (country) setSelectedCountry(country)
                                    }}
                                >
                                    <SelectTrigger id="country">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {COUNTRIES.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Year Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="year" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    {t.ramadan?.hijriYear || 'Hijri Year'}
                                </Label>
                                <Select
                                    value={hijriYear.toString()}
                                    onValueChange={(value) => setHijriYear(parseInt(value))}
                                >
                                    <SelectTrigger id="year">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1447">1447 AH (2026 CE)</SelectItem>
                                        <SelectItem value="1448">1448 AH (2027 CE)</SelectItem>
                                        <SelectItem value="1449">1449 AH (2028 CE)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Settings Button */}
                            <div>
                                <PrayerSettingsDialog settings={settings} onSettingsChange={updateSettings} variant="button" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loading State */}
                {isLoading && (
                    <Card className="premium-card">
                        <CardContent className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </CardContent>
                    </Card>
                )}

                {/* Error State */}
                {error && (
                    <Card className="premium-card border-destructive/50">
                        <CardContent className="p-8 text-center">
                            <p className="text-destructive">{t.common.error}</p>
                            <p className="mt-2 text-sm text-muted-foreground">{error.toString()}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Calendar Grid */}
                {ramadanData && !isLoading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {ramadanData.map((day, index) => {
                            const hijriDate = day.date.hijri
                            const gregorianDate = day.date.gregorian
                            const dayNumber = parseInt(hijriDate.day)

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    <Card className={`premium-card ${dayNumber === 1 || dayNumber === 27 ? 'border-blue-500 shadow-lg shadow-blue-500/20' : ''}`}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                                                        {hijriDate.day}
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-bold">
                                                            {hijriDate.weekday.en}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground font-normal">
                                                            {gregorianDate.day} {gregorianDate.month.en} {gregorianDate.year}
                                                        </p>
                                                    </div>
                                                </div>
                                                {dayNumber === 1 && (
                                                    <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                                                        {t.ramadan?.firstDay || 'First Day'}
                                                    </span>
                                                )}
                                                {dayNumber === 27 && (
                                                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                                        {t.ramadan?.laylatulQadr || 'Laylatul Qadr'}
                                                    </span>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {/* Imsak (Suhoor ends) */}
                                                <div className="text-center p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {t.prayer?.imsak || 'Imsak'}
                                                    </p>
                                                    <p className="font-semibold text-purple-700 dark:text-purple-400">
                                                        {day.timings.Imsak}
                                                    </p>
                                                </div>

                                                {/* Fajr */}
                                                <div className="text-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {getTranslatedPrayerName('Fajr')}
                                                    </p>
                                                    <p className="font-semibold text-blue-700 dark:text-blue-400">
                                                        {day.timings.Fajr}
                                                    </p>
                                                </div>

                                                {/* Sunrise (Iftar ends) */}
                                                <div className="text-center p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {t.prayer?.sunrise || 'Sunrise'}
                                                    </p>
                                                    <p className="font-semibold text-orange-700 dark:text-orange-400">
                                                        {day.timings.Sunrise}
                                                    </p>
                                                </div>

                                                {/* Dhuhr */}
                                                <div className="text-center p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {getTranslatedPrayerName('Dhuhr')}
                                                    </p>
                                                    <p className="font-semibold text-amber-700 dark:text-amber-400">
                                                        {day.timings.Dhuhr}
                                                    </p>
                                                </div>

                                                {/* Asr */}
                                                <div className="text-center p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {getTranslatedPrayerName('Asr')}
                                                    </p>
                                                    <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                                                        {day.timings.Asr}
                                                    </p>
                                                </div>

                                                {/* Maghrib (Iftar) */}
                                                <div className="text-center p-2 rounded-lg bg-rose-100 dark:bg-rose-900/20">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {getTranslatedPrayerName('Maghrib')} ⭐
                                                    </p>
                                                    <p className="font-semibold text-rose-700 dark:text-rose-400">
                                                        {day.timings.Maghrib}
                                                    </p>
                                                </div>

                                                {/* Isha */}
                                                <div className="text-center p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 sm:col-span-2">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {getTranslatedPrayerName('Isha')}
                                                    </p>
                                                    <p className="font-semibold text-indigo-700 dark:text-indigo-400">
                                                        {day.timings.Isha}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* Info Card */}
                <Card className="premium-card mt-6 overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 rounded-full bg-white/20 p-3 backdrop-blur-sm">
                                <Moon className="h-6 w-6 text-white" />
                            </div>
                            <div className="space-y-3 text-sm flex-1">
                                <p className="font-bold text-lg text-white">
                                    {t.ramadan?.infoTitle || 'About Ramadan Prayer Times'}
                                </p>
                                <ul className="space-y-2 text-white/95">
                                    <li className="flex items-start gap-2">
                                        <span className="text-xl">⭐</span>
                                        <span><strong className="text-white">Maghrib</strong> - {t.ramadan?.iftarTime || 'Iftar (breaking fast) time'}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-xl">🌙</span>
                                        <span><strong className="text-white">Imsak</strong> - {t.ramadan?.imsakTime || 'Suhoor (pre-dawn meal) ends'}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-xl">🌅</span>
                                        <span><strong className="text-white">Fajr</strong> - {t.ramadan?.fajrTime || 'Fasting begins'}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-xl">✨</span>
                                        <span><strong className="text-white">{t.ramadan?.laylatulQadr || 'Laylatul Qadr'}</strong> - {t.ramadan?.laylatulQadrDesc || 'The Night of Power, often observed on the 27th night'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


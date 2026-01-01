'use client'

import { useState } from 'react'
import { Settings, Search, MapPin, Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
    CALCULATION_METHODS,
    JURISTIC_SCHOOLS,
    LATITUDE_ADJUSTMENTS,
    MIDNIGHT_MODES,
    type PrayerSettings,
    type Coordinates,
    type LocationData,
    searchCity,
} from '@/lib/api/prayer-times'
import { useLanguage } from '@/contexts/language-context'

interface PrayerSettingsDialogProps {
    settings: PrayerSettings
    onSettingsChange: (settings: Partial<PrayerSettings>) => void
    onLocationChange?: (coords: Coordinates, location: LocationData) => void
    variant?: 'icon' | 'button' // icon for compact, button for full
}

export function PrayerSettingsDialog({ settings, onSettingsChange, onLocationChange, variant = 'icon' }: PrayerSettingsDialogProps) {
    const [open, setOpen] = useState(false)
    const { t } = useLanguage()
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<(LocationData & Coordinates)[]>([])

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsSearching(true)
        const results = await searchCity(searchQuery)
        setSearchResults(results)
        setIsSearching(false)
    }

    const handleLocationSelect = (result: LocationData & Coordinates) => {
        if (onLocationChange) {
            onLocationChange(
                { latitude: result.latitude, longitude: result.longitude },
                {
                    city: result.city,
                    region: result.region,
                    country: result.country,
                    countryCode: result.countryCode,
                    formatted: result.formatted
                }
            )
            setOpen(false)
            setSearchResults([])
            setSearchQuery('')
        }
    }

    const handleSettingChange = (newSettings: Partial<PrayerSettings>) => {
        onSettingsChange(newSettings)
        // Close dialog after a short delay to show the change
        setTimeout(() => setOpen(false), 300)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant === 'icon' ? (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/40 dark:bg-white/10 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-white/20 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 shadow-lg shadow-emerald-500/5 border border-white/60 dark:border-white/20 transition-all"
                        title={t.prayer?.settings || 'Settings'}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button variant="outline" size="default" className="gap-2 bg-white hover:bg-white/90 text-teal-600 hover:text-teal-700 border-white/20">
                        <Settings className="h-4 w-4" />
                        {t.prayer?.settings || 'Settings'}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[380px] p-0 overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-emerald-500/10 shadow-2xl shadow-emerald-500/10 rounded-3xl block">
                <div className="max-h-[50vh] flex flex-col w-full">
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 border-b border-emerald-500/10 bg-gradient-to-b from-emerald-500/5 to-transparent shrink-0">
                        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            {t.prayer?.settingsTitle || 'Prayer Time Settings'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t.prayer?.settingsDescription || 'Customize how your prayer times are calculated'}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Content - Scrollable */}
                    <div className="overflow-y-auto p-6 min-h-0">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Location Search */}
                            <div className="space-y-3 p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 transition-colors group">
                                <Label className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                                    {t.prayer?.changeLocation || 'Location'}
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    {t.prayer?.locationDescription || 'Search and select your city manually if autodetection is inaccurate'}
                                </p>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Input
                                            placeholder="Search city (e.g. South Tangerang)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="pr-10 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10"
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute right-1 top-1 h-9 w-9 text-slate-500 hover:text-emerald-600"
                                            onClick={handleSearch}
                                            disabled={isSearching}
                                        >
                                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        </Button>
                                    </div>

                                    {searchResults.length > 0 && (
                                        <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-slate-900/50">
                                            {searchResults.map((result, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleLocationSelect(result)}
                                                    className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
                                                >
                                                    <div className="font-medium text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                                        <MapPin className="h-3 w-3 text-emerald-500" />
                                                        {result.formatted?.split(',')[0]}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 pl-5 truncate">
                                                        {result.formatted}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Calculation Method */}
                            <div className="space-y-3 p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 transition-colors group">
                                <Label htmlFor="method" className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                                    {t.prayer?.calculationMethod || 'Calculation Method'}
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    {t.prayer?.methodDescription || 'Different regions use different calculation methods for Fajr and Isha times'}
                                </p>
                                <Select
                                    value={settings.method.toString()}
                                    onValueChange={(value) => handleSettingChange({ method: parseInt(value) })}
                                >
                                    <SelectTrigger id="method" className="h-11 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:ring-emerald-500/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CALCULATION_METHODS.map((method) => (
                                            <SelectItem key={method.id} value={method.id.toString()}>
                                                {method.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Juristic School */}
                            <div className="space-y-3 p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 transition-colors group">
                                <Label htmlFor="school" className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                                    {t.prayer?.juristicSchool || 'Juristic School (Madhab)'}
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    {t.prayer?.schoolDescription || 'Affects Asr prayer time calculation. Shafi is used by Shafi\'i, Maliki, Hanbali, and Shia schools.'}
                                </p>
                                <Select
                                    value={settings.school.toString()}
                                    onValueChange={(value) => handleSettingChange({ school: parseInt(value) })}
                                >
                                    <SelectTrigger id="school" className="h-11 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:ring-emerald-500/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JURISTIC_SCHOOLS.map((school) => (
                                            <SelectItem key={school.id} value={school.id.toString()}>
                                                {school.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Higher Latitude Adjustment */}
                            <div className="space-y-3 p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 transition-colors group">
                                <Label htmlFor="latitude" className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                                    {t.prayer?.latitudeAdjustment || 'Higher Latitude Adjustment'}
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    {t.prayer?.latitudeDescription || 'For locations at higher latitudes where twilight is continuous during certain times of the year'}
                                </p>
                                <Select
                                    value={settings.latitudeAdjustment.toString()}
                                    onValueChange={(value) => handleSettingChange({ latitudeAdjustment: parseInt(value) })}
                                >
                                    <SelectTrigger id="latitude" className="h-11 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:ring-emerald-500/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LATITUDE_ADJUSTMENTS.map((adjustment) => (
                                            <SelectItem key={adjustment.id} value={adjustment.id.toString()}>
                                                {adjustment.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Midnight Mode */}
                            <div className="space-y-3 p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 transition-colors group">
                                <Label htmlFor="midnight" className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                                    {t.prayer?.midnightMode || 'Midnight Calculation Mode'}
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    {t.prayer?.midnightDescription || 'Determines how midnight is calculated, which affects the end time of Isha'}
                                </p>
                                <Select
                                    value={settings.midnightMode.toString()}
                                    onValueChange={(value) => handleSettingChange({ midnightMode: parseInt(value) })}
                                >
                                    <SelectTrigger id="midnight" className="h-11 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:ring-emerald-500/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MIDNIGHT_MODES.map((mode) => (
                                            <SelectItem key={mode.id} value={mode.id.toString()}>
                                                {mode.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Current Settings Summary */}
                        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-emerald-500/20">
                            <h4 className="font-bold text-base text-teal-700 dark:text-teal-300 mb-4 flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                {t.prayer?.currentSettings || 'Current Configuration'}
                            </h4>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-500/10">
                                    <span className="text-slate-500 dark:text-slate-400">Method</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-right max-w-[60%] truncate">
                                        {CALCULATION_METHODS.find((m) => m.id === settings.method)?.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-500/10">
                                    <span className="text-slate-500 dark:text-slate-400">School</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-right">
                                        {JURISTIC_SCHOOLS.find((s) => s.id === settings.school)?.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-500/10">
                                    <span className="text-slate-500 dark:text-slate-400">Latitude</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-right">
                                        {LATITUDE_ADJUSTMENTS.find((l) => l.id === settings.latitudeAdjustment)?.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-500/10">
                                    <span className="text-slate-500 dark:text-slate-400">Midnight</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-right">
                                        {MIDNIGHT_MODES.find((m) => m.id === settings.midnightMode)?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'
import { SURAHS } from './quran-reels'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'

interface LastRead {
    surah: number
    ayah: number
    timestamp: number
}

export function LastReadWidget() {
    const { language } = useLanguage()
    const [lastRead, setLastRead] = useState<LastRead | null>(null)
    const router = useRouter()

    useEffect(() => {
        const stored = localStorage.getItem('quran-last-read')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                if (parsed && typeof parsed.surah === 'number' && typeof parsed.ayah === 'number') {
                    setLastRead(parsed)
                }
            } catch (e) {
                console.error('Failed to parse last read:', e)
            }
        }
    }, [])

    if (!lastRead) return null

    // Get Surah details
    // SURAHS array is 0-indexed? No, it often starts with Al-Fatihah at index 0 but has number 1.
    // Let's check SURAHS definition in quran-reels.
    // { number: 1, name: 'Al-Fatihah', ... }
    // So SURAHS[0] is Al-Fatihah (number 1).
    // SURAHS[lastRead.surah - 1] should be the correct one.
    const surahData = SURAHS[lastRead.surah - 1]

    if (!surahData) return null

    const t = {
        en: { continue: 'Continue Reading', ayah: 'Ayah', justNow: 'Just now', m: 'min', h: 'hr', d: 'd', y: 'y', ago: 'ago' },
        id: { continue: 'Lanjutkan Membaca', ayah: 'Ayat', justNow: 'Baru saja', m: 'mnt', h: 'jam', d: 'hr', y: 'thn', ago: 'lalu' },
        ms: { continue: 'Teruskan Membaca', ayah: 'Ayat', justNow: 'Baru sahaja', m: 'min', h: 'jam', d: 'hr', y: 'thn', ago: 'lalu' }
    }[language] || { continue: 'Continue Reading', ayah: 'Ayah', justNow: 'Just now', m: 'min', h: 'hr', d: 'd', y: 'y', ago: 'ago' } // Default fallback

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000)

        if (seconds < 60) return t.justNow

        const intervalYear = seconds / 31536000
        if (intervalYear > 1) return `${Math.floor(intervalYear)} ${t.y} ${t.ago}`

        const intervalMonth = seconds / 2592000
        if (intervalMonth > 1) return `${Math.floor(intervalMonth)} mo ${t.ago}`

        const intervalDay = seconds / 86400
        if (intervalDay > 1) return `${Math.floor(intervalDay)} ${t.d} ${t.ago}`

        const intervalHour = seconds / 3600
        if (intervalHour > 1) return `${Math.floor(intervalHour)} ${t.h} ${t.ago}`

        const intervalMinute = seconds / 60
        if (intervalMinute >= 1) return `${Math.floor(intervalMinute)} ${t.m} ${t.ago}`

        return t.justNow
    }

    const handleContinue = () => {
        router.push(`/quran?surah=${lastRead.surah}&ayah=${lastRead.ayah}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div
                onClick={handleContinue}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 p-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 cursor-pointer"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                    <BookOpen className="w-24 h-24 text-emerald-400 rotate-12" />
                </div>

                {/* Glow Effect */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">{t.continue}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-1">
                            {surahData.name}
                        </h3>
                        <p className="text-emerald-200/80 text-sm font-medium">
                            {t.ayah} {lastRead.ayah} • {timeAgo(lastRead.timestamp)}
                        </p>
                    </div>

                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors border border-emerald-500/30 shadow-inner shadow-emerald-500/20">
                        <ChevronRight className="w-6 h-6 text-emerald-400" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

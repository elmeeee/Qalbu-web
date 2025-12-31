'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'
import { SURAHS } from './quran-reels' // Import only if exported, otherwise we define a minimal version or move constants
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LastRead {
    surah: number
    ayah: number
    timestamp: number
}

// Minimal Surah data if not exported from quran-reels
const SURAH_NAMES = [
    '', 'Al-Fatihah', 'Al-Baqarah', 'Ali \'Imran', 'An-Nisa', 'Al-Ma\'idah', 'Al-An\'am', 'Al-A\'raf', 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Taha', 'Al-Anbya', 'Al-Hajj', 'Al-Mu\'minun', 'An-Nur', 'Al-Furqan', 'Ash-Shu\'ara', 'An-Naml', 'Al-Qasas', 'Al-\'Ankabut', 'Ar-Rum', 'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba', 'Fatir', 'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir', 'Fussilat', 'Ash-Shuraa', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiyah', 'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf', 'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman', 'Al-Waqi\'ah', 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahanah', 'As-Saf', 'Al-Jumu\'ah', 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq', 'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', 'Al-Ma\'arij', 'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyamah', 'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Nazi\'at', 'Abasa', 'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj', 'At-Tariq', 'Al-A\'la', 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad', 'Ash-Shams', 'Al-Layl', 'Ad-Duhaa', 'Ash-Sharh', 'At-Tin', 'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-Adiyat', 'Al-Qari\'ah', 'At-Takathur', 'Al-Asr', 'Al-Humazah', 'Al-Fil', 'Quraysh', 'Al-Ma\'un', 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr', 'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
]

export function LastReadWidget() {
    const [lastRead, setLastRead] = useState<LastRead | null>(null)
    const router = useRouter()

    useEffect(() => {
        const stored = localStorage.getItem('quran-last-read')
        if (stored) {
            try {
                setLastRead(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse last read:', e)
            }
        }
    }, [])

    if (!lastRead) return null

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000)

        let interval = seconds / 31536000
        if (interval > 1) return Math.floor(interval) + " years ago"

        interval = seconds / 2592000
        if (interval > 1) return Math.floor(interval) + " months ago"

        interval = seconds / 86400
        if (interval > 1) return Math.floor(interval) + " days ago"

        interval = seconds / 3600
        if (interval > 1) return Math.floor(interval) + " hours ago"

        interval = seconds / 60
        if (interval > 1) return Math.floor(interval) + " minutes ago"

        return "Just now"
    }

    const handleContinue = () => {
        // Navigate to Quran page with query params or handle state
        // For now, assuming navigation to /quran handles setting initial state via props or URL params if implemented
        // Since QuranReels is SPA-like, we might need a way to pass this.
        // For PWA mode, we might need to dispatch an event or use query params.

        // Simulating navigation by dispatching a custom event that QuranReels listens to
        // or saving a 'resume' flag.

        // Let's use a URL parameter approach if supported, otherwise just update storage to 'pending_resume'
        // But since we are on the same PWA page usually, or navigating to it:

        // If we route to /quran?surah=X&ayah=Y
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
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen className="w-24 h-24 text-emerald-400 rotate-12" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Continue Reading</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-1">
                            {SURAH_NAMES[lastRead.surah]}
                        </h3>
                        <p className="text-emerald-200/80 text-sm font-medium">
                            Ayah {lastRead.ayah} • {timeAgo(lastRead.timestamp)}
                        </p>
                    </div>

                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
                        <ChevronRight className="w-6 h-6 text-emerald-400" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

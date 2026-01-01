'use client'

import { motion } from 'framer-motion'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { PrayerSettingsDialog } from '@/components/prayer/prayer-settings-dialog'
import { PrayerTimesWidgetPWA } from '@/components/prayer/prayer-times-widget-pwa'
import { DailyHadithWidget } from '@/components/hadith/daily-hadith-widget'

import { IslamicHolidaysWidgetPWA } from '@/components/islamic/islamic-holidays-widget-pwa'
import { NearbyMosqueCard, LastReadWidget, FavoriteAyahsWidget } from '@/components/pwa'
import { useLanguage } from '@/contexts/language-context'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { AdhanManager } from '@/components/pwa/adhan-manager'

// Enhanced animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
}

const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 20
        }
    }
}

export default function PWAHome() {
    const { settings, updateSettings } = usePrayerTimes()

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-24 relative overflow-hidden">
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

            <AdhanManager />

            <motion.div
                className="container mx-auto px-4 py-6 space-y-6 relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* PWA Header - Fixed & Premium Glass */}
                <motion.div
                    variants={headerVariants}
                    className="fixed top-0 left-0 right-0 z-50 px-6 pb-4 pt-safe mt-safe-top bg-white/90 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5 flex items-center justify-between transition-all duration-300"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 dark:from-teal-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            Qalbu
                        </h1>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <LanguageSwitcher />
                        <ModeToggle />
                        <PrayerSettingsDialog settings={settings} onSettingsChange={updateSettings} variant="icon" />
                    </motion.div>
                </motion.div>

                {/* Spacer for Fixed Header */}
                <div className="h-20 pt-safe" />

                {/* 0. Last Read Widget */}
                <motion.div variants={itemVariants}>
                    <LastReadWidget />
                </motion.div>

                {/* 0.5. Favorite Ayahs Widget */}
                <motion.div variants={itemVariants}>
                    <FavoriteAyahsWidget />
                </motion.div>

                {/* 1. Prayer Times Widget - ENHANCED */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <PrayerTimesWidgetPWA />
                </motion.div>



                {/* 3. Nearby Mosque Card */}
                <motion.div variants={itemVariants}>
                    <NearbyMosqueCard />
                </motion.div>

                {/* 4. Islamic Holidays Widget */}
                <motion.div variants={itemVariants}>
                    <IslamicHolidaysWidgetPWA />
                </motion.div>

            </motion.div>
        </main>
    )
}

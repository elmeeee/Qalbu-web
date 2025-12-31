'use client'

import { motion } from 'framer-motion'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { PrayerSettingsDialog } from '@/components/prayer/prayer-settings-dialog'
import { PrayerTimesWidgetPWA } from '@/components/prayer/prayer-times-widget-pwa'
import { DailyHadithWidget } from '@/components/hadith/daily-hadith-widget'
import { DailyDuaWidget } from '@/components/dua/daily-dua-widget'
import { IslamicHolidaysWidgetPWA } from '@/components/islamic/islamic-holidays-widget-pwa'
import { DailyDuaSlider, NearbyMosqueCard, LastReadWidget, FavoriteAyahsWidget } from '@/components/pwa'
import { useLanguage } from '@/contexts/language-context'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import { AdhanManager } from '@/components/pwa/adhan-manager'

export default function PWAHome() {
    const { settings, updateSettings } = usePrayerTimes()

    return (
        <main className="min-h-screen bg-background pb-24">
            <AdhanManager />
            <motion.div
                className="container mx-auto px-4 py-6 space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.15,
                            delayChildren: 0.2
                        }
                    }
                }}
            >
                {/* PWA Header - Fixed & Premium Glass */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
                    className="fixed top-0 left-0 right-0 z-50 px-6 pb-4 pt-safe mt-safe-top bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border-b border-emerald-500/10 shadow-sm shadow-emerald-500/5 flex items-center justify-between transition-all duration-300"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            Qalbu
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ModeToggle />
                        <PrayerSettingsDialog settings={settings} onSettingsChange={updateSettings} variant="icon" />
                    </div>
                </motion.div>

                {/* Spacer for Fixed Header */}
                <div className="h-20 pt-safe" />

                {/* 0. Last Read Widget (Visible if history exists) */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <LastReadWidget />
                </motion.div>

                {/* 0.5. Favorite Ayahs Widget */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <FavoriteAyahsWidget />
                </motion.div>

                {/* 1. Prayer Times Widget */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <PrayerTimesWidgetPWA />
                </motion.div>

                {/* 2. Daily Dua Slider */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <DailyDuaSlider />
                </motion.div>

                {/* 3. Nearby Mosque Card */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <NearbyMosqueCard />
                </motion.div>

                {/* 4. Islamic Holidays Widget */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <IslamicHolidaysWidgetPWA />
                </motion.div>

            </motion.div>
        </main>
    )
}

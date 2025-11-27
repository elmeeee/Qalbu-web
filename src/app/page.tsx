'use client'

import { useState, useEffect } from 'react'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Compass, Clock, Moon, Heart, Shield, Smartphone, ChevronRight, MapPin } from 'lucide-react'
import { PrayerTimesWidget } from '@/components/prayer/prayer-times-widget'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useLanguage } from '@/contexts/language-context'

import { DailyHadithWidget } from '@/components/hadith/daily-hadith-widget'

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
}

import { useInstallPrompt } from '@/hooks/use-install-prompt'

export default function HomePage() {
    const { t } = useLanguage()
    const { isInstallable, promptInstall } = useInstallPrompt()
    const [mounted, setMounted] = useState(false)
    const [isPwa, setIsPwa] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check if running in standalone mode (PWA)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsPwa(true)
        }
    }, [])

    if (!mounted) {
        return null // or a loading skeleton
    }

    return (
        <main className="min-h-screen overflow-x-hidden bg-background selection:bg-gold-100 selection:text-gold-900">
            {/* Background Gradients */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black">
                <div className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-[30%] -translate-y-[20%] rounded-full bg-gold-200/20 blur-[100px] dark:bg-gold-900/20" />
                <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-[30%] -translate-y-[20%] rounded-full bg-sand-200/20 blur-[100px] dark:bg-sand-900/20" />
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16">
                {/* Navigation / Header */}
                <nav className="mb-16 flex items-center justify-between">
                    <div className="flex flex-col items-center gap-0.5">
                        <div className="relative h-[40px] w-[56px] overflow-hidden rounded-xl shadow-sm">
                            <Image
                                src="/icons/qalbuIconBlack.png"
                                alt="Qalbu Logo"
                                width={56}
                                height={40}
                                className="h-full w-full object-contain block dark:hidden"
                                priority
                            />
                            <Image
                                src="/icons/qalbuIcon.png"
                                alt="Qalbu Logo"
                                width={56}
                                height={40}
                                className="h-full w-full object-contain hidden dark:block"
                                priority
                            />
                        </div>
                        <span className="text-[8px] font-medium tracking-wider text-black dark:text-white text-center uppercase opacity-60 leading-none mt-0.5">
                            For nurturing your faith
                        </span>
                    </div>
                    <div className="flex items-center gap-4"> {/* Changed gap-2 to gap-4 */}
                        <ModeToggle />
                        <LanguageSwitcher />
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            Sign In
                        </Button>
                        {isInstallable && (
                            <Button
                                onClick={promptInstall}
                                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                            >
                                Install App
                            </Button>
                        )}
                    </div>
                </nav>

                {/* Hero Section - Only show if NOT in PWA mode */}
                {!isPwa && (
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center mb-24">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="text-center lg:text-left"
                        >
                            <motion.div variants={fadeInUp} className="mb-6 flex justify-center lg:justify-start">
                                <span className="rounded-full border border-gold-200 bg-gold-50 px-4 py-1.5 text-sm font-medium text-gold-800 dark:border-gold-800 dark:bg-gold-950/30 dark:text-gold-300">
                                    {t.home.hero.badge}
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
                            >
                                {t.home.hero.title}
                                <span className="block text-3xl font-light text-muted-foreground md:text-5xl lg:text-6xl mt-2">
                                    {t.home.hero.subtitle}
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed lg:mx-0"
                            >
                                {t.home.hero.description}
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                                <Button size="lg" className="h-12 rounded-full px-8 text-base bg-gold-600 hover:bg-gold-700 text-white shadow-lg shadow-gold-500/20">
                                    {t.home.hero.getStarted}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-base">
                                    {t.home.hero.viewFeatures}
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Hero Image / App Screenshot */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative mx-auto max-w-[300px] lg:max-w-md"
                        >
                            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-gold-500 to-sand-500 opacity-20 blur-3xl" />
                            <div className="relative rounded-[2.5rem] border-8 border-white bg-black shadow-2xl dark:border-gray-800 overflow-hidden">
                                <Image
                                    src="/icons/qalbuApp.png"
                                    alt="Qalbu App Interface"
                                    width={400}
                                    height={800}
                                    className="h-auto w-full"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Prayer Times Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <PrayerTimesWidget variant="horizontal" />
                </motion.div>

                {/* Daily Hadith Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <DailyHadithWidget />
                </motion.div>

                {/* Main Features Grid */}
                <div className="mb-12 grid gap-4 md:grid-cols-2">
                    {/* Quran Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative overflow-hidden rounded-3xl bg-sand-50 p-8 dark:bg-gray-900"
                    >
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm text-gold-600 shadow-sm dark:bg-gray-800/80">
                                    <Image
                                        src="/icons/Quran.svg"
                                        alt="Quran"
                                        width={40}
                                        height={40}
                                        className="h-10 w-10"
                                    />
                                </div>
                                <h3 className="mb-3 text-2xl font-bold">{t.home.features.quran.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t.home.features.quran.description}
                                </p>
                            </div>
                            <Link href="/quran" className="mt-6 inline-block">
                                <Button variant="link" className="h-auto p-0 text-lg font-semibold text-gold-600 hover:text-gold-700">
                                    {t.home.features.quran.action} <ChevronRight className="ml-1 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                        <div className="absolute -bottom-12 -right-12 h-64 w-64 opacity-10 grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-20 rotate-12">
                            <Image src="/icons/Quran.svg" alt="Quran Background" width={512} height={512} className="h-full w-full object-contain" />
                        </div>
                    </motion.div>

                    {/* Qibla Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="group relative overflow-hidden rounded-3xl bg-blue-50 p-8 dark:bg-blue-950/20"
                    >
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                                    <Compass className="h-8 w-8" />
                                </div>
                                <h3 className="mb-3 text-2xl font-bold">{t.home.features.qibla.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t.home.features.qibla.description}
                                </p>
                            </div>
                            <Link href="/qibla" className="mt-6 inline-block">
                                <Button variant="link" className="h-auto p-0 text-lg font-semibold text-blue-600 hover:text-blue-700">
                                    Find Direction <ChevronRight className="ml-1 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Explore Section */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold">Explore More</h2>
                    </motion.div>

                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        {/* Ramadan Calendar */}
                        <Link href="/ramadan">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="group h-full rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                                    <Moon className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-base font-bold">{t.ramadan.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">{t.ramadan.subtitle}</p>
                            </motion.div>
                        </Link>

                        {/* Daily Doas */}
                        <Link href="/doa">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="group h-full rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                                    <Heart className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-base font-bold">{t.doas.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">{t.doas.subtitle}</p>
                            </motion.div>
                        </Link>

                        {/* Prophets Stories */}
                        <Link href="/prophets">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="group h-full rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-base font-bold">{t.prophets.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">{t.prophets.subtitle}</p>
                            </motion.div>
                        </Link>

                        {/* Prayer Guide */}
                        <Link href="/prayer-guide">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="group h-full rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                                    <Compass className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-base font-bold">{t.prayerGuide.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">{t.prayerGuide.subtitle}</p>
                            </motion.div>
                        </Link>

                        {/* Nearby Mosques */}
                        <Link href="/mosques">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="group h-full rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h3 className="mb-1 text-base font-bold">Nearby Mosques</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">Find the nearest place of worship</p>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                {/* Rich Footer - Only show if NOT in PWA mode */}
                {!isPwa && (
                    <div className="mt-24">
                        {/* Features Grid */}
                        <div className="grid gap-8 md:grid-cols-3 mb-24">
                            <div className="bg-card rounded-3xl p-8 border border-border/50">
                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                                    <Smartphone className="h-6 w-6 text-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Stay Connected</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Keep your heart connected to your Creator with daily reminders and easy access to worship tools.
                                </p>
                            </div>
                            <div className="bg-card rounded-3xl p-8 border border-border/50">
                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                                    <Shield className="h-6 w-6 text-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Stay Private</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Your spiritual journey is personal. We respect your privacy with no tracking or data selling.
                                </p>
                            </div>
                            <div className="bg-card rounded-3xl p-8 border border-border/50">
                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                                    <Heart className="h-6 w-6 text-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Stay Faithful</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Nurture your iman with a companion that understands and supports your Islamic lifestyle.
                                </p>
                            </div>
                        </div>

                        {/* Main Footer */}
                        <div className="rounded-[3rem] bg-black text-white p-12 md:p-24 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Qalbu</h2>
                            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                                Your indispensable companion for embracing an Islamic lifestyle.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                                <Button className="h-12 rounded-full bg-white text-black hover:bg-gray-200 px-8">
                                    Download for iOS
                                </Button>
                                <Button variant="outline" className="h-12 rounded-full border-gray-700 text-white hover:bg-gray-900 px-8 bg-transparent">
                                    Download for Android
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500">
                                {t.home.footer.copyright}
                            </p>
                        </div>
                    </div>
                )}

                {/* Simple Footer - Only show in PWA mode */}
                {isPwa && (
                    <div className="text-center py-8 border-t border-border/40">
                        <p className="text-xs text-muted-foreground">
                            {t.home.footer.copyright}
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}

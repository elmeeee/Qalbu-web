'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Compass, Clock, Moon, Heart, Shield, Smartphone, ChevronRight } from 'lucide-react'
import { PrayerTimesWidget } from '@/components/prayer/prayer-times-widget'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

export default function HomePage() {
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
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 text-white">
                            <span className="text-lg">🕌</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Qalbu</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            Sign In
                        </Button>
                        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                            Download App
                        </Button>
                    </div>
                </nav>

                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="mx-auto mb-24 max-w-4xl text-center"
                >
                    <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
                        <span className="rounded-full border border-gold-200 bg-gold-50 px-4 py-1.5 text-sm font-medium text-gold-800 dark:border-gold-800 dark:bg-gold-950/30 dark:text-gold-300">
                            Your Spiritual Companion
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
                    >
                        Qalbu
                        <span className="block text-3xl font-light text-muted-foreground md:text-5xl lg:text-6xl mt-2">
                            For nurturing your faith
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed"
                    >
                        Embrace an Islamic lifestyle with Qalbu: Your all-in-one app for prayer times,
                        Quranic readings, and supplications.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="h-12 rounded-full px-8 text-base bg-gold-600 hover:bg-gold-700 text-white shadow-lg shadow-gold-500/20">
                            Get Started
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-base">
                            View Features
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Live Widget Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto mb-32 max-w-lg"
                >
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-gold-500 to-sand-500 opacity-20 blur-2xl" />
                        <PrayerTimesWidget />
                    </div>
                </motion.div>

                {/* Bento Grid Features */}
                <div className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything you need</h2>
                        <p className="text-muted-foreground">Indispensable tools for your daily spiritual journey</p>
                    </motion.div>

                    <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
                        {/* Quran Card - Large */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-3xl bg-sand-50 p-8 dark:bg-gray-900 md:col-span-2 md:row-span-2"
                        >
                            <div className="relative z-10">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gold-600 shadow-sm dark:bg-gray-800">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-2xl font-bold">The Holy Quran</h3>
                                <p className="max-w-md text-muted-foreground">
                                    Complete 30 Juz with beautiful Arabic typography, translations, and audio recitations by Mishary Alafasy.
                                </p>
                                <Link href="/quran">
                                    <Button variant="link" className="mt-4 h-auto p-0 text-gold-600 hover:text-gold-700">
                                        Read Now <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="absolute -bottom-10 -right-10 h-64 w-64 opacity-10 grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-20">
                                <Image src="/icon-512.png" alt="Quran" width={512} height={512} className="h-full w-full object-contain" />
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
                            <div className="relative z-10">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                                    <Compass className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Qibla Finder</h3>
                                <p className="text-sm text-muted-foreground">
                                    AR-powered compass to find the Kaaba direction anywhere.
                                </p>
                                <Link href="/qibla">
                                    <div className="absolute inset-0" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Prayer Times Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="group relative overflow-hidden rounded-3xl bg-purple-50 p-8 dark:bg-purple-950/20"
                        >
                            <div className="relative z-10">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/50">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Prayer Times</h3>
                                <p className="text-sm text-muted-foreground">
                                    Precise timings based on your location with adhan notifications.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Value Proposition */}
                <div className="mb-32">
                    <div className="rounded-[2.5rem] bg-foreground p-8 text-background md:p-16">
                        <div className="grid gap-12 md:grid-cols-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center md:text-left"
                            >
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-background/10">
                                    <Smartphone className="h-6 w-6" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold">Stay Connected</h3>
                                <p className="text-background/70">
                                    Keep your heart connected to your Creator with daily reminders and easy access to worship tools.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-center md:text-left"
                            >
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-background/10">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold">Stay Private</h3>
                                <p className="text-background/70">
                                    Your spiritual journey is personal. We respect your privacy with no tracking or data selling.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-center md:text-left"
                            >
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-background/10">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold">Stay Faithful</h3>
                                <p className="text-background/70">
                                    Nurture your iman with a companion that understands and supports your Islamic lifestyle.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        Qalbu
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
                        Your indispensable companion for embracing an Islamic lifestyle.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="rounded-full px-8">
                            Download for iOS
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8">
                            Download for Android
                        </Button>
                    </div>
                    <p className="mt-12 text-sm text-muted-foreground">
                        © 2025 Qalbu. Made with peace and love.
                    </p>
                </motion.div>
            </div>
        </main>
    )
}

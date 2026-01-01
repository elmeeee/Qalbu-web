'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '../ui/separator'
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Heart,
    ArrowRight,
    Download,
    Globe,
    Shield,
    FileText
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function WebFooter() {
    const { t } = useLanguage()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative mt-24 overflow-hidden">
            {/* Organic Shape Background */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/50 -translate-y-full transform" />

            <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 rounded-t-[3rem]">
                <div className="container mx-auto px-4 md:px-8 py-16">

                    {/* Top Section: CTA & Newsletter */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
                        {/* Abstract Pattern */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                {t.home.footer?.ctaTitle || 'Take Qalbu with you.'}
                            </h2>
                            <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                                {t.home.footer?.ctaDescription || 'Download our mobile app to get accurate prayer times, Quran, and more wherever you go.'}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-6 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95">
                                    <Download className="w-4 h-4 mr-2" />
                                    App Store
                                </Button>
                                <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-6 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 bg-transparent">
                                    <Download className="w-4 h-4 mr-2" />
                                    Google Play
                                </Button>
                            </div>
                        </div>

                        <div className="relative z-10 lg:pl-12 border-t lg:border-t-0 lg:border-l border-white/20 pt-12 lg:pt-0">
                            <h3 className="text-xl font-semibold mb-2">{t.home.footer?.newsletterTitle || 'Stay Connected'}</h3>
                            <p className="text-blue-100 mb-6 text-sm">
                                {t.home.footer?.newsletterDescription || 'Join our newsletter for updates on new features and Islamic insights.'}
                            </p>
                            <div className="flex gap-2 relative">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-12 rounded-full border-0 bg-white/10 text-white placeholder:text-blue-200 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/50 pl-6"
                                />
                                <Button size="icon" className="absolute right-1 top-1 bottom-1 h-10 w-10 rounded-full bg-white text-blue-600 hover:bg-blue-50">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Footer Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
                        <div className="col-span-2 lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                                    <Heart className="h-6 w-6 fill-current" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">Qalbu</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                                {t.home.hero.description}
                            </p>
                            <div className="flex gap-4 text-slate-400">
                                <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-800 p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500">
                                    <Facebook className="w-4 h-4" />
                                </Link>
                                <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-800 p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500">
                                    <Twitter className="w-4 h-4" />
                                </Link>
                                <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-800 p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500">
                                    <Instagram className="w-4 h-4" />
                                </Link>
                                <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-800 p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500">
                                    <Youtube className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Features</h4>
                            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                                <li><Link href="/quran" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Al-Quran</Link></li>
                                <li><Link href="/prayer-times" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Prayer Times</Link></li>
                                <li><Link href="/qibla" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Qibla Direction</Link></li>
                                <li><Link href="/mosques" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Nearby Mosques</Link></li>
                                <li><Link href="/calendar" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Calendar</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Resources</h4>
                            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                                <li><Link href="/asma-ul-husna" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Asma Ul Husna</Link></li>

                                <li><Link href="/prophets" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Prophets Stories</Link></li>
                                <li><Link href="/articles" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Articles</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
                            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                                <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
                                <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <Separator className="bg-slate-200 dark:bg-slate-800 mb-8" />

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
                        <p>{t.home.footer?.copyright?.replace('{year}', currentYear.toString()) || `© ${currentYear} Qalbu. Made with peace and love.`}</p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5" />
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" />
                                Terms
                            </Link>
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
                                <Globe className="w-3.5 h-3.5" />
                                English (US)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

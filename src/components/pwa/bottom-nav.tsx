'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Compass, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const tabs = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        href: '/',
    },
    {
        id: 'quran',
        label: 'Quran',
        icon: BookOpen,
        href: '/quran',
    },
    {
        id: 'qibla',
        label: 'Qibla',
        icon: Compass,
        href: '/qibla',
    },
    {
        id: 'ramadan',
        label: 'Ramadan',
        icon: Moon,
        href: '/ramadan',
    },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 mb-2">
            <nav className="relative flex items-center justify-around w-full max-w-sm px-6 py-4 bg-white/75 dark:bg-slate-900/80 backdrop-blur-2xl rounded-full shadow-2xl border border-white/20 dark:border-white/10 ring-1 ring-black/5">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
                    const Icon = tab.icon

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className="relative group flex items-center justify-center"
                        >
                            <div className="relative flex items-center justify-center w-12 h-12">
                                {/* Active Background Glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full blur-md"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -bottom-2 w-1 h-1 bg-emerald-500 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Icon */}
                                <div className={cn(
                                    "relative transition-all duration-300",
                                    isActive ? "transform -translate-y-1" : "group-hover:scale-110"
                                )}>
                                    <Icon
                                        className={cn(
                                            "w-6 h-6 transition-all duration-300",
                                            isActive
                                                ? "text-emerald-600 dark:text-emerald-400 fill-emerald-600/20 dark:fill-emerald-400/20"
                                                : "text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

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
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <nav className="relative flex items-center justify-around w-full px-2 pb-safe pt-3 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-t border-white/20 dark:border-white/10 shadow-lg">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
                    const Icon = tab.icon

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className="relative group flex flex-col items-center justify-center p-2 min-w-[64px]"
                        >
                            <div className="relative flex flex-col items-center justify-center">
                                {/* Active Indicator Glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl blur-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Icon */}
                                <div className={cn(
                                    "relative transition-all duration-300 mb-1",
                                    isActive ? "transform -translate-y-1" : "group-hover:scale-110"
                                )}>
                                    <Icon
                                        className={cn(
                                            "w-6 h-6 transition-all duration-300",
                                            isActive
                                                ? "text-emerald-600 dark:text-emerald-400 fill-emerald-600/20 dark:fill-emerald-400/20"
                                                : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>

                                {/* Label (Optional, small) */}
                                <span className={cn(
                                    "text-[10px] font-medium transition-all duration-300",
                                    isActive
                                        ? "text-emerald-600 dark:text-emerald-400 opacity-100"
                                        : "text-slate-500 dark:text-slate-400 opacity-0 h-0 overflow-hidden"
                                )}>
                                    {tab.label}
                                </span>

                                {/* Active Dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -bottom-2 w-1 h-1 bg-emerald-500 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

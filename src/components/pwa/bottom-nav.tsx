'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Compass, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const tabs = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        href: '/',
        color: '#10B981', // Emerald-500
        gradient: 'from-teal-500 to-emerald-500'
    },
    {
        id: 'quran',
        label: 'Quran',
        icon: BookOpen,
        href: '/quran',
        color: '#14B8A6', // Teal-500
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        id: 'qibla',
        label: 'Qibla',
        icon: Compass,
        href: '/qibla',
        color: '#0D9488', // Teal-600
        gradient: 'from-teal-600 to-cyan-600'
    },
    {
        id: 'ramadan',
        label: 'Ramadan',
        icon: Moon,
        href: '/ramadan',
        color: '#059669', // Emerald-600
        gradient: 'from-green-500 to-emerald-600'
    },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50">
            {/* Full-width Glass Background */}
            <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-emerald-500/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" />

            {/* Tab Items Container */}
            <div className="relative px-2 pb-safe pt-2">
                <div className="flex items-center justify-around max-w-lg mx-auto">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
                        const Icon = tab.icon

                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className="relative flex flex-col items-center justify-center flex-1 py-3 group"
                            >
                                {/* Active background pill */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activePill"
                                            className={cn(
                                                "absolute inset-x-3 inset-y-1 rounded-2xl bg-gradient-to-br shadow-lg shadow-emerald-500/20",
                                                tab.gradient
                                            )}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    {/* Icon with animation */}
                                    <motion.div
                                        animate={{
                                            scale: isActive ? 1 : 1,
                                            y: isActive ? -2 : 0
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 17
                                        }}
                                    >
                                        <Icon
                                            className={cn(
                                                "h-6 w-6 transition-colors duration-200",
                                                isActive
                                                    ? "text-white drop-shadow-md"
                                                    : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                            )}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    </motion.div>

                                    {/* Label with slide animation */}
                                    <motion.span
                                        animate={{
                                            opacity: isActive ? 1 : 0.7,
                                            y: isActive ? 0 : 2
                                        }}
                                        transition={{
                                            duration: 0.2
                                        }}
                                        className={cn(
                                            "text-[10px] mt-1 font-semibold tracking-wide transition-colors duration-200",
                                            isActive
                                                ? "text-white"
                                                : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                        )}
                                    >
                                        {tab.label}
                                    </motion.span>
                                </div>

                                {/* Ripple effect on tap */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl"
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

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
        color: '#3B82F6',
        gradient: 'from-blue-500 to-purple-500'
    },
    {
        id: 'quran',
        label: 'Quran',
        icon: BookOpen,
        href: '/quran',
        color: '#EC4899',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        id: 'qibla',
        label: 'Qibla',
        icon: Compass,
        href: '/qibla',
        color: '#06B6D4',
        gradient: 'from-cyan-500 to-blue-500'
    },
    {
        id: 'ramadan',
        label: 'Ramadan',
        icon: Moon,
        href: '/ramadan',
        color: '#10B981',
        gradient: 'from-emerald-500 to-teal-500'
    },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
            {/* Backdrop blur container */}
            <div className="relative px-4 pb-6 pt-2">
                {/* Floating tab bar container */}
                <div className="relative mx-auto max-w-md">
                    {/* Glassmorphism background */}
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[28px] shadow-2xl border border-gray-200/50 dark:border-gray-700/50" />

                    {/* Tab items */}
                    <div className="relative flex items-center justify-around px-2 py-2">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
                            const Icon = tab.icon

                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className="relative flex flex-col items-center justify-center flex-1 group"
                                >
                                    {/* Active background pill */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activePill"
                                                className={cn(
                                                    "absolute inset-x-2 inset-y-1 rounded-[20px] bg-gradient-to-br shadow-lg",
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
                                    <div className="relative z-10 flex flex-col items-center justify-center py-2 px-3">
                                        {/* Icon with animation */}
                                        <motion.div
                                            animate={{
                                                scale: isActive ? 1.1 : 1,
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
                                                        ? "text-white drop-shadow-lg"
                                                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
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
                                                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                            )}
                                        >
                                            {tab.label}
                                        </motion.span>
                                    </div>

                                    {/* Ripple effect on tap */}
                                    <motion.div
                                        className="absolute inset-0 rounded-[20px]"
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none -z-10" />
        </nav>
    )
}

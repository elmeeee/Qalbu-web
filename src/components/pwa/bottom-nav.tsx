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
        gradient: 'from-blue-500 to-purple-500'
    },
    {
        id: 'quran',
        label: 'Quran',
        icon: BookOpen,
        href: '/quran',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        id: 'qibla',
        label: 'Qibla',
        icon: Compass,
        href: '/qibla',
        gradient: 'from-cyan-500 to-blue-500'
    },
    {
        id: 'ramadan',
        label: 'Ramadan',
        icon: Moon,
        href: '/ramadan',
        gradient: 'from-emerald-500 to-teal-500'
    },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
                    const Icon = tab.icon

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className="relative flex flex-col items-center justify-center flex-1 h-full group"
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={cn(
                                        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-10",
                                        tab.gradient
                                    )}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }}
                                />
                            )}

                            {/* Icon */}
                            <div className="relative">
                                <Icon
                                    className={cn(
                                        "h-6 w-6 transition-all duration-200",
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400 scale-110"
                                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                    )}
                                />

                                {/* Active dot */}
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                                    />
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    "text-xs mt-1 font-medium transition-all duration-200",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                )}
                            >
                                {tab.label}
                            </span>
                        </Link>
                    )
                })}
            </div>

            {/* Safe area for iOS devices */}
            <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-900" />
        </nav>
    )
}

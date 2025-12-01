'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Share2 } from 'lucide-react'
import { getRandomDailyDuas, type DoaItem } from '@/lib/api/doa'
import { cn } from '@/lib/utils'

export function DailyDuaSlider() {
    const [duas, setDuas] = useState<DoaItem[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        // Fetch random duas based on day of week
        // We fetch 7 duas (one for each day) but allow cycling through them
        getRandomDailyDuas(7)
            .then((data) => {
                if (data && data.length > 0) {
                    setDuas(data)
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const paginate = (newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prev) => (prev + newDirection + duas.length) % duas.length)
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        })
    }

    if (loading) {
        return (
            <div className="h-64 w-full bg-gray-100 dark:bg-gray-800/50 rounded-2xl animate-pulse" />
        )
    }

    if (duas.length === 0) return null

    const currentDua = duas[currentIndex]

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Daily Dua
                    </span>
                </h3>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20"
                        onClick={() => paginate(-1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20"
                        onClick={() => paginate(1)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="relative h-[280px] w-full">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute w-full h-full"
                    >
                        <Card className="h-full border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

                            <CardContent className="p-6 h-full flex flex-col relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900">
                                        {currentDua.grup}
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-purple-600">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex-1 flex flex-col justify-center gap-4">
                                    <p className="text-2xl font-arabic text-right leading-loose text-gray-900 dark:text-gray-100" dir="rtl">
                                        {currentDua.ar}
                                    </p>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium italic text-purple-700 dark:text-purple-300 line-clamp-2">
                                            {currentDua.tr}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {currentDua.idn}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-center gap-1.5">
                                    {duas.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-300",
                                                idx === currentIndex
                                                    ? "w-6 bg-purple-500"
                                                    : "w-1.5 bg-purple-200 dark:bg-purple-900/30"
                                            )}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

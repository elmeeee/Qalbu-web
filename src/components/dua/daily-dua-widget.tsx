'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sparkles, Loader2, BookOpen } from 'lucide-react'
import { getRandomDailyDuas, type DoaItem } from '@/lib/api/doa'

export function DailyDuaWidget() {
    const [duas, setDuas] = useState<DoaItem[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showTranslation, setShowTranslation] = useState(true)

    useEffect(() => {
        // Fetch random duas to cycle through
        getRandomDailyDuas(10)
            .then((data) => {
                if (data && data.length > 0) {
                    setDuas(data)
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const nextDua = () => {
        setCurrentIndex((prev) => (prev + 1) % duas.length)
    }

    const prevDua = () => {
        setCurrentIndex((prev) => (prev - 1 + duas.length) % duas.length)
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
        )
    }

    if (duas.length === 0) return null

    const currentDua = duas[currentIndex]

    return (
        <Card className="premium-card overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-gray-900 dark:via-emerald-950/20 dark:to-gray-950 border-emerald-200/50 dark:border-emerald-900/30">
            <CardContent className="p-4 sm:p-6 relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-teal-400/10 to-emerald-400/10 rounded-full blur-2xl" />

                <Sparkles className="absolute top-3 left-3 sm:top-4 sm:left-4 h-6 w-6 sm:h-8 sm:w-8 text-emerald-300/30 dark:text-emerald-700/20" />

                <div className="mb-4 sm:mb-6 text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            Daily Dua
                        </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1 px-2">
                        {currentDua.nama}
                    </p>
                    <p className="text-xs text-muted-foreground px-2">
                        {currentDua.grup}
                    </p>
                </div>

                <div className="relative min-h-[180px] sm:min-h-[200px] flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="text-center w-full space-y-3 sm:space-y-4"
                        >
                            {/* Arabic Text */}
                            <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-200/30 dark:border-emerald-800/30">
                                <p className="text-xl sm:text-2xl md:text-3xl font-arabic leading-loose text-right text-emerald-900 dark:text-emerald-100 break-words" dir="rtl">
                                    {currentDua.ar}
                                </p>
                            </div>

                            {/* Transliteration */}
                            <div className="bg-gradient-to-r from-emerald-100/50 to-teal-100/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-2.5 sm:p-3 border border-emerald-200/30 dark:border-emerald-800/20">
                                <p className="text-xs sm:text-sm md:text-base font-medium italic text-emerald-800 dark:text-emerald-200 leading-relaxed break-words">
                                    {currentDua.tr}
                                </p>
                            </div>

                            {/* Translation */}
                            <AnimatePresence>
                                {showTranslation && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-emerald-200/40 dark:border-emerald-800/30">
                                            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed break-words">
                                                &quot;{currentDua.idn}&quot;
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Toggle Translation Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowTranslation(!showTranslation)}
                                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 h-8"
                            >
                                {showTranslation ? 'Hide' : 'Show'} Translation
                            </Button>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-4 sm:mt-6 relative z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevDua}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-all h-8 w-8 sm:h-10 sm:w-10"
                    >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>

                    <div className="flex gap-1 sm:gap-1.5">
                        {duas.map((_, idx) => (
                            <motion.div
                                key={idx}
                                initial={false}
                                animate={{
                                    width: idx === currentIndex ? 12 : 6,
                                    backgroundColor: idx === currentIndex
                                        ? 'rgb(5 150 105)' // emerald-600
                                        : 'rgb(209 213 219)' // gray-300
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-1 sm:h-1.5 rounded-full"
                            />
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextDua}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-all h-8 w-8 sm:h-10 sm:w-10"
                    >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>

                {/* Tags */}
                {currentDua.tag && currentDua.tag.length > 0 && (
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                        {currentDua.tag.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

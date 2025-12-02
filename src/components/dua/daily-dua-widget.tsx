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
        <div className="relative overflow-hidden rounded-3xl glass shadow-2xl">
            <div className="p-6 relative">
                {/* Subtle decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                <Sparkles className="absolute top-4 left-4 h-5 w-5 text-emerald-500/40 dark:text-emerald-400/30" />

                <div className="mb-6 text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground dark:text-white tracking-tight">
                            Daily Dua
                        </h3>
                    </div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1 px-2">
                        {currentDua.nama}
                    </p>
                    <p className="text-xs text-muted-foreground px-2">
                        {currentDua.grup}
                    </p>
                </div>

                <div className="relative min-h-[180px] sm:min-h-[200px] flex flex-col items-center justify-center space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-center w-full space-y-4"
                        >
                            {/* Arabic Text */}
                            <div className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/20 dark:border-white/5">
                                <p className="text-2xl md:text-3xl font-arabic leading-loose text-center text-foreground dark:text-white break-words" dir="rtl">
                                    {currentDua.ar}
                                </p>
                            </div>

                            {/* Transliteration */}
                            <div className="px-2">
                                <p className="text-sm md:text-base font-medium italic text-emerald-800 dark:text-emerald-200 leading-relaxed">
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
                                        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-500/10">
                                            <p className="text-sm text-foreground/80 dark:text-white/80 leading-relaxed">
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
                                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/10 h-8 rounded-full"
                            >
                                {showTranslation ? 'Hide' : 'Show'} Translation
                            </Button>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-6 relative z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevDua}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-all h-10 w-10 rounded-full"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex gap-1.5">
                        {duas.map((_, idx) => (
                            <motion.div
                                key={idx}
                                initial={false}
                                animate={{
                                    width: idx === currentIndex ? 16 : 6,
                                    backgroundColor: idx === currentIndex
                                        ? 'var(--primary)'
                                        : 'currentColor',
                                    opacity: idx === currentIndex ? 1 : 0.2
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-1.5 rounded-full bg-foreground dark:bg-white"
                            />
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextDua}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-all h-10 w-10 rounded-full"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                {/* Tags */}
                {currentDua.tag && currentDua.tag.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {currentDua.tag.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

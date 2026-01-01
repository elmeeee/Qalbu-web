'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Share2 } from 'lucide-react'
import { getRandomDailyDuas, type DoaItem } from '@/lib/api/doa'
import { cn } from '@/lib/utils'
import html2canvas from 'html2canvas'

import { useLanguage } from '@/contexts/language-context'
import { translations } from '@/lib/i18n'

export function DailyDuaSlider() {
    const { language } = useLanguage()
    const t = translations[language]

    const [duas, setDuas] = useState<DoaItem[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [direction, setDirection] = useState(0)
    const shareCardRef = useRef<HTMLDivElement>(null)

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

    const handleShare = async () => {
        if (!shareCardRef.current || !duas[currentIndex]) return
        const currentDua = duas[currentIndex]

        try {
            const canvas = await html2canvas(shareCardRef.current, {
                backgroundColor: null,
                scale: 2,
                logging: false,
            })

            canvas.toBlob(async (blob) => {
                if (!blob) return

                const file = new File([blob], 'qalbu-dua.png', { type: 'image/png' })

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: t.doas.title,
                        text: currentDua.grup,
                    })
                } else {
                    // Fallback: download the image
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'qalbu-dua.png'
                    a.click()
                    URL.revokeObjectURL(url)
                }
            })
        } catch (error) {
            console.error('Error sharing:', error)
        }
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
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
            scale: 0.95
        })
    }

    if (loading) {
        return (
            <div className="h-80 w-full bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl animate-pulse" />
        )
    }

    if (duas.length === 0) return null

    const currentDua = duas[currentIndex]

    return (
        <div className="w-full">
            {/* Hidden Share Card for Image Generation */}
            <div className="fixed left-[-9999px] top-[-9999px]">
                <div ref={shareCardRef} className="w-[600px] h-[800px] relative bg-gradient-to-br from-emerald-900 to-teal-950 p-12 flex flex-col items-center justify-between overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('/patterns/islamic.svg')] bg-center bg-repeat bg-[length:100px_100px]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -ml-16 -mb-16" />

                    <div className="relative z-10 w-full flex flex-col items-center h-full">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <Sparkles className="h-6 w-6 text-emerald-400" />
                                <span className="text-emerald-400 font-medium tracking-widest uppercase text-sm">Everyday Dua</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-2">{currentDua.grup}</h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 mt-4 mx-auto" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 w-full flex flex-col justify-center gap-8">
                            {/* Arabic */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-[40px] px-12 py-10 border border-white/10 shadow-xl flex-shrink-0">
                                <p className="text-4xl text-center font-amiri leading-[2.5] text-white"
                                    style={{
                                        direction: 'rtl',
                                        fontFamily: "'Amiri', 'Lateef', serif"
                                    }}
                                >
                                    {currentDua.ar}
                                </p>
                            </div>

                            {/* Transliteration */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-[40px] px-12 py-8 border border-white/10 shadow-xl flex-shrink-0">
                                <p className="text-2xl font-medium italic text-white/95 text-center leading-relaxed">
                                    {currentDua.tr}
                                </p>
                            </div>

                            {/* Translation */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-[40px] px-12 py-8 border border-white/10 shadow-xl flex-shrink-0">
                                <p className="text-2xl text-white/90 text-center leading-relaxed font-medium">
                                    {currentDua.idn}
                                </p>
                            </div>
                        </div>

                        {/* Footer - App Promotion */}
                        <div className="mt-8 text-center pt-8 border-t border-white/10 flex-shrink-0">
                            <p className="text-3xl font-semibold text-white mb-2">
                                {t.common.downloadApp}
                            </p>
                            <p className="text-2xl text-white/70">
                                {t.home.hero.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Sparkles className="h-6 w-6 text-emerald-500 animate-pulse" />
                        <div className="absolute inset-0 blur-md bg-emerald-500/30 rounded-full" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 dark:from-teal-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                        {t.doas.title}
                    </h3>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/30 shadow-sm"
                        onClick={() => paginate(-1)}
                    >
                        <ChevronLeft className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/30 shadow-sm"
                        onClick={() => paginate(1)}
                    >
                        <ChevronRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                </div>
            </div>

            {/* Slider Container */}
            <div className="relative h-[420px] w-full">
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
                        className="absolute w-full h-full hardware-accelerated"
                    >
                        <div className="h-full rounded-3xl glass shadow-2xl overflow-hidden relative">
                            {/* Animated Background Orbs */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24 animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -ml-24 -mb-24 animate-pulse" style={{ animationDelay: '1s' }} />

                            <div className="p-6 h-full flex flex-col relative z-10">
                                {/* Top Bar */}
                                <div className="flex items-start justify-between mb-4 flex-shrink-0">
                                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                                        <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                            {currentDua.grup}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleShare}
                                        className="h-10 w-10 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 border border-white/20"
                                    >
                                        <Share2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </Button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-2">
                                    {/* Arabic Text */}
                                    <div className="bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/20 dark:border-white/5 shadow-sm">
                                        <p
                                            className="text-2xl font-arabic text-right leading-relaxed text-foreground dark:text-white"
                                            dir="rtl"
                                            style={{ fontFamily: "'Scheherazade New', serif" }}
                                        >
                                            {currentDua.ar}
                                        </p>
                                    </div>

                                    {/* Transliteration */}
                                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-500/10">
                                        <p className="text-sm font-medium italic text-emerald-800 dark:text-emerald-200 leading-relaxed">
                                            {currentDua.tr}
                                        </p>
                                    </div>

                                    {/* Translation */}
                                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/10">
                                        <p className="text-sm text-foreground/80 dark:text-white/80 leading-relaxed">
                                            {currentDua.idn}
                                        </p>
                                    </div>
                                </div>

                                {/* Pagination Dots */}
                                <div className="mt-4 flex justify-center gap-2 flex-shrink-0">
                                    {duas.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setDirection(idx > currentIndex ? 1 : -1)
                                                setCurrentIndex(idx)
                                            }}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-300",
                                                idx === currentIndex
                                                    ? "w-8 bg-emerald-500"
                                                    : "w-1.5 bg-emerald-200 dark:bg-emerald-800 hover:bg-emerald-300 dark:hover:bg-emerald-700"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Share2 } from 'lucide-react'
import { getRandomDailyDuas, type DoaItem } from '@/lib/api/doa'
import { cn } from '@/lib/utils'
import html2canvas from 'html2canvas'

export function DailyDuaSlider() {
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
        if (!shareCardRef.current) return

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
                        title: 'Daily Dua from Qalbu',
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
        <div className="relative w-full overflow-hidden">
            {/* Hidden Share Card for Image Generation */}
            <div className="fixed -left-[9999px] top-0">
                <div
                    ref={shareCardRef}
                    className="w-[1080px] h-[1920px] relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                    }}
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl -ml-32 -mb-32" />

                    {/* Content Container */}
                    <div className="relative z-10 h-full flex flex-col p-16">
                        {/* Header - Logo & Branding */}
                        <div className="flex items-center gap-5 mb-12">
                            <img
                                src="/icons/qalbuIcon.png"
                                alt="Qalbu"
                                className="w-24 h-24 rounded-2xl shadow-2xl"
                            />
                            <div>
                                <h1 className="text-6xl font-bold text-white leading-tight">Qalbu</h1>
                                <p className="text-2xl text-white/80 font-medium">Daily Dua</p>
                            </div>
                        </div>

                        {/* Main Content - Scrollable Area */}
                        <div className="flex-1 flex flex-col gap-10 overflow-hidden">
                            {/* Category Badge */}
                            <div className="text-center flex-shrink-0">
                                <div className="inline-block bg-white/20 backdrop-blur-2xl px-10 py-4 rounded-full border-3 border-white/30 shadow-xl">
                                    <span className="text-3xl font-bold text-white">{currentDua.grup}</span>
                                </div>
                            </div>

                            {/* Arabic Text - Main Focus */}
                            <div className="bg-white/15 backdrop-blur-2xl rounded-[50px] p-12 border-3 border-white/20 shadow-2xl flex-shrink-0">
                                <p
                                    className="text-[3.5rem] font-arabic text-white leading-[1.9] text-center"
                                    dir="rtl"
                                    style={{
                                        fontFamily: "'Scheherazade New', serif",
                                        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {currentDua.ar}
                                </p>
                            </div>

                            {/* Transliteration */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-[40px] px-12 py-8 border-2 border-white/15 shadow-xl flex-shrink-0">
                                <p className="text-2xl font-medium italic text-white/95 text-center leading-relaxed">
                                    {currentDua.tr}
                                </p>
                            </div>

                            {/* Translation */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-[40px] px-12 py-8 border-2 border-white/15 shadow-xl flex-shrink-0">
                                <p className="text-2xl text-white/90 text-center leading-relaxed font-medium">
                                    {currentDua.idn}
                                </p>
                            </div>
                        </div>

                        {/* Footer - App Promotion */}
                        <div className="mt-8 text-center pt-8 border-t-2 border-white/20 flex-shrink-0">
                            <p className="text-3xl font-semibold text-white mb-2">
                                Download Qalbu App
                            </p>
                            <p className="text-2xl text-white/70">
                                Your Daily Islamic Companion 🤲
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
                        <div className="absolute inset-0 blur-md bg-purple-500/30 rounded-full" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Daily Dua
                    </h3>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-900/30 shadow-sm"
                        onClick={() => paginate(-1)}
                    >
                        <ChevronLeft className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-900/30 shadow-sm"
                        onClick={() => paginate(1)}
                    >
                        <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 }
                        }}
                        className="absolute w-full h-full"
                    >
                        <Card className="h-full border-none shadow-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950/30 dark:to-gray-900 overflow-hidden relative">
                            {/* Animated Background Orbs */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -mr-24 -mt-24 animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl -ml-24 -mb-24 animate-pulse" style={{ animationDelay: '1s' }} />

                            {/* Glassmorphism overlay */}
                            <div className="absolute inset-0 bg-white/30 dark:bg-black/20 backdrop-blur-[2px]" />

                            <CardContent className="p-6 h-full flex flex-col relative z-10">
                                {/* Top Bar */}
                                <div className="flex items-start justify-between mb-4 flex-shrink-0">
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full shadow-lg">
                                        <BookOpen className="h-4 w-4 text-white" />
                                        <span className="text-sm font-semibold text-white">
                                            {currentDua.grup}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleShare}
                                        className="h-10 w-10 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-800/80 border border-white/40 dark:border-gray-700/40"
                                    >
                                        <Share2 className="h-4 w-4 text-purple-500" />
                                    </Button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-2">
                                    {/* Arabic Text */}
                                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/60 dark:border-gray-700/60 shadow-lg">
                                        <p
                                            className="text-2xl font-arabic text-right leading-relaxed text-gray-900 dark:text-gray-100"
                                            dir="rtl"
                                            style={{ fontFamily: "'Scheherazade New', serif" }}
                                        >
                                            {currentDua.ar}
                                        </p>
                                    </div>

                                    {/* Transliteration */}
                                    <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
                                        <p className="text-sm font-medium italic text-purple-800 dark:text-purple-200 leading-relaxed">
                                            {currentDua.tr}
                                        </p>
                                    </div>

                                    {/* Translation */}
                                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
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
                                                "h-2 rounded-full transition-all duration-300",
                                                idx === currentIndex
                                                    ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                                                    : "w-2 bg-purple-300 dark:bg-purple-700 hover:bg-purple-400 dark:hover:bg-purple-600"
                                            )}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
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

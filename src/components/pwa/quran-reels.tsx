'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Heart, Share2, BookOpen, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface Ayah {
    number: number
    text: string
    translation?: string
    transliteration?: string
    numberInSurah: number
    audio: string
    surah?: {
        number: number
        name: string
        englishName: string
        englishNameTranslation: string
        revelationType: string
    }
}

export function QuranReels() {
    const { language } = useLanguage()
    const [ayahs, setAyahs] = useState<Ayah[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentSurah, setCurrentSurah] = useState(1)
    const [currentAyah, setCurrentAyah] = useState(1)
    const audioRef = useRef<HTMLAudioElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Load initial ayahs
    useEffect(() => {
        loadAyahs(1, 1)
    }, [])

    // Auto-play audio when ayah changes
    useEffect(() => {
        if (ayahs[currentIndex] && audioRef.current) {
            audioRef.current.src = ayahs[currentIndex].audio
            audioRef.current.load()

            // Auto-play and auto-scroll to next ayah when audio ends
            const handleAudioEnd = () => {
                if (containerRef.current && currentIndex < ayahs.length - 1) {
                    const nextIndex = currentIndex + 1
                    containerRef.current.scrollTo({
                        top: nextIndex * window.innerHeight,
                        behavior: 'smooth'
                    })
                }
            }

            audioRef.current.addEventListener('ended', handleAudioEnd)

            if (!isMuted) {
                audioRef.current.play().catch(console.error)
                setIsPlaying(true)
            }

            return () => {
                audioRef.current?.removeEventListener('ended', handleAudioEnd)
            }
        }
    }, [currentIndex, ayahs, isMuted])

    const loadAyahs = async (surah: number, startAyah: number) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/quran/ayahs?surah=${surah}&startAyah=${startAyah}&count=10&edition=en.asad`)
            const data = await response.json()

            // Prevent duplicates by checking if ayah already exists
            setAyahs(prev => {
                const existingKeys = new Set(prev.map(a => `${a.surah?.number}-${a.numberInSurah}`))
                const newAyahs = data.ayahs.filter((a: Ayah) => !existingKeys.has(`${a.surah?.number}-${a.numberInSurah}`))
                return [...prev, ...newAyahs]
            })
            setCurrentSurah(data.nextSurah)
            setCurrentAyah(data.nextAyah)
        } catch (error) {
            console.error('Error loading ayahs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget
        const scrollTop = container.scrollTop
        const itemHeight = container.clientHeight
        const newIndex = Math.round(scrollTop / itemHeight)

        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex)

            // Load more when near the end
            if (newIndex >= ayahs.length - 3) {
                loadAyahs(currentSurah, currentAyah)
            }
        }
    }

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play().catch(console.error)
            }
            setIsPlaying(!isPlaying)
        }
    }

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    if (isLoading && ayahs.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-emerald-900 via-teal-900 to-cyan-900">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="relative h-screen overflow-hidden bg-black">
            <audio ref={audioRef} />

            {/* Scrollable Container */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {ayahs.map((ayah, index) => (
                    <div
                        key={`${ayah.surah?.number || 0}-${ayah.numberInSurah || index}`}
                        className="h-screen w-full snap-start snap-always relative flex items-center justify-center"
                    >
                        {/* Dynamic Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-teal-900 to-cyan-900 opacity-95" />

                        {/* Animated Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-6 pb-24">
                            {/* Top Info */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                                    <BookOpen className="h-4 w-4 text-emerald-300" />
                                    <span className="text-white text-sm font-medium">
                                        {ayah.surah?.englishName} • {ayah.numberInSurah}
                                    </span>
                                </div>
                                <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                                    <span className="text-emerald-300 text-sm font-medium">
                                        {ayah.surah?.revelationType}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Arabic Text with Tajweed */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex-1 flex items-center justify-center w-full max-w-2xl"
                            >
                                <div className="text-center space-y-6 px-4">
                                    {/* Arabic Text */}
                                    <div
                                        className="text-4xl leading-loose text-white font-arabic"
                                        style={{ fontFamily: "'Scheherazade New', serif", direction: 'rtl' }}
                                    >
                                        {ayah.text}
                                    </div>

                                    {/* Transliteration */}
                                    {ayah.transliteration && (
                                        <p className="text-lg text-emerald-200 italic opacity-80">
                                            {ayah.transliteration}
                                        </p>
                                    )}

                                    {/* Translation */}
                                    {ayah.translation && (
                                        <p className="text-base text-white/90 leading-relaxed max-w-xl mx-auto">
                                            {ayah.translation}
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Bottom Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-full flex items-center justify-between"
                            >
                                {/* Left: Surah Info */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-white font-bold text-lg">
                                        {ayah.surah?.englishName}
                                    </span>
                                    <span className="text-emerald-300 text-sm">
                                        {ayah.surah?.englishNameTranslation}
                                    </span>
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex flex-col gap-4">
                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlay}
                                        className="flex flex-col items-center gap-1 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-all">
                                            {isPlaying ? (
                                                <Pause className="h-6 w-6 text-white fill-white" />
                                            ) : (
                                                <Play className="h-6 w-6 text-white fill-white ml-1" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Mute */}
                                    <button
                                        onClick={toggleMute}
                                        className="flex flex-col items-center gap-1 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-all">
                                            {isMuted ? (
                                                <VolumeX className="h-5 w-5 text-white" />
                                            ) : (
                                                <Volume2 className="h-5 w-5 text-white" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Like */}
                                    <button className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-all">
                                            <Heart className="h-5 w-5 text-white" />
                                        </div>
                                    </button>

                                    {/* Share */}
                                    <button className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-all">
                                            <Share2 className="h-5 w-5 text-white" />
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ))}

                {/* Loading More */}
                {isLoading && ayahs.length > 0 && (
                    <div className="h-screen w-full snap-start flex items-center justify-center bg-gradient-to-b from-emerald-900 via-teal-900 to-cyan-900">
                        <Loader2 className="h-12 w-12 animate-spin text-white" />
                    </div>
                )}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20">
                {ayahs.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 h-8 rounded-full transition-all ${i === Math.min(2, currentIndex) ? 'bg-white' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .font-arabic {
                    font-family: 'Scheherazade New', serif;
                }
            `}</style>
        </div>
    )
}

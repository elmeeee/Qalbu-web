'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, X, Loader2 } from 'lucide-react'
import { useAudio } from '@/contexts/audio-context'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function MiniPlayer() {
    const {
        isPlaying,
        currentSurah,
        currentAyah,
        togglePlay,
        playNext,
        playPrevious,
        progress,
        duration,
        seek,
        isLoading
    } = useAudio()
    const { t } = useLanguage()

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (currentAyah) {
            setIsVisible(true)
        }
    }, [currentAyah])

    if (!isVisible || !currentSurah || !currentAyah) return null

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
                >
                    <div className="container mx-auto flex items-center gap-4 p-4">
                        {/* Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gold-100 dark:bg-gold-900/20">
                                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gold-600">
                                    {currentSurah.number}
                                </div>
                            </div>
                            <div className="min-w-0 overflow-hidden">
                                <h4 className="truncate font-semibold text-foreground">
                                    {currentSurah.englishName}
                                </h4>
                                <p className="truncate text-xs text-muted-foreground">
                                    {t.common.ayah} {currentAyah.numberInSurah}
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={playPrevious}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <SkipBack className="h-5 w-5" />
                                </Button>

                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-gold-500 hover:bg-gold-600 text-white shadow-lg shadow-gold-500/20"
                                    onClick={togglePlay}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : isPlaying ? (
                                        <Pause className="h-5 w-5" />
                                    ) : (
                                        <Play className="h-5 w-5 ml-1" />
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={playNext}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <SkipForward className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Progress Bar (Desktop) */}
                            <div className="hidden md:flex w-full max-w-md items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatTime(progress)}</span>
                                <Slider
                                    value={[progress]}
                                    max={duration || 100}
                                    step={1}
                                    onValueChange={(val) => seek(val[0])}
                                    className="w-full cursor-pointer"
                                />
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Close / Extra Actions */}
                        <div className="flex flex-1 justify-end">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsVisible(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Progress Bar (Mobile) */}
                    <div className="md:hidden w-full px-4 pb-4">
                        <Slider
                            value={[progress]}
                            max={duration || 100}
                            step={1}
                            onValueChange={(val) => seek(val[0])}
                            className="w-full cursor-pointer"
                        />
                        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { getAsmaUlHusna, type AsmaUlHusnaName } from '@/lib/api/asma-ul-husna'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AsmaUlHusnaWidget() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const { data: names, isLoading } = useQuery<AsmaUlHusnaName[]>({
        queryKey: ['asmaUlHusna'],
        queryFn: getAsmaUlHusna,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    })

    // Auto-rotate every 5 seconds
    useEffect(() => {
        if (!names) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % names.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [names])

    const goToNext = () => {
        if (names) {
            setCurrentIndex((prev) => (prev + 1) % names.length)
        }
    }

    const goToPrevious = () => {
        if (names) {
            setCurrentIndex((prev) => (prev - 1 + names.length) % names.length)
        }
    }

    if (isLoading || !names) {
        return null
    }

    const currentName = names[currentIndex]

    return (
        <Card className="premium-card overflow-hidden bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 border-0 shadow-xl">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-white" />
                        <h3 className="text-white font-bold text-lg">Asma Ul Husna</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToPrevious}
                            className="h-8 w-8 text-white hover:bg-white/20"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-white/80 text-sm min-w-[60px] text-center">
                            {currentIndex + 1} / {names.length}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToNext}
                            className="h-8 w-8 text-white hover:bg-white/20"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center space-y-3"
                    >
                        <div className="text-5xl font-arabic text-white mb-2">
                            {currentName.name}
                        </div>
                        <div className="text-xl text-white/90 font-medium">
                            {currentName.transliteration}
                        </div>
                        <div className="text-white/80 text-sm">
                            {currentName.en.meaning}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress indicator */}
                <div className="mt-6 flex gap-1">
                    {names.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-all ${index === currentIndex ? 'bg-white' : 'bg-white/30'
                                }`}
                        />
                    )).slice(Math.max(0, currentIndex - 4), currentIndex + 5)}
                </div>
            </CardContent>
        </Card>
    )
}

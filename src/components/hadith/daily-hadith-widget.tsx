'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react'
import { getHadiths, type HadithItem } from '@/lib/api/islamic-content'

export function DailyHadithWidget() {
    const [hadiths, setHadiths] = useState<HadithItem[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch a range of hadiths to cycle through
        getHadiths('bukhari', '1-10')
            .then((data) => {
                if (data && data.items) {
                    setHadiths(data.items)
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const nextHadith = () => {
        setCurrentIndex((prev) => (prev + 1) % hadiths.length)
    }

    const prevHadith = () => {
        setCurrentIndex((prev) => (prev - 1 + hadiths.length) % hadiths.length)
    }

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gold-600" />
            </div>
        )
    }

    if (hadiths.length === 0) return null

    const currentHadith = hadiths[currentIndex]

    return (
        <Card className="premium-card overflow-hidden bg-gradient-to-br from-sand-50 to-white dark:from-gray-900 dark:to-gray-950">
            <CardContent className="p-6 relative">
                <Quote className="absolute top-4 left-4 h-8 w-8 text-gold-200 dark:text-gold-900/20 rotate-180" />

                <div className="mb-6 text-center">
                    <h3 className="text-lg font-bold text-gold-600 mb-1">Daily Hadith</h3>
                    <p className="text-xs text-muted-foreground">Sahih Bukhari #{currentHadith.number}</p>
                </div>

                <div className="relative min-h-[150px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                        >
                            <p className="text-lg font-medium leading-relaxed italic text-foreground/90">
                                &quot;{currentHadith.id}&quot;
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <Button variant="ghost" size="icon" onClick={prevHadith} className="hover:text-gold-600">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex gap-1">
                        {hadiths.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-gold-600' : 'w-1.5 bg-border'}`}
                            />
                        ))}
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextHadith} className="hover:text-gold-600">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

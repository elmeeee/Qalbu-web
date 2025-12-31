'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, BookOpen, Play } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LikedAyah {
    surahNumber: number
    ayahNumber: number
}

export function FavoriteAyahsWidget() {
    const [likedAyahs, setLikedAyahs] = useState<LikedAyah[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedLikes = localStorage.getItem('liked-ayahs')
        if (savedLikes) {
            try {
                const likes = JSON.parse(savedLikes) as string[]
                const parsed = likes.map(key => {
                    const [surahNumber, ayahNumber] = key.split('-').map(Number)
                    return { surahNumber, ayahNumber }
                })
                setLikedAyahs(parsed)
            } catch (e) {
                console.error('Failed to parse liked ayahs', e)
            }
        }
    }, [])

    // Don't render during SSR
    if (!mounted || likedAyahs.length === 0) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
                        Favorite Ayahs
                    </span>
                </h3>
                <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    {likedAyahs.length} saved
                </span>
            </div>

            <div className="overflow-hidden rounded-3xl glass shadow-lg">
                <div className="p-5 space-y-3">
                    {likedAyahs.slice(0, 5).map((ayah, index) => (
                        <Link
                            key={`${ayah.surahNumber}-${ayah.ayahNumber}`}
                            href={`/quran?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group flex items-center justify-between p-3 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                        <BookOpen className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground dark:text-white">
                                            Surah {ayah.surahNumber}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Ayah {ayah.ayahNumber}
                                        </p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    {likedAyahs.length > 5 && (
                        <Link href="/quran">
                            <div className="text-center pt-2">
                                <span className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline">
                                    View all {likedAyahs.length} favorites →
                                </span>
                            </div>
                        </Link>
                    )}

                    {likedAyahs.length === 0 && (
                        <div className="text-center py-6">
                            <Heart className="h-8 w-8 text-rose-500/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No favorites yet. Like ayahs to save them here!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

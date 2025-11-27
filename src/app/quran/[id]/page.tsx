'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { useSurah } from '@/hooks/use-quran'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Pause, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAudio } from '@/contexts/audio-context'

export default function SurahPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const surahId = parseInt(id)
    const { data: surah, isLoading, error } = useSurah(surahId, true)

    const {
        isPlaying,
        currentAyah,
        currentSurah,
        playAyah,
        togglePlay
    } = useAudio()

    const handlePlayAyah = (ayah: any) => {
        if (!surah) return

        // If clicking the currently playing ayah, toggle play/pause
        if (currentSurah?.number === surah.number && currentAyah?.number === ayah.number) {
            togglePlay()
        } else {
            // Otherwise play the new ayah
            playAyah(surah, ayah)
        }
    }

    const isAyahPlaying = (ayahNumber: number) => {
        return isPlaying &&
            currentSurah?.number === surah?.number &&
            currentAyah?.number === ayahNumber
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-gold-600" />
            </div>
        )
    }

    if (error || !surah) {
        return (
            <div className="container mx-auto px-4 py-20">
                <Card className="border-destructive/50">
                    <CardContent className="p-8 text-center">
                        <p className="text-destructive">Failed to load surah</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/quran">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Quran
                        </Button>
                    </Link>

                    <Card className="premium-card overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-gold-500 to-gold-600 text-white">
                            <div className="text-center">
                                <p className="mb-2 text-sm opacity-90">Surah {surah.number}</p>
                                <CardTitle className="mb-2 text-3xl font-bold">{surah.englishName}</CardTitle>
                                <p className="mb-4 text-lg opacity-90">{surah.englishNameTranslation}</p>
                                <p className="font-arabic text-4xl">{surah.name}</p>
                                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                                    <span>{surah.revelationType}</span>
                                    <span>•</span>
                                    <span>{surah.numberOfAyahs} Ayahs</span>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Bismillah */}
                {surah.number !== 1 && surah.number !== 9 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <Card className="glass">
                            <CardContent className="p-8 text-center">
                                <p className="font-arabic text-3xl md:text-4xl">
                                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    In the name of Allah, the Most Gracious, the Most Merciful
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Ayahs */}
                <div className="space-y-6">
                    {surah.ayahs.map((ayah, index) => (
                        <motion.div
                            key={ayah.number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <Card
                                className={`transition-all duration-300 ${currentSurah?.number === surah.number && currentAyah?.number === ayah.number
                                        ? 'border-gold-500 shadow-lg shadow-gold-500/20'
                                        : 'hover:shadow-md'
                                    }`}
                            >
                                <CardContent className="p-6">
                                    {/* Ayah Number and Play Button */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-sm font-semibold text-gold-700 dark:bg-gold-900/30 dark:text-gold-400">
                                            {ayah.numberInSurah}
                                        </div>
                                        <Button
                                            size="icon"
                                            variant={isAyahPlaying(ayah.number) ? 'default' : 'outline'}
                                            onClick={() => handlePlayAyah(ayah)}
                                            className="rounded-full"
                                        >
                                            {isAyahPlaying(ayah.number) ? (
                                                <Pause className="h-4 w-4" />
                                            ) : (
                                                <Play className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>

                                    {/* Arabic Text */}
                                    <div className="mb-6 text-right">
                                        <p className="arabic-text leading-loose text-3xl">{ayah.text}</p>
                                    </div>

                                    {/* Transliteration & Translation */}
                                    <div className="space-y-2">
                                        {ayah.transliteration && (
                                            <p className="text-lg font-medium text-gold-600 dark:text-gold-400">
                                                {ayah.transliteration}
                                            </p>
                                        )}
                                        {ayah.translation && (
                                            <p className="text-muted-foreground">
                                                {ayah.translation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Metadata */}
                                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
                                        <span>Juz {ayah.juz}</span>
                                        <span>•</span>
                                        <span>Page {ayah.page}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    )
}

'use client'
import { use, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useSurah } from '@/hooks/use-quran'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Pause, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAudio } from '@/contexts/audio-context'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { TajweedText } from '@/components/quran/tajweed-text'

export default function SurahPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const surahId = parseInt(id)
    const { language, t } = useLanguage()
    const { data: surah, isLoading, error } = useSurah(surahId, true, language)

    const { scrollY } = useScroll()
    const [isHidden, setIsHidden] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0
        if (latest > previous && latest > 150) {
            setIsHidden(true)
        } else {
            setIsHidden(false)
        }
    })

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
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error || !surah) {
        return (
            <div className="container mx-auto px-4 py-20">
                <Card className="border-destructive/50">
                    <CardContent className="p-8 text-center">
                        <p className="text-destructive">{t.common.error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-24">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Sticky Header */}
                <motion.div
                    variants={{
                        visible: { y: 0 },
                        hidden: { y: "-100%" },
                    }}
                    animate={isHidden ? "hidden" : "visible"}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="sticky top-0 z-50 -mx-4 mb-6 px-4 py-2 backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60"
                >
                    <div className="flex items-center justify-between">
                        <Link href={`/quran?lang=${language}`}>
                            <Button variant="ghost">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t.common.quran}
                            </Button>
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </motion.div>

                {/* Surah Info */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Card className="premium-card overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                            <div className="text-center">
                                <p className="mb-2 text-sm opacity-90">{t.common.surah} {surah.number}</p>
                                <CardTitle className="mb-2 text-3xl font-bold">{surah.englishName}</CardTitle>
                                <p className="mb-4 text-lg opacity-90">{surah.englishNameTranslation}</p>
                                <p className="font-arabic text-4xl">{surah.name}</p>
                                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                                    <span>{surah.revelationType}</span>
                                    <span>•</span>
                                    <span>{surah.numberOfAyahs} {t.common.ayah}</span>
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
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                    : 'hover:shadow-md'
                                    }`}
                            >
                                <CardContent className="p-6">
                                    {/* Ayah Number and Play Button */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
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
                                        <TajweedText text={ayah.text} className="arabic-text leading-loose text-3xl" />
                                    </div>

                                    {/* Transliteration & Translation */}
                                    <div className="space-y-2">
                                        {ayah.transliteration && (
                                            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
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
                                        <span>{t.common.juz} {ayah.juz}</span>
                                        <span>•</span>
                                        <span>{t.common.page} {ayah.page}</span>
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

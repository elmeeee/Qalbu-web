'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAllSurahs } from '@/hooks/use-quran'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Loader2, BookOpen, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

export default function QuranPage() {
    const { data: surahs, isLoading, error } = useAllSurahs()
    const [searchQuery, setSearchQuery] = useState('')
    const { t, language } = useLanguage()

    const filteredSurahs = surahs?.filter(
        (surah) =>
            surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.name.includes(searchQuery) ||
            surah.number.toString().includes(searchQuery)
    )

    return (
        <main className="min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center relative"
                >
                    <div className="absolute left-0 top-0 md:left-4 flex items-center gap-2">
                        <Link href={`/?lang=${language}`}>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">{t.common.home}</span>
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute right-0 top-0 md:right-4">
                        <LanguageSwitcher />
                    </div>

                    <h1 className="mb-4 text-4xl font-bold md:text-5xl pt-8 md:pt-0">
                        <span className="gradient-text">{t.common.quran}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {language === 'en' ? 'Read and listen to all 114 Surahs with beautiful recitation' :
                            language === 'ms' ? 'Baca dan dengar semua 114 Surah dengan bacaan yang indah' :
                                language === 'id' ? 'Baca dan dengarkan semua 114 Surah dengan bacaan yang indah' :
                                    'اقرأ واستمع إلى جميع السور الـ 114 بتلاوة جميلة'}
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="relative mx-auto max-w-2xl">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={`${t.common.search}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-border bg-background px-12 py-4 text-lg shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-destructive/50">
                        <CardContent className="p-8 text-center">
                            <p className="text-destructive">{t.common.error}</p>
                            <p className="mt-2 text-sm text-muted-foreground">{error.toString()}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Surah List */}
                {filteredSurahs && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredSurahs.map((surah, index) => (
                            <motion.div
                                key={surah.number}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                            >
                                <Link href={`/quran/${surah.number}?lang=${language}`}>
                                    <Card className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                {/* Surah Number Badge */}
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-lg font-bold text-white shadow-lg">
                                                    {surah.number}
                                                </div>

                                                {/* Surah Info */}
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-start justify-between">
                                                        <h3 className="text-lg font-semibold group-hover:text-blue-600">
                                                            {surah.englishName}
                                                        </h3>
                                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        {surah.englishNameTranslation}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>{surah.revelationType}</span>
                                                        <span>{surah.numberOfAyahs} {t.common.ayah}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Arabic Name */}
                                            <div className="mt-4 border-t border-border pt-4 text-right">
                                                <p className="font-arabic text-2xl">{surah.name}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* No Results */}
                {filteredSurahs && filteredSurahs.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-lg text-muted-foreground">No surahs found matching your search</p>
                    </div>
                )}
            </div>
        </main>
    )
}

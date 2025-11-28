'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Search, BookOpen, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { getDoas, type DoaItem } from '@/lib/api/doa'

export default function DoaPage() {
    const { t, language } = useLanguage()
    const [searchQuery, setSearchQuery] = useState('')
    const [doas, setDoas] = useState<DoaItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDoas(language)
            .then(setDoas)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [language])

    // Filter doas based on search query
    const filteredDoas = doas.filter((doa) => {
        const query = searchQuery.toLowerCase()
        return (
            doa.judul.toLowerCase().includes(query) ||
            doa.terjemah.toLowerCase().includes(query) ||
            doa.latin.toLowerCase().includes(query)
        )
    })

    return (
        <main className="min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center relative"
                >
                    <div className="absolute left-0 top-0 md:left-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">{t.common.home}</span>
                            </Button>
                        </Link>
                    </div>
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl pt-8 md:pt-0">
                        <span className="gradient-text">{t.doas.title}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">{t.doas.subtitle}</p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 max-w-md mx-auto"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={t.doas.search}
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
                    </div>
                ) : (
                    /* Doa List */
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredDoas.map((doa, index) => (
                            <motion.div
                                key={doa.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="premium-card h-full flex flex-col hover:shadow-md transition-all">
                                    <CardHeader>
                                        <CardTitle className="flex items-start gap-2 text-lg leading-tight">
                                            <BookOpen className="h-5 w-5 text-gold-600 shrink-0 mt-1" />
                                            <span>{doa.judul}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col gap-4">
                                        <div className="text-right bg-sand-50/50 dark:bg-gray-900/50 p-4 rounded-xl">
                                            <p className="arabic-text text-2xl leading-loose" dir="rtl">{doa.arab}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gold-600 mb-1 uppercase tracking-wider">Transliteration</p>
                                            <p className="text-sm italic text-muted-foreground">{doa.latin}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gold-600 mb-1 uppercase tracking-wider">Translation</p>
                                            <p className="text-sm leading-relaxed">
                                                {doa.terjemah}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

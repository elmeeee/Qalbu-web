'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Scroll, Loader2, MapPin, Calendar, User } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { getProphetStories, type ProphetStory } from '@/lib/api/islamic-content'

export default function ProphetsPage() {
    const { t, language } = useLanguage()
    const [stories, setStories] = useState<ProphetStory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProphetStories()
            .then(setStories)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

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
                        <span className="gradient-text">{t.prophets.title}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">{t.prophets.subtitle}</p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
                    </div>
                ) : (
                    /* Prophets List */
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {stories.map((prophet, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="premium-card h-full flex flex-col hover:border-gold-500/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-xl">
                                            <Scroll className="h-5 w-5 text-gold-600" />
                                            {prophet.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col gap-4">
                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                                                <Calendar className="h-3 w-3" />
                                                <span>Born: {prophet.thn_kelahiran}</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                                                <User className="h-3 w-3" />
                                                <span>Age: {prophet.usia}</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                                                <MapPin className="h-3 w-3" />
                                                <span>{prophet.tmp_dakwah}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-border/50">
                                            <p className="text-sm leading-relaxed text-justify line-clamp-6 hover:line-clamp-none transition-all cursor-pointer">
                                                {prophet.description}
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

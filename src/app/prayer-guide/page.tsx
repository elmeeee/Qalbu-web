'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { getPrayerGuide, type PrayerGuideItem } from '@/lib/api/islamic-content'

export default function PrayerGuidePage() {
    const { t, language } = useLanguage()
    const [guide, setGuide] = useState<PrayerGuideItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPrayerGuide(language)
            .then(setGuide)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [language])

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
                        <span className="gradient-text">{t.prayerGuide.title}</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">{t.prayerGuide.subtitle}</p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    /* Steps List */
                    <div className="max-w-3xl mx-auto space-y-8">
                        {guide.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg z-10">
                                            {index + 1}
                                        </div>
                                        {index !== guide.length - 1 && (
                                            <div className="w-0.5 flex-1 bg-border/50 my-2" />
                                        )}
                                    </div>
                                    <Card className="premium-card flex-1 mb-4">
                                        <CardHeader>
                                            <CardTitle className="text-xl">
                                                {step.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                                <p className="arabic-text text-2xl text-center mb-4 leading-loose">{step.arabic}</p>
                                                <p className="text-sm text-center italic text-muted-foreground mb-2">
                                                    {step.latin}
                                                </p>
                                                <p className="text-sm text-center font-medium">
                                                    {step.terjemah}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

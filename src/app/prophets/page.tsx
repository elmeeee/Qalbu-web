'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Scroll } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { prophets } from '@/lib/data/prophets'

export default function ProphetsPage() {
    const { t, language } = useLanguage()

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

                {/* Prophets List */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {prophets.map((prophet, index) => (
                        <motion.div
                            key={prophet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="premium-card h-full flex flex-col hover:border-gold-500/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Scroll className="h-5 w-5 text-gold-600" />
                                        {prophet.title[language as keyof typeof prophet.title] || prophet.title.en}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-4">
                                    <p className="text-muted-foreground">
                                        {prophet.summary[language as keyof typeof prophet.summary] || prophet.summary.en}
                                    </p>
                                    <div className="mt-auto pt-4">
                                        <p className="text-sm leading-relaxed">
                                            {prophet.story[language as keyof typeof prophet.story] || prophet.story.en}
                                        </p>
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

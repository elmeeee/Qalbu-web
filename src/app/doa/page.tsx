'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft, Search, BookOpen, Loader2, Tag, Sparkles, Filter } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { getDoas, type DoaItem } from '@/lib/api/doa'

export default function DoaPage() {
    const { t, language } = useLanguage()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [doas, setDoas] = useState<DoaItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDoas()
            .then(setDoas)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // Get unique categories
    const categories = Array.from(new Set(doas.map(doa => doa.grup))).sort()

    // Filter doas based on search query and category
    const filteredDoas = doas.filter((doa) => {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
            doa.nama.toLowerCase().includes(query) ||
            doa.idn.toLowerCase().includes(query) ||
            doa.tr.toLowerCase().includes(query) ||
            doa.grup.toLowerCase().includes(query) ||
            doa.tag.some(tag => tag.toLowerCase().includes(query))

        const matchesCategory = selectedCategory === 'all' || doa.grup === selectedCategory

        return matchesSearch && matchesCategory
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

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 space-y-4"
                >
                    <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t.doas?.search || "Search duas..."}
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter Dropdown */}
                        <div className="relative sm:w-64">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <SelectValue placeholder="All Categories" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        <span className="font-medium">All Categories</span>
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Selected Category Badge */}
                    {selectedCategory && selectedCategory !== 'all' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-center gap-2"
                        >
                            <span className="text-sm text-muted-foreground">Filtering by:</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                                <Filter className="h-3 w-3" />
                                {selectedCategory}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCategory('all')}
                                className="h-6 px-2 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                            >
                                Clear
                            </Button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                ) : (
                    /* Doa List */
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredDoas.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-muted-foreground">No duas found matching your search.</p>
                            </div>
                        ) : (
                            filteredDoas.map((doa, index) => (
                                <motion.div
                                    key={doa.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                >
                                    <Card className="premium-card h-full flex flex-col hover:shadow-lg transition-all border-emerald-200/50 dark:border-emerald-900/30">
                                        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
                                            <CardTitle className="flex items-start gap-2 text-sm sm:text-base leading-tight">
                                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-emerald-900 dark:text-emerald-100 break-words">{doa.nama}</span>
                                                    <p className="text-xs font-normal text-muted-foreground mt-1 break-words">{doa.grup}</p>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col gap-3 sm:gap-4 px-4 sm:px-6 pb-4 sm:pb-6">
                                            {/* Arabic Text */}
                                            <div className="text-right bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-emerald-200/30 dark:border-emerald-800/20">
                                                <p className="text-xl sm:text-2xl font-arabic leading-loose text-emerald-900 dark:text-emerald-100 break-words" dir="rtl">
                                                    {doa.ar}
                                                </p>
                                            </div>

                                            {/* Transliteration */}
                                            <div className="bg-white/50 dark:bg-gray-800/30 p-2.5 sm:p-3 rounded-lg">
                                                <p className="text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                                                    <BookOpen className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                    Transliteration
                                                </p>
                                                <p className="text-xs sm:text-sm italic text-foreground/80 leading-relaxed break-words">{doa.tr}</p>
                                            </div>

                                            {/* Translation */}
                                            <div className="bg-white/50 dark:bg-gray-800/30 p-2.5 sm:p-3 rounded-lg">
                                                <p className="text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wider">Translation</p>
                                                <p className="text-xs sm:text-sm leading-relaxed text-foreground/80 break-words">
                                                    {doa.idn}
                                                </p>
                                            </div>

                                            {/* Tags */}
                                            {doa.tag && doa.tag.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1 sm:pt-2">
                                                    {doa.tag.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                                        >
                                                            <Tag className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}

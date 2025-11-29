'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { getAsmaUlHusna, type AsmaUlHusnaName } from '@/lib/api/asma-ul-husna'
import { ArrowLeft, Sparkles, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

export default function AsmaUlHusnaPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const { data: names, isLoading } = useQuery<AsmaUlHusnaName[]>({
        queryKey: ['asmaUlHusna'],
        queryFn: getAsmaUlHusna,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    })

    const filteredNames = names?.filter(name =>
        name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.en.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-sand-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

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
                                <span className="hidden sm:inline">Home</span>
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-4 pt-12 md:pt-0">
                        <Sparkles className="h-10 w-10 text-purple-600" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Asma Ul Husna
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        The 99 Beautiful Names of Allah
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 max-w-xl mx-auto"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by name or meaning..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12"
                        />
                    </div>
                </motion.div>

                {/* Names Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNames?.map((name, index) => (
                        <motion.div
                            key={name.number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                        >
                            <Card className="premium-card h-full overflow-hidden hover:shadow-lg transition-all group">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-sm">
                                            {name.number}
                                        </div>
                                        <Sparkles className="h-5 w-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div className="text-center space-y-3">
                                        <div className="text-4xl font-arabic text-foreground mb-2">
                                            {name.name}
                                        </div>
                                        <div className="text-xl text-purple-600 dark:text-purple-400 font-semibold">
                                            {name.transliteration}
                                        </div>
                                        <div className="text-sm text-muted-foreground leading-relaxed">
                                            {name.en.meaning}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredNames?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No names found matching your search.</p>
                    </div>
                )}
            </div>
        </main>
    )
}

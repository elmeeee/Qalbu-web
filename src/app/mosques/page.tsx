'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { getNearbyMosques, type Mosque } from '@/lib/api/mosques'
import { usePrayerTimes } from '@/hooks/use-prayer-times'

export default function MosquesPage() {
    const { t } = useLanguage()
    const { coordinates, error: locationError } = usePrayerTimes()
    const [mosques, setMosques] = useState<Mosque[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (coordinates) {
            setLoading(true)
            getNearbyMosques(coordinates.latitude, coordinates.longitude)
                .then(setMosques)
                .catch((err) => setError('Failed to fetch mosques'))
                .finally(() => setLoading(false))
        } else if (locationError) {
            setLoading(false)
            setError('Please enable location services to find nearby mosques.')
        }
    }, [coordinates, locationError])

    const openDirections = (lat: number, lon: number) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank')
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
                                <span className="hidden sm:inline">Back to Home</span>
                            </Button>
                        </Link>
                    </div>
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl pt-8 md:pt-0">
                        <span className="gradient-text">Nearby Mosques</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">Find the nearest place of worship</p>
                </motion.div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-muted-foreground">Finding nearby mosques...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <p className="text-lg font-medium">{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                ) : mosques.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No mosques found nearby.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mosques.map((mosque, index) => (
                            <motion.div
                                key={mosque.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="premium-card h-full flex flex-col hover:border-blue-500/50 transition-colors group">
                                    <CardContent className="p-6 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                                {mosque.distance} km
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 line-clamp-1">
                                            {mosque.tags.name || "Masjid / Musholla"}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                                            {mosque.tags["addr:street"] || mosque.tags["addr:city"] || "Address not available"}
                                        </p>

                                        <Button
                                            className="w-full gap-2 group-hover:bg-blue-600 group-hover:text-white transition-colors"
                                            variant="outline"
                                            onClick={() => openDirections(mosque.lat, mosque.lon)}
                                        >
                                            <Navigation className="h-4 w-4" />
                                            Get Directions
                                        </Button>
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

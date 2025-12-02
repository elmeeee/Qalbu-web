'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react'
import { getNearbyMosques, type Mosque } from '@/lib/api/mosques'
import { usePrayerTimes } from '@/hooks/use-prayer-times'
import Link from 'next/link'

export function NearbyMosqueCard() {
    const { coordinates, error: locationError } = usePrayerTimes()
    const [mosque, setMosque] = useState<Mosque | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (coordinates) {
            setLoading(true)
            // Fetch mosques with a smaller radius first (1km) to find the absolute closest
            getNearbyMosques(coordinates.latitude, coordinates.longitude, 1000)
                .then((data) => {
                    if (data && data.length > 0) {
                        setMosque(data[0]) // The API already sorts by distance
                    } else {
                        // If no mosque in 1km, try 3km
                        return getNearbyMosques(coordinates.latitude, coordinates.longitude, 3000)
                            .then(data => {
                                if (data && data.length > 0) {
                                    setMosque(data[0])
                                }
                            })
                    }
                })
                .catch((err) => {
                    console.error('Error fetching nearby mosque:', err)
                    setError('Unable to find nearby mosques')
                })
                .finally(() => setLoading(false))
        } else if (locationError) {
            setLoading(false)
            setError('Location access needed')
        }
    }, [coordinates, locationError])

    const openDirections = () => {
        if (mosque) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`, '_blank')
        }
    }

    if (loading) {
        return (
            <div className="h-40 w-full bg-gray-100 dark:bg-gray-800/50 rounded-2xl animate-pulse flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error && !mosque) {
        return (
            <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                <CardContent className="p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-700 dark:text-red-300">
                            {error}
                        </p>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80">
                            Please enable location services
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!mosque) return null

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        Nearest Mosque
                    </span>
                </h3>
                <Link href="/mosques" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors">
                    View All
                </Link>
            </div>

            <div className="overflow-hidden rounded-3xl glass shadow-lg">
                <div className="p-0">
                    <div className="relative h-28 bg-emerald-500/5 w-full overflow-hidden">
                        {/* Abstract map pattern background */}
                        <div className="absolute inset-0 opacity-20 dark:opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                                backgroundSize: '12px 12px'
                            }}
                        />

                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                                <div className="bg-white dark:bg-gray-900 p-2.5 rounded-full shadow-lg border border-emerald-500/20 relative z-10">
                                    <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-foreground dark:text-white line-clamp-1">
                                    {mosque.tags.name || "Masjid / Musholla"}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                    {mosque.tags["addr:street"] || mosque.tags["addr:city"] || "Address not available"}
                                </p>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                                {mosque.distance} km
                            </div>
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 border-0"
                            onClick={openDirections}
                        >
                            <Navigation className="h-4 w-4 mr-2" />
                            Get Directions
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

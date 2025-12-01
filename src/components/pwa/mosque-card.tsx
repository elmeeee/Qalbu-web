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
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Nearest Mosque
                    </span>
                </h3>
                <Link href="/mosques" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    View All
                </Link>
            </div>

            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="p-0">
                    <div className="relative h-24 bg-blue-200 dark:bg-blue-900/20 w-full overflow-hidden">
                        {/* Abstract map pattern background */}
                        <div className="absolute inset-0 opacity-20 dark:opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                                backgroundSize: '10px 10px'
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md animate-bounce">
                                <MapPin className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                                    {mosque.tags.name || "Masjid / Musholla"}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {mosque.tags["addr:street"] || mosque.tags["addr:city"] || "Address not available"}
                                </p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md text-xs font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                                {mosque.distance} km
                            </div>
                        </div>

                        <Button
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-none"
                            size="sm"
                            onClick={openDirections}
                        >
                            <Navigation className="h-3.5 w-3.5 mr-2" />
                            Get Directions
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

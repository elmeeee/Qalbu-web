'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
    getPrayerTimes,
    getCurrentLocation,
    getReverseGeocoding,
    getMethodByCountry,
    type PrayerTimesResponse,
    type Coordinates,
    type LocationData,
    type PrayerSettings,
} from '@/lib/api/prayer-times'

const STORAGE_KEY = 'prayer-settings'

export function usePrayerTimes() {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [locationName, setLocationName] = useState<LocationData | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [settings, setSettings] = useState<PrayerSettings>({
        method: 2,
        school: 0,
        latitudeAdjustment: 1,
        midnightMode: 0,
    })

    // Load settings from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                setSettings(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse stored settings:', e)
            }
        }
    }, [])

    // Get location
    useEffect(() => {
        // Try to get cached location first
        const cachedCoords = localStorage.getItem('cached-location')
        if (cachedCoords) {
            try {
                const coords = JSON.parse(cachedCoords)
                setCoordinates(coords)
                getReverseGeocoding(coords).then(setLocationName)
            } catch (e) {
                // Invalid cache, continue to get fresh location
            }
        }

        getCurrentLocation()
            .then((coords) => {
                setCoordinates(coords)
                setLocationError(null)
                // Cache the location
                localStorage.setItem('cached-location', JSON.stringify(coords))

                // Fetch location name
                getReverseGeocoding(coords).then((location) => {
                    setLocationName(location)
                    // Auto-set method based on country if not already customized
                    const stored = localStorage.getItem(STORAGE_KEY)
                    if (!stored && location.countryCode) {
                        const method = getMethodByCountry(location.countryCode)
                        setSettings((prev) => ({ ...prev, method }))
                    }
                })
            })
            .catch(async (error) => {
                // Try IP-based geolocation as fallback
                try {
                    const response = await fetch('https://ipapi.co/json/')
                    if (response.ok) {
                        const data = await response.json()
                        const coords = { latitude: data.latitude, longitude: data.longitude }
                        setCoordinates(coords)
                        setLocationName({
                            city: data.city,
                            country: data.country_name,
                            countryCode: data.country_code,
                        })
                        localStorage.setItem('cached-location', JSON.stringify(coords))
                        setLocationError(null)
                        return
                    }
                } catch (ipError) {
                    // IP geolocation also failed
                }

                // Final fallback: Use timezone-based default location
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
                let fallbackCoords = { latitude: 21.4225, longitude: 39.826206 } // Mecca default

                // Common timezone fallbacks
                if (timezone.includes('Jakarta') || timezone.includes('Asia/Jakarta')) {
                    fallbackCoords = { latitude: -6.2088, longitude: 106.8456 } // Jakarta
                } else if (timezone.includes('Singapore')) {
                    fallbackCoords = { latitude: 1.3521, longitude: 103.8198 } // Singapore
                } else if (timezone.includes('Kuala_Lumpur')) {
                    fallbackCoords = { latitude: 3.1390, longitude: 101.6869 } // KL
                }

                setLocationError('Using approximate location based on timezone')
                setCoordinates(fallbackCoords)
                getReverseGeocoding(fallbackCoords).then(setLocationName)
            })
    }, [])

    const { data, isLoading, error, refetch } = useQuery<PrayerTimesResponse>({
        queryKey: ['prayerTimes', coordinates, settings, 'v2'], // Versioned to force refresh for tune updates
        queryFn: () => getPrayerTimes(coordinates!, settings),
        enabled: !!coordinates,
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchInterval: 1000 * 60 * 60, // Refetch every hour
    })

    const updateSettings = (newSettings: Partial<PrayerSettings>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }

    return {
        prayerTimes: data,
        isLoading,
        error: error || locationError,
        coordinates,
        locationName,
        settings,
        updateSettings,
        refetch,
    }
}

export function useLocation() {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getCurrentLocation()
            .then((coords) => {
                setCoordinates(coords)
                setError(null)
            })
            .catch((err) => {
                setError(err.message)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const refetch = () => {
        setIsLoading(true)
        getCurrentLocation()
            .then((coords) => {
                setCoordinates(coords)
                setError(null)
            })
            .catch((err) => {
                setError(err.message)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return { coordinates, error, isLoading, refetch }
}

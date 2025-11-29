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
        getCurrentLocation()
            .then((coords) => {
                setCoordinates(coords)
                setLocationError(null)
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
            .catch((error) => {
                setLocationError(error.message)
                // Default to Mecca coordinates if location fails
                const meccaCoords = { latitude: 21.4225, longitude: 39.826206 }
                setCoordinates(meccaCoords)
                getReverseGeocoding(meccaCoords).then(setLocationName)
            })
    }, [])

    const { data, isLoading, error, refetch } = useQuery<PrayerTimesResponse>({
        queryKey: ['prayerTimes', coordinates, settings],
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

'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
    getPrayerTimes,
    getCurrentLocation,
    getReverseGeocoding,
    type PrayerTimesResponse,
    type Coordinates,
    type LocationData,
} from '@/lib/api/prayer-times'

export function usePrayerTimes() {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [locationName, setLocationName] = useState<LocationData | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)

    useEffect(() => {
        getCurrentLocation()
            .then((coords) => {
                setCoordinates(coords)
                setLocationError(null)
                // Fetch location name
                getReverseGeocoding(coords).then(setLocationName)
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
        queryKey: ['prayerTimes', coordinates],
        queryFn: () => getPrayerTimes(coordinates!),
        enabled: !!coordinates,
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchInterval: 1000 * 60 * 60, // Refetch every hour
    })

    return {
        prayerTimes: data,
        isLoading,
        error: error || locationError,
        coordinates,
        locationName,
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

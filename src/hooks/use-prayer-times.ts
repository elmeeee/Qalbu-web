'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
    getPrayerTimes,
    getCurrentLocation,
    type PrayerTimesResponse,
    type Coordinates,
} from '@/lib/api/prayer-times'

export function usePrayerTimes() {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)

    useEffect(() => {
        getCurrentLocation()
            .then((coords) => {
                setCoordinates(coords)
                setLocationError(null)
            })
            .catch((error) => {
                setLocationError(error.message)
                // Default to Mecca coordinates if location fails
                setCoordinates({ latitude: 21.4225, longitude: 39.826206 })
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

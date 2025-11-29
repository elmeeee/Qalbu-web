'use client'

import { useState, useEffect } from 'react'
import { getQiblaDirection } from '@/lib/api/qibla'
import { useLocation } from './use-prayer-times'

export function useQibla() {
    const { coordinates, error: locationError, isLoading: locationLoading } = useLocation()
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)
    const [deviceHeading, setDeviceHeading] = useState<number>(0)
    const [isSupported, setIsSupported] = useState(false)
    const [permissionGranted, setPermissionGranted] = useState(false)

    useEffect(() => {
        if (coordinates) {
            getQiblaDirection(coordinates)
                .then((data) => {
                    setQiblaDirection(data.direction)
                })
                .catch((error) => {
                    console.error('Failed to fetch Qibla direction:', error)
                })
        }
    }, [coordinates])

    useEffect(() => {
        // Check if DeviceOrientationEvent is supported
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
            setIsSupported(true)

            // Request permission for iOS 13+
            if (
                typeof (DeviceOrientationEvent as any).requestPermission === 'function'
            ) {
                // Permission will be requested when user interacts
                setPermissionGranted(false)
            } else {
                setPermissionGranted(true)
            }
        }
    }, [])

    const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission()
                if (permission === 'granted') {
                    setPermissionGranted(true)
                    return true
                }
                return false
            } catch (error) {
                console.error('Error requesting device orientation permission:', error)
                return false
            }
        }
        return true
    }

    useEffect(() => {
        if (!isSupported || !permissionGranted) return

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.alpha !== null) {
                // alpha gives the compass direction
                let heading = event.alpha

                // Adjust for iOS devices
                const webkitEvent = event as any
                if (webkitEvent.webkitCompassHeading) {
                    heading = webkitEvent.webkitCompassHeading
                }

                setDeviceHeading(heading)
            }
        }

        window.addEventListener('deviceorientation', handleOrientation)

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation)
        }
    }, [isSupported, permissionGranted])

    const relativeDirection =
        qiblaDirection !== null ? (qiblaDirection - deviceHeading + 360) % 360 : 0

    return {
        qiblaDirection,
        deviceHeading,
        relativeDirection,
        isSupported,
        permissionGranted,
        requestPermission,
        coordinates,
        isLoading: locationLoading,
        error: locationError,
    }
}

export function useCameraStream() {
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const startCamera = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            })
            setStream(mediaStream)
        } catch (err) {
            setError('Failed to access camera. Please grant camera permissions.')
            console.error('Camera error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(null)
        }
    }

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [stream])

    return {
        stream,
        error,
        isLoading,
        startCamera,
        stopCamera,
    }
}

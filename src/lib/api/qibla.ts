import { Coordinates } from './prayer-times'

export interface QiblaResponse {
    latitude: number
    longitude: number
    direction: number
}

export async function getQiblaDirection(coordinates: Coordinates): Promise<QiblaResponse> {
    const { latitude, longitude } = coordinates
    const url = `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`

    const response = await fetch(url, {
        next: { revalidate: 86400 * 30 }, // Cache for 30 days (doesn't change)
    })

    if (!response.ok) {
        throw new Error('Failed to fetch Qibla direction')
    }

    const data = await response.json()
    return data.data
}

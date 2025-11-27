export interface PrayerTimes {
    Fajr: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
    Sunrise?: string
    Midnight?: string
}

export interface PrayerTimesResponse {
    timings: PrayerTimes
    date: {
        readable: string
        hijri: {
            date: string
            month: {
                en: string
                ar: string
            }
            year: string
            weekday: {
                en: string
                ar: string
            }
        }
    }
    meta: {
        timezone: string
    }
}

export interface Coordinates {
    latitude: number
    longitude: number
}

export async function getPrayerTimes(
    coordinates: Coordinates,
    method: number = 2
): Promise<PrayerTimesResponse> {
    const { latitude, longitude } = coordinates
    const timestamp = Math.floor(Date.now() / 1000)

    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`

    const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
        throw new Error('Failed to fetch prayer times')
    }

    const data = await response.json()
    return data.data
}

export async function getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (error) => {
                reject(new Error(`Failed to get location: ${error.message}`))
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        )
    })
}

export function getNextPrayer(prayerTimes: PrayerTimes): {
    name: string
    time: string
} | null {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const prayers = [
        { name: 'Fajr', time: prayerTimes.Fajr },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr },
        { name: 'Asr', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isha', time: prayerTimes.Isha },
    ]

    for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number)
        const prayerTime = hours * 60 + minutes

        if (prayerTime > currentTime) {
            return prayer
        }
    }

    // If no prayer is left today, return Fajr of tomorrow
    return { name: 'Fajr', time: prayerTimes.Fajr }
}

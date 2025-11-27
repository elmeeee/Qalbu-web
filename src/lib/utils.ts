import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function getTimeUntil(targetTime: Date): string {
    const now = new Date()
    const diff = targetTime.getTime() - now.getTime()

    if (diff < 0) return 'Passed'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
}

export function calculateQiblaDirection(lat: number, lng: number): number {
    // Kaaba coordinates
    const kaabaLat = 21.4225
    const kaabaLng = 39.826206

    const dLng = ((kaabaLng - lng) * Math.PI) / 180
    const lat1 = (lat * Math.PI) / 180
    const lat2 = (kaabaLat * Math.PI) / 180

    const y = Math.sin(dLng) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

    let bearing = (Math.atan2(y, x) * 180) / Math.PI
    bearing = (bearing + 360) % 360

    return bearing
}

export function romanToArabic(roman: string): number {
    const romanNumerals: { [key: string]: number } = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    }

    let result = 0
    for (let i = 0; i < roman.length; i++) {
        const current = romanNumerals[roman[i]]
        const next = romanNumerals[roman[i + 1]]

        if (next && current < next) {
            result -= current
        } else {
            result += current
        }
    }

    return result
}

export function arabicToRoman(num: number): string {
    const romanNumerals: [number, string][] = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ]

    let result = ''
    for (const [value, numeral] of romanNumerals) {
        while (num >= value) {
            result += numeral
            num -= value
        }
    }

    return result
}

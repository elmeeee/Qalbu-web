export interface PrayerTimes {
    Fajr: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
    Sunrise?: string
    Midnight?: string
    Imsak?: string
}

export interface PrayerTimesResponse {
    timings: PrayerTimes
    date: {
        readable: string
        timestamp: string
        gregorian: {
            date: string
            day: string
            month: {
                number: number
                en: string
            }
            year: string
            weekday: {
                en: string
            }
        }
        hijri: {
            date: string
            day: string
            month: {
                number: number
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
        latitude: number
        longitude: number
        timezone: string
        method: {
            id: number
            name: string
        }
        latitudeAdjustmentMethod: string
        midnightMode: string
        school: string
    }
}

export interface Coordinates {
    latitude: number
    longitude: number
}

export interface LocationData {
    city?: string
    region?: string
    country?: string
    countryCode?: string
    formatted?: string
}

export interface PrayerSettings {
    method: number // Calculation method
    school: number // 0 = Shafi, 1 = Hanafi
    latitudeAdjustment: number // 1 = Middle of the Night, 2 = One Seventh, 3 = Angle Based
    midnightMode: number // 0 = Standard (Mid Sunset to Sunrise), 1 = Jafari (Mid Sunset to Fajr)
}

// Calculation Methods
export const CALCULATION_METHODS = [
    // User requested methods (prioritized)
    { id: 19, name: 'Algerian Minister of Religious Affairs and Wakfs' }, // 18 / 17
    { id: 100, name: 'Basque Country' }, // 15 / 15
    { id: 99, name: 'Custom Angles' }, // 16 / 14
    { id: 13, name: 'Diyanet İşleri Başkanlığı' }, // 18 / 17
    { id: 5, name: 'Egyptian General Authority' }, // 19.5 / 17.5
    { id: 101, name: 'Egyptian General Authority (Bis)' }, // 20 / 18
    { id: 102, name: 'Fixed Isha Angle Interval' }, // 19.5 / 90 min
    { id: 103, name: 'France - Angle 15°' }, // 15 / 15
    { id: 104, name: 'France - Angle 18°' }, // 18 / 18
    { id: 1, name: 'Islamic University, Karachi' }, // 18 / 18
    { id: 17, name: 'JAKIM (Jabatan Kemajuan Islam Malaysia)' }, // 20 / 18
    { id: 105, name: 'London Unified Islamic Prayer Timetable' }, // Fallback to 12
    { id: 11, name: 'MUIS (Majlis Ugama Islam Singapura)' }, // 20 / 18
    { id: 3, name: 'Muslim World League (MWL)' }, // 18 / 17
    { id: 12, name: 'Musulmans de France (ex-UOIF) - Angle 12°' }, // 12 / 12
    { id: 2, name: 'North America (ISNA)' }, // 15 / 15
    { id: 0, name: 'Shia Ithna Ashari (Jafari)' }, // 16 / 14
    { id: 20, name: 'SIHAT/KEMENAG (Kementerian Agama RI)' }, // 20 / 18
    { id: 18, name: 'Tunisian Ministry of Religious Affairs' }, // 18 / 18
    { id: 106, name: 'UAE General Authority of Islamic Affairs And Endowments' }, // 19.5 / 90 min
    { id: 4, name: 'Umm Al-Qura, Makkah' }, // 18.5 / 90 min
    { id: 7, name: 'University of Tehran' }, // 17.7 / 14

    // Other Standard Methods
    { id: 8, name: 'Gulf Region' },
    { id: 9, name: 'Kuwait' },
    { id: 10, name: 'Qatar' },
    { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
    { id: 15, name: 'Moonsighting Committee Worldwide' },
    { id: 16, name: 'Dubai (unofficial)' },
    { id: 21, name: 'Morocco' },
    { id: 22, name: 'Comunidade Islamica de Lisboa' },
    { id: 23, name: 'Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan' },
]

// Custom Method Parameters Map
const CUSTOM_PARAMS: Record<number, string> = {
    100: '&method=99&fajrAngle=15&ishaAngle=15', // Basque Country
    99: '&method=99&fajrAngle=16&ishaAngle=14', // Custom Angles default
    101: '&method=99&fajrAngle=20&ishaAngle=18', // Egyptian (Bis)
    102: '&method=8', // Fixed Isha Angle Interval (Gulf 19.5/90)
    103: '&method=99&fajrAngle=15&ishaAngle=15', // France 15
    104: '&method=99&fajrAngle=18&ishaAngle=18', // France 18
    105: '&method=12', // London Unified -> Fallback to UOIF
    106: '&method=8', // UAE -> Gulf
}

// Method Offsets (Tune)
// comma separated values for: Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
const METHOD_OFFSETS: Record<number, string> = {
    // Kemenag RI: User reports +4 mins difference (~18:11 vs 18:15). 
    // Increasing ihtiyat/safety margin to match common local schedules.
    20: '4,4,4,4,4,4,4,4,0',
}

function getMethodParams(method: number): string {
    let params = CUSTOM_PARAMS[method] || `&method=${method}`

    // Add tune if exists
    if (METHOD_OFFSETS[method]) {
        params += `&tune=${METHOD_OFFSETS[method]}`
    }

    return params
}

// Juristic Schools
export const JURISTIC_SCHOOLS = [
    { id: 0, name: 'Shafi (Standard)' },
    { id: 1, name: 'Hanafi' },
]

// Higher Latitude Adjustment Methods
export const LATITUDE_ADJUSTMENTS = [
    { id: 1, name: 'Middle of the Night' },
    { id: 2, name: 'One Seventh' },
    { id: 3, name: 'Angle Based' },
]

// Midnight Calculation Modes
export const MIDNIGHT_MODES = [
    { id: 0, name: 'Standard (Mid Sunset to Sunrise)' },
    { id: 1, name: 'Jafari (Mid Sunset to Fajr)' },
]

// Country list for Ramadan calendar
export const COUNTRIES = [
    { code: 'AF', name: 'Afghanistan', lat: 33.9391, lon: 67.7100 },
    { code: 'AL', name: 'Albania', lat: 41.1533, lon: 20.1683 },
    { code: 'DZ', name: 'Algeria', lat: 36.7372, lon: 3.0865 },
    { code: 'AE', name: 'United Arab Emirates', lat: 24.4539, lon: 54.3773 },
    { code: 'SA', name: 'Saudi Arabia', lat: 21.4225, lon: 39.8262 },
    { code: 'EG', name: 'Egypt', lat: 30.0444, lon: 31.2357 },
    { code: 'ID', name: 'Indonesia', lat: -6.2088, lon: 106.8456 },
    { code: 'MY', name: 'Malaysia', lat: 3.1390, lon: 101.6869 },
    { code: 'TR', name: 'Turkey', lat: 39.9334, lon: 32.8597 },
    { code: 'PK', name: 'Pakistan', lat: 33.6844, lon: 73.0479 },
    { code: 'BD', name: 'Bangladesh', lat: 23.8103, lon: 90.4125 },
    { code: 'IR', name: 'Iran', lat: 35.6892, lon: 51.3890 },
    { code: 'IQ', name: 'Iraq', lat: 33.3152, lon: 44.3661 },
    { code: 'MA', name: 'Morocco', lat: 33.9716, lon: -6.8498 },
    { code: 'NG', name: 'Nigeria', lat: 9.0765, lon: 7.3986 },
    { code: 'SG', name: 'Singapore', lat: 1.3521, lon: 103.8198 },
    { code: 'GB', name: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    { code: 'US', name: 'United States', lat: 38.9072, lon: -77.0369 },
    { code: 'CA', name: 'Canada', lat: 45.4215, lon: -75.6972 },
    { code: 'AU', name: 'Australia', lat: -33.8688, lon: 151.2093 },
    { code: 'FR', name: 'France', lat: 48.8566, lon: 2.3522 },
    { code: 'DE', name: 'Germany', lat: 52.5200, lon: 13.4050 },
    { code: 'NL', name: 'Netherlands', lat: 52.3676, lon: 4.9041 },
    { code: 'QA', name: 'Qatar', lat: 25.2854, lon: 51.5310 },
    { code: 'KW', name: 'Kuwait', lat: 29.3759, lon: 47.9774 },
    { code: 'JO', name: 'Jordan', lat: 31.9454, lon: 35.9284 },
    { code: 'TN', name: 'Tunisia', lat: 36.8065, lon: 10.1815 },
    { code: 'RU', name: 'Russia', lat: 55.7558, lon: 37.6173 },
]

export async function getReverseGeocoding(coordinates: Coordinates): Promise<LocationData> {
    const { latitude, longitude } = coordinates
    try {
        // Try BigDataCloud first (CORS friendly)
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        if (response.ok) {
            const data = await response.json()
            return {
                city: data.city || data.locality || data.principalSubdivision,
                region: data.principalSubdivision,
                country: data.countryName,
                countryCode: data.countryCode,
                formatted: [
                    data.city || data.locality,
                    data.principalSubdivision,
                    data.countryName
                ].filter(Boolean).join(', ')
            }
        }
    } catch (e) {
        // Silent fail for first attempt
    }

    try {
        // Fallback to Nominatim
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=en`,
            {
                headers: {
                    'User-Agent': 'MuslimPrayerApp/1.0',
                    'Accept-Language': 'en'
                }
            }
        )
        if (response.ok) {
            const data = await response.json()
            const address = data.address
            return {
                city: address.city || address.town || address.village || address.county,
                region: address.state || address.region,
                country: address.country,
                countryCode: address.country_code?.toUpperCase(),
                formatted: data.display_name
            }
        }
    } catch (e) {
        // Silent fail for second attempt
    }

    return {
        formatted: 'Unknown Location',
        city: 'Current Location'
    }
}

export async function getPrayerTimes(
    coordinates: Coordinates,
    settings?: Partial<PrayerSettings>,
    date?: Date
): Promise<PrayerTimesResponse> {
    const { latitude, longitude } = coordinates
    const timestamp = date ? Math.floor(date.getTime() / 1000) : Math.floor(Date.now() / 1000)

    // Default settings
    const defaultSettings: PrayerSettings = {
        method: 2, // ISNA
        school: 0, // Shafi
        latitudeAdjustment: 1, // Middle of the Night
        midnightMode: 0, // Standard
    }

    const finalSettings = { ...defaultSettings, ...settings }

    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}${getMethodParams(finalSettings.method)}&school=${finalSettings.school}&latitudeAdjustmentMethod=${finalSettings.latitudeAdjustment}&midnightMode=${finalSettings.midnightMode}`

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

export async function getCalendar(
    coordinates: Coordinates,
    month: number,
    year: number,
    settings?: Partial<PrayerSettings>
): Promise<PrayerTimesResponse[]> {
    const { latitude, longitude } = coordinates

    // Default settings
    const defaultSettings: PrayerSettings = {
        method: 2, // ISNA
        school: 0, // Shafi
        latitudeAdjustment: 1, // Middle of the Night
        midnightMode: 0, // Standard
    }

    const finalSettings = { ...defaultSettings, ...settings }

    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}${getMethodParams(finalSettings.method)}&school=${finalSettings.school}&latitudeAdjustmentMethod=${finalSettings.latitudeAdjustment}&midnightMode=${finalSettings.midnightMode}`

    const response = await fetch(url, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
        throw new Error('Failed to fetch calendar')
    }

    const data = await response.json()
    return data.data
}

// Get Ramadan dates for a specific Hijri year
export async function getRamadanCalendar(
    coordinates: Coordinates,
    hijriYear: number,
    settings?: Partial<PrayerSettings>
): Promise<PrayerTimesResponse[]> {
    const { latitude, longitude } = coordinates

    // Default settings
    const defaultSettings: PrayerSettings = {
        method: 2, // ISNA
        school: 0, // Shafi
        latitudeAdjustment: 1, // Middle of the Night
        midnightMode: 0, // Standard
    }

    const finalSettings = { ...defaultSettings, ...settings }

    // Ramadan is the 9th month in Hijri calendar
    const url = `https://api.aladhan.com/v1/hijriCalendar/${hijriYear}/9?latitude=${latitude}&longitude=${longitude}${getMethodParams(finalSettings.method)}&school=${finalSettings.school}&latitudeAdjustmentMethod=${finalSettings.latitudeAdjustment}&midnightMode=${finalSettings.midnightMode}`

    const response = await fetch(url, {
        next: { revalidate: 86400 * 30 }, // Cache for 30 days
    })

    if (!response.ok) {
        throw new Error('Failed to fetch Ramadan calendar')
    }

    const data = await response.json()
    return data.data
}

// Get method based on country code
export function getMethodByCountry(countryCode: string): number {
    const methodMap: { [key: string]: number } = {
        'SA': 4, // Umm Al-Qura
        'AE': 16, // Dubai
        'EG': 5, // Egyptian General Authority
        'ID': 20, // Kementerian Agama Indonesia
        'MY': 17, // JAKIM
        'TR': 13, // Diyanet
        'PK': 1, // University of Karachi
        'BD': 1, // University of Karachi
        'IR': 7, // Tehran
        'IQ': 8, // Gulf Region
        'MA': 21, // Morocco
        'DZ': 19, // Algeria
        'TN': 18, // Tunisia
        'SG': 11, // MUIS
        'QA': 10, // Qatar
        'KW': 9, // Kuwait
        'JO': 23, // Jordan
        'RU': 14, // Russia
        'FR': 12, // UOIF
        'GB': 2, // ISNA
        'US': 2, // ISNA
        'CA': 2, // ISNA
        'AU': 2, // ISNA
        'DE': 2, // ISNA
        'NL': 2, // ISNA
    }

    return methodMap[countryCode] || 2 // Default to ISNA
}

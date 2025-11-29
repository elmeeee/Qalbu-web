export interface HijriDate {
    date: string
    format: string
    day: string
    weekday: {
        en: string
        ar: string
    }
    month: {
        number: number
        en: string
        ar: string
    }
    year: string
    designation: {
        abbreviated: string
        expanded: string
    }
    holidays: string[]
}

export interface GregorianDate {
    date: string
    format: string
    day: string
    weekday: {
        en: string
    }
    month: {
        number: number
        en: string
    }
    year: string
    designation: {
        abbreviated: string
        expanded: string
    }
}

export interface IslamicCalendarDay {
    timings: {
        Fajr: string
        Sunrise: string
        Dhuhr: string
        Asr: string
        Sunset: string
        Maghrib: string
        Isha: string
        Imsak: string
        Midnight: string
    }
    date: {
        readable: string
        timestamp: string
        hijri: HijriDate
        gregorian: GregorianDate
    }
    meta: {
        latitude: number
        longitude: number
        timezone: string
        method: {
            id: number
            name: string
        }
    }
}

export interface IslamicHoliday {
    date: string
    hijriDate: HijriDate
    gregorianDate: GregorianDate
    holiday: string
}

// Get Hijri calendar for a specific month and year
export async function getHijriCalendar(
    hijriMonth: number,
    hijriYear: number,
    latitude?: number,
    longitude?: number
): Promise<IslamicCalendarDay[]> {
    let url = `https://api.aladhan.com/v1/hijriCalendar/${hijriYear}/${hijriMonth}`

    if (latitude && longitude) {
        url += `?latitude=${latitude}&longitude=${longitude}`
    }

    const response = await fetch(url, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
        throw new Error('Failed to fetch Hijri calendar')
    }

    const data = await response.json()
    return data.data
}

// Get Gregorian calendar with Hijri dates
export async function getGregorianCalendar(
    gregorianMonth: number,
    gregorianYear: number,
    latitude?: number,
    longitude?: number
): Promise<IslamicCalendarDay[]> {
    let url = `https://api.aladhan.com/v1/calendar/${gregorianYear}/${gregorianMonth}`

    if (latitude && longitude) {
        url += `?latitude=${latitude}&longitude=${longitude}`
    }

    const response = await fetch(url, {
        next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
        throw new Error('Failed to fetch calendar')
    }

    const data = await response.json()
    return data.data
}

// Get current Hijri date
export async function getCurrentHijriDate(): Promise<HijriDate> {
    const url = 'https://api.aladhan.com/v1/gToH'

    const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
        throw new Error('Failed to fetch current Hijri date')
    }

    const data = await response.json()
    return data.data.hijri
}

// Get Islamic holidays for a specific Hijri year
export async function getIslamicHolidays(hijriYear: number): Promise<IslamicHoliday[]> {
    // Important Islamic dates
    const importantDates = [
        { month: 1, day: 1, name: 'Islamic New Year' },
        { month: 1, day: 10, name: 'Day of Ashura' },
        { month: 3, day: 12, name: 'Mawlid al-Nabi (Prophet\'s Birthday)' },
        { month: 7, day: 27, name: 'Isra and Mi\'raj' },
        { month: 8, day: 15, name: 'Mid-Sha\'ban' },
        { month: 9, day: 1, name: 'First Day of Ramadan' },
        { month: 9, day: 27, name: 'Laylat al-Qadr' },
        { month: 10, day: 1, name: 'Eid al-Fitr' },
        { month: 12, day: 9, name: 'Day of Arafah' },
        { month: 12, day: 10, name: 'Eid al-Adha' },
    ]

    const holidays: IslamicHoliday[] = []

    for (const date of importantDates) {
        try {
            const url = `https://api.aladhan.com/v1/hToG/${date.day}-${date.month}-${hijriYear}`
            const response = await fetch(url, {
                next: { revalidate: 86400 * 30 }, // Cache for 30 days
            })

            if (response.ok) {
                const data = await response.json()
                holidays.push({
                    date: `${date.day}-${date.month}-${hijriYear}`,
                    hijriDate: data.data.hijri,
                    gregorianDate: data.data.gregorian,
                    holiday: date.name,
                })
            }
        } catch (error) {
            console.error(`Failed to fetch holiday: ${date.name}`, error)
        }
    }

    return holidays
}

// Get upcoming Islamic holidays (next 90 days)
export async function getUpcomingHolidays(): Promise<IslamicHoliday[]> {
    const currentHijri = await getCurrentHijriDate()
    const currentYear = parseInt(currentHijri.year)

    // Get holidays for current and next Hijri year
    const currentYearHolidays = await getIslamicHolidays(currentYear)
    const nextYearHolidays = await getIslamicHolidays(currentYear + 1)

    const allHolidays = [...currentYearHolidays, ...nextYearHolidays]

    // Filter to only upcoming holidays (within next 90 days)
    const today = new Date()
    const in90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)

    return allHolidays.filter(holiday => {
        const holidayDate = new Date(holiday.gregorianDate.date)
        return holidayDate >= today && holidayDate <= in90Days
    }).sort((a, b) => {
        const dateA = new Date(a.gregorianDate.date)
        const dateB = new Date(b.gregorianDate.date)
        return dateA.getTime() - dateB.getTime()
    })
}

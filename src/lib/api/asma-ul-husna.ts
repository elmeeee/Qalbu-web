export interface AsmaUlHusnaName {
    number: number
    name: string
    transliteration: string
    en: {
        meaning: string
    }
    ar: {
        meaning: string
    }
}

export async function getAsmaUlHusna(): Promise<AsmaUlHusnaName[]> {
    const url = 'https://api.aladhan.com/v1/asmaAlHusna'

    const response = await fetch(url, {
        next: { revalidate: 86400 * 30 }, // Cache for 30 days (static data)
    })

    if (!response.ok) {
        throw new Error('Failed to fetch Asma Ul Husna')
    }

    const data = await response.json()
    return data.data
}
